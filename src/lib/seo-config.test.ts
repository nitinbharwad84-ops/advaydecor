import assert from 'node:assert';
import { getSeoConfig, DEFAULTS } from './seo-config.ts';

async function runTests() {
    console.log('🧪 Running tests for getSeoConfig...');

    // Mock Supabase client that returns an error
    const mockSupabaseError = {
        from: () => ({
            select: () => ({
                eq: () => ({
                    single: async () => ({ data: null, error: { message: 'Database error' } })
                })
            })
        })
    };

    // Mock Supabase client that returns no data
    const mockSupabaseEmpty = {
        from: () => ({
            select: () => ({
                eq: () => ({
                    single: async () => ({ data: null, error: null })
                })
            })
        })
    };

    // Mock Supabase client that returns valid data
    const mockSupabaseSuccess = {
        from: () => ({
            select: () => ({
                eq: () => ({
                    single: async () => ({
                        data: {
                            title: 'Custom Title',
                            description: 'Custom Description',
                            keywords: 'key1, key2, key3',
                            og_title: 'OG Title',
                            og_description: 'OG Description'
                        },
                        error: null
                    })
                })
            })
        })
    };

    // Test case 1: Fallback when Supabase returns error
    try {
        console.log('Test 1: Fallback when Supabase returns error');
        const config = await getSeoConfig('home', mockSupabaseError);
        assert.strictEqual(config.title, DEFAULTS.home.title);
        assert.strictEqual(config.description, DEFAULTS.home.description);
        assert.deepStrictEqual(config.keywords, DEFAULTS.home.keywords);
        console.log('✅ Test 1 passed');
    } catch (e) {
        console.error('❌ Test 1 failed:', e);
        process.exit(1);
    }

    // Test case 2: Fallback when Supabase returns no data
    try {
        console.log('Test 2: Fallback when Supabase returns no data');
        const config = await getSeoConfig('shop', mockSupabaseEmpty);
        assert.strictEqual(config.title, DEFAULTS.shop.title);
        assert.deepStrictEqual(config.keywords, DEFAULTS.shop.keywords);
        console.log('✅ Test 2 passed');
    } catch (e) {
        console.error('❌ Test 2 failed:', e);
        process.exit(1);
    }

    // Test case 3: Success when Supabase returns valid data
    try {
        console.log('Test 3: Success when Supabase returns valid data');
        const config = await getSeoConfig('home', mockSupabaseSuccess);
        assert.strictEqual(config.title, 'Custom Title');
        assert.strictEqual(config.description, 'Custom Description');
        assert.deepStrictEqual(config.keywords, ['key1', 'key2', 'key3']);
        assert.strictEqual(config.ogTitle, 'OG Title');
        assert.strictEqual(config.ogDescription, 'OG Description');
        console.log('✅ Test 3 passed');
    } catch (e) {
        console.error('❌ Test 3 failed:', e);
        process.exit(1);
    }

    // Test case 4: Partial data (keywords missing in DB, should fallback)
    const mockSupabasePartial = {
        from: () => ({
            select: () => ({
                eq: () => ({
                    single: async () => ({
                        data: {
                            title: 'New Title',
                            description: null,
                            keywords: null,
                        },
                        error: null
                    })
                })
            })
        })
    };

    try {
        console.log('Test 4: Partial data from DB');
        const config = await getSeoConfig('home', mockSupabasePartial);
        assert.strictEqual(config.title, 'New Title');
        assert.strictEqual(config.description, DEFAULTS.home.description);
        assert.deepStrictEqual(config.keywords, DEFAULTS.home.keywords);
        console.log('✅ Test 4 passed');
    } catch (e) {
        console.error('❌ Test 4 failed:', e);
        process.exit(1);
    }

    // Test case 5: Fallback for unknown page key
    try {
        console.log('Test 5: Unknown page key fallback');
        const config = await getSeoConfig('invalid-key', mockSupabaseError);
        assert.strictEqual(config.title, 'AdvayDecor');
        assert.strictEqual(config.description, '');
        assert.deepStrictEqual(config.keywords, []);
        console.log('✅ Test 5 passed');
    } catch (e) {
        console.error('❌ Test 5 failed:', e);
        process.exit(1);
    }

    console.log('🎉 All tests passed!');
}

runTests();
