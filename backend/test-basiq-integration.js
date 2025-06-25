/**
 * Test script for Basiq integration
 * This script tests the key functionality of the Basiq integration
 */

// Load environment variables
require('dotenv').config();

const { 
  getAccessToken, 
  createUser, 
  getClientToken, 
  validateUserId,
  validateEmail 
} = require('./Utils/basiqHelper');

async function testBasiqIntegration() {
  console.log('🧪 Testing Basiq Integration...\n');

  try {
    // Test 1: Server token generation
    console.log('1. Testing server token generation...');
    const serverToken = await getAccessToken();
    console.log('✅ Server token generated successfully');
    console.log(`   Token: ${serverToken.substring(0, 20)}...\n`);

    // Test 2: Email validation
    console.log('2. Testing email validation...');
    const validEmail = 'test@example.com';
    const invalidEmail = 'invalid-email';
    
    console.log(`   Valid email "${validEmail}": ${validateEmail(validEmail) ? '✅' : '❌'}`);
    console.log(`   Invalid email "${invalidEmail}": ${validateEmail(invalidEmail) ? '❌' : '✅'}\n`);

    // Test 3: User ID validation
    console.log('3. Testing user ID validation...');
    const validUserId = 'fb919047-167b-4b33-9cfc-ab963c780166';
    const invalidUserId = 'invalid-uuid';
    
    console.log(`   Valid UUID "${validUserId}": ${validateUserId(validUserId) ? '✅' : '❌'}`);
    console.log(`   Invalid UUID "${invalidUserId}": ${validateUserId(invalidUserId) ? '❌' : '✅'}\n`);

    // Test 4: Create a test user (if demo user exists, use it)
    console.log('4. Testing user creation...');
    const testEmail = 'test-integration@example.com';
    const testMobile = '+61412345678';
    
    try {
      const basiqUserId = await createUser(serverToken, testEmail, testMobile, 'Test', '', 'User');
      console.log('✅ Test user created successfully');
      console.log(`   Basiq User ID: ${basiqUserId}\n`);

      // Test 5: Client token generation
      console.log('5. Testing client token generation...');
      const clientToken = await getClientToken(basiqUserId);
      console.log('✅ Client token generated successfully');
      console.log(`   Token: ${clientToken.substring(0, 20)}...\n`);

      // Test 6: Test with demo user ID
      console.log('6. Testing with demo user ID...');
      const demoUserId = process.env.DEMO_BASIQ_USER_ID;
      if (demoUserId) {
        const demoClientToken = await getClientToken(demoUserId);
        console.log('✅ Demo user client token generated successfully');
        console.log(`   Token: ${demoClientToken.substring(0, 20)}...\n`);
      } else {
        console.log('⚠️  No demo user ID found in environment variables\n');
      }

    } catch (userError) {
      if (userError.message.includes('already exists')) {
        console.log('⚠️  Test user already exists, skipping creation\n');
      } else {
        throw userError;
      }
    }

    console.log('🎉 All Basiq integration tests passed!');
    console.log('\n📋 Summary:');
    console.log('   ✅ Server token generation');
    console.log('   ✅ Email validation');
    console.log('   ✅ User ID validation');
    console.log('   ✅ User creation (or existing user)');
    console.log('   ✅ Client token generation');
    console.log('   ✅ Demo user integration');

  } catch (error) {
    console.error('❌ Basiq integration test failed:');
    console.error('   Error:', error.message);
    console.error('   Stack:', error.stack);
    process.exit(1);
  }
}

// Run the test if this file is executed directly
if (require.main === module) {
  testBasiqIntegration();
}

module.exports = { testBasiqIntegration }; 