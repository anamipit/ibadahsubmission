const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

console.log('🔧 Supabase Configuration:');
console.log('- URL:', supabaseUrl ? `${supabaseUrl.substring(0, 30)}...` : 'MISSING');
console.log('- Key:', supabaseKey ? `${supabaseKey.substring(0, 20)}...` : 'MISSING');

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase environment variables. Please check your .env file.');
    console.error('- SUPABASE_URL:', supabaseUrl ? 'OK' : 'MISSING');
    console.error('- SUPABASE_ANON_KEY:', supabaseKey ? 'OK' : 'MISSING');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);
console.log('✅ Supabase client created successfully');

module.exports = supabase;