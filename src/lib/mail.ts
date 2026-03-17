import nodemailer from 'nodemailer';

/**
 * Universal email sender.
 * 1. Tries SMTP (Gmail/Nodemailer) if configured.
 * 2. Logs to console if configuration is missing or fails.
 */
export type EmailProfile = 'default' | 'order' | 'welcome' | 'otp' | 'support';

interface SendEmailParams {
    to: string;
    subject: string;
    html: string;
    fromProfile?: EmailProfile;
}

/**
 * Universal email sender with support for multiple SMTP profiles.
 */
export async function sendEmail({ to, subject, html, fromProfile = 'default' }: SendEmailParams) {
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    let fromName = 'AdvayDecor';

    // Switch name based on profile if needed
    if (fromProfile === 'order') {
        fromName = 'AdvayDecor Orders';
    } else if (fromProfile === 'welcome') {
        fromName = 'AdvayDecor';
    } else if (fromProfile === 'otp') {
        fromName = 'AdvayDecor Security';
    } else if (fromProfile === 'support') {
        fromName = 'AdvayDecor Support';
    }

    // 1. Try Nodemailer/SMTP
    if (user && pass) {
        try {
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: { user, pass },
            });

            await transporter.sendMail({
                from: `"${fromName}" <${user}>`,
                to,
                subject,
                html,
            });
            return { success: true, method: 'nodemailer', profile: fromProfile };
        } catch (err) {
            console.error(`Nodemailer Error (${fromProfile}):`, err);
        }
    }

    // 2. Fallback: Console Log
    console.log('------------------------------------------');
    console.log(`FROM PROFILE: ${fromProfile}`);
    console.log(`EMAIL TO: ${to}`);
    console.log(`SUBJECT: ${subject}`);
    const otpMatch = html.match(/>(\d{8})</) || html.match(/\b\d{6}\b/);
    console.log(`CODE (extracted): ${otpMatch?.[0] || 'No code found'}`);
    console.log('ALERT: SMTP not configured for this profile. Logged above.');
    console.log('------------------------------------------');

    return { success: true, method: 'console', profile: fromProfile };
}
