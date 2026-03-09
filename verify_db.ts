import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';

let envStr = fs.readFileSync('.env.local', 'utf-8');
envStr.split('\n').forEach(line => {
    const [key, ...vals] = line.split('=');
    if (key && vals.length) {
        process.env[key.trim()] = vals.join('=').trim().replace(/^"|"$/g, '');
    }
});

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRole) {
    console.error('Missing env vars');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRole);

async function checkDb() {
    console.log('Checking orders table for constraints and columns...');
    
    // Check if cancel_reason column exists
    const { data, error } = await supabase.from('orders').select('cancel_reason').limit(1);
    if (error) {
        console.error('Error selecting cancel_reason (maybe column does not exist):', error.message);
    } else {
        console.log('cancel_reason column exists!');
    }
    
    // Try to update the first order to 'Cancellation Requested' to see if constraint blocks it
    const { data: order, error: orderErr } = await supabase.from('orders').select('id, status').limit(1).single();
    if (order) {
        console.log('Testing update on order', order.id);
        const { error: updateErr } = await supabase.from('orders').update({ status: 'Cancellation Requested' }).eq('id', order.id);
        if (updateErr) {
            console.error('Constraint error when updating status:', updateErr.message);
        } else {
            console.log('Successfully updated status! Constraints are correct.');
            // Revert it
            await supabase.from('orders').update({ status: order.status }).eq('id', order.id);
        }
    } else {
        console.log('No orders to test.');
    }
}

checkDb();
