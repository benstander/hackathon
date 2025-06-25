const axios = require('axios');
const qs = require('qs');

// Token caching for better performance (from starter kit)
const REFRESH_INTERVAL = 1000 * 60 * 30; // 30 minutes
let serverToken = undefined;
let serverTokenRefreshDate = 0;

// Validation utilities (from starter kit)
const userIdRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validateUserId = (userId) => {
  return userIdRegex.test(userId);
};

const validateEmail = (email) => {
  return emailRegex.test(email);
};

// Helper function to get properly formatted API key
function getFormattedApiKey() {
  const apiKey = process.env.BASIQ_API_KEY;
  if (!apiKey) {
    throw new Error('BASIQ_API_KEY environment variable is not set');
  }
  
  try {
    // Decode the Base64 string to get the raw client ID and secret
    const decoded = Buffer.from(apiKey, 'base64').toString('utf-8');
    // Re-encode it properly for Basic auth
    return Buffer.from(decoded).toString('base64');
  } catch (error) {
    // If decoding fails, assume it's already in the correct format
    return apiKey;
  }
}

async function getAccessToken() {
  // Use cached token if still valid
  if (!serverToken || Date.now() - serverTokenRefreshDate > REFRESH_INTERVAL) {
    await updateServerToken();
  }
  return serverToken;
}

async function updateServerToken() {
  serverToken = await getNewServerToken();
  serverTokenRefreshDate = Date.now();
}

async function getNewServerToken() {
  // Query string 
  let data = qs.stringify({
    'scope': 'SERVER_ACCESS' 
  })

  let config = {
    method: 'post',
    url: 'https://au-api.basiq.io/token',
    headers: { 
      'Authorization': `Basic ${getFormattedApiKey()}`, 
      'Content-Type': 'application/x-www-form-urlencoded', 
      'basiq-version': '3.0'
    },
    data : data
  };

  try {
    const response = await axios(config)
    return response.data.access_token
  } catch (error) {
    console.error('Error generating server token:', error.response?.data || error.message)
    throw new Error('Failed to generate server token')
  }
}

async function createUser(accessToken, email, mobileNumber, firstName, middleName, lastName) {
  // Validate email
  if (!validateEmail(email)) {
    throw new Error('Invalid email format');
  }

  let data = {
    email: email,
    mobile: mobileNumber
  }

  // Optional parameters
  if (firstName) data.firstName = firstName;
  if (middleName) data.middleName = middleName;
  if (lastName) data.lastName = lastName;

  let config = {
    method: 'post',
    url: 'https://au-api.basiq.io/users',
    headers: { 
      'Authorization': `Bearer ${accessToken}`, 
      'Accept': 'application/json', 
      'Content-Type': 'application/json'
    },
    data: JSON.stringify(data)
  };

  try {
    const response = await axios(config)
    return response.data.id
  } catch (error) {
    console.error('Error creating user:', error.response?.data || error.message)
    if (error.response?.status === 409) {
      throw new Error('User already exists with this email')
    }
    throw new Error('Failed to create user')
  }
}

async function getClientToken(userId) {
  // Validate userId
  if (!validateUserId(userId)) {
    throw new Error('Invalid user ID format');
  }

  const payload = {
    scope: 'CLIENT_ACCESS',
    userId: userId,
  };

  let config = {
    method: 'post',
    url: 'https://au-api.basiq.io/token',
    headers: {
      'Authorization': `Basic ${getFormattedApiKey()}`,
      'Content-Type':  'application/json',
      'basiq-version': '3.0'
    },
    data: payload
  }

  try {
    const response = await axios(config)
    return response.data.access_token;
  } catch(error) {
    console.error('Error generating client token:', error.response?.data || error.message)
    throw new Error('Failed to generate client token')
  }
}

async function retrieveUser(userId, accessToken) {
  // Validate userId
  if (!validateUserId(userId)) {
    throw new Error('Invalid user ID format');
  }

  let config = {
    method: 'get',
    url: `https://au-api.basiq.io/users/${userId}`,
    headers: { 
      'Authorization': `Bearer ${accessToken}`,
      'Accept': 'application/json'
    }
  };

  try {
    const response = await axios(config)
    return response.data
  } catch (error) {
    console.error('Error retrieving user:', error.response?.data || error.message)

    if (error.response?.status === 404) {
      const error = new Error('Basiq user not found');
      error.status = 404;
      throw error;
    }

    throw new Error('Failed to retrieve user')
  }
}

async function listUserAccounts(accessToken, userId) {
  // Validate userId
  if (!validateUserId(userId)) {
    throw new Error('Invalid user ID format');
  }

  let config = {
    method: 'get',
    url: `https://au-api.basiq.io/users/${userId}/accounts`,
    headers: { 
      'Authorization': `Bearer ${accessToken}`, 
      'Accept': 'application/json'
    }
  };

  try {
    const response = await axios(config)
    return response.data
  } catch(error) {
    console.error('Error listing user accounts:', error.response?.data || error.message)
    throw new Error('Failed to list user accounts')
  }
}

async function retrieveUserAccount(accessToken, userId, accountId) {
  // Validate userId and accountId
  if (!validateUserId(userId)) {
    throw new Error('Invalid user ID format');
  }

  let config = {
    method: 'get',
    url: `https://au-api.basiq.io/users/${userId}/accounts/${accountId}`,
    headers: { 
      'Authorization': `Bearer ${accessToken}`, 
      'Accept': 'application/json',
    }
  };

  try {
    const response = await axios(config)
    return response.data
  } catch(error) {
    console.error('Error retrieving user account:', error.response?.data || error.message)
    throw new Error('Failed to retrieve user account')
  }
}

async function listUserTransactions(accessToken, userId) {
  // Validate userId
  if (!validateUserId(userId)) {
    throw new Error('Invalid user ID format');
  }

  const config = {
    method: 'get',
    url: `https://au-api.basiq.io/users/${userId}/transactions`,
    headers: { 
      'Authorization': `Bearer ${accessToken}`, 
      'Accept': 'application/json',
    }
  }

  try {
    const response = await axios(config)
    return response.data
  } catch(error) {
    console.error('Error listing user transactions:', error.response?.data || error.message)
    throw new Error('Failed to list user transactions')
  }
}

async function retrieveUserTransaction(accessToken, userId, transactionId) {
  // Validate userId
  if (!validateUserId(userId)) {
    throw new Error('Invalid user ID format');
  }

  const config = {
    method: 'get',
    url: `https://au-api.basiq.io/users/${userId}/transactions/${transactionId}`,
    headers: { 
      'Authorization': `Bearer ${accessToken}`, 
      'Accept': 'application/json',
    }
  } 

  try {
    const response = await axios(config)
    return response.data
  } catch(error) {
    console.error('Error retrieving user transaction:', error.response?.data || error.message)
    throw new Error('Failed to retrieve user transaction')
  }  
}

// New function to get authorization header (from starter kit)
async function getBasiqAuthorizationHeader() {
  const token = await getAccessToken();
  return `Bearer ${token}`;
}

module.exports = { 
  getAccessToken, 
  createUser, 
  getClientToken, 
  retrieveUser, 
  listUserAccounts, 
  retrieveUserAccount, 
  listUserTransactions, 
  retrieveUserTransaction,
  getBasiqAuthorizationHeader,
  validateUserId,
  validateEmail
}

