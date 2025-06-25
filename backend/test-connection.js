require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

console.log('🔍 Testing Supabase Connection...');
console.log('URL:', supabaseUrl);
console.log('Key:', supabaseKey ? '✅ Set' : '❌ Missing');

if (!supabaseUrl || !supabaseKey) {
  console.log('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  try {
    console.log('\n📊 Testing database connection...');
    
    // Test if we can query the users table
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('*')
      .limit(1);
    
    if (usersError) {
      console.log('❌ Users table error:', usersError.message);
      console.log('💡 You may need to run the database schema in Supabase SQL Editor');
      console.log('📄 Schema file: backend/db/schema.sql');
    } else {
      console.log('✅ Users table accessible');
    }
    
    // Test if we can query the bank_connections table
    const { data: connections, error: connectionsError } = await supabase
      .from('bank_connections')
      .select('*')
      .limit(1);
    
    if (connectionsError) {
      console.log('❌ Bank connections table error:', connectionsError.message);
    } else {
      console.log('✅ Bank connections table accessible');
    }
    
    // Test if we can query the bank_accounts table
    const { data: accounts, error: accountsError } = await supabase
      .from('bank_accounts')
      .select('*')
      .limit(1);
    
    if (accountsError) {
      console.log('❌ Bank accounts table error:', accountsError.message);
    } else {
      console.log('✅ Bank accounts table accessible');
    }
    
    console.log('\n🎉 Database connection test completed!');
    
  } catch (error) {
    console.log('❌ Connection test failed:', error.message);
  }
}

testConnection(); 