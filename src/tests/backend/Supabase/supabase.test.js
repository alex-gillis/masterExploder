const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_KEY);

describe('Supabase Connection', () => {
    test('Should fetch data from a test table', async () => {
        const { data, error } = await supabase.from('users').select('*').limit(1);
        expect(error).toBeNull();
        expect(data.length).toBeGreaterThan(0);
    });
});
