const axios = require('axios');
const qs = require('qs');

async function getAccessToken() {
  // Query string 
  let data = qs.stringify({
    'scope': 'SERVER_ACCESS' 
  })

  let config = {
    method: 'post',
    url: 'https://au-api.basiq.io/token',
    headers: { 
      'Authorization': `Basic ${process.env.BASIQ_API_KEYS}`, 
      'Content-Type': 'application/x-www-form-urlencoded', 
      'basiq-version': '3.0'
    },
    data : data
  };

  try {
    const response = await axios(config)
    return response.data.access_token
  } catch (error) {
    console.error('Error generating token' + error)
    throw error
  }
}

async function createUser(accessToken, email, mobileNumber, firstName, middleName, lastName) {
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
    console.error('Error creating user' + error)
    throw error
  }
}

async function getClientToken(userId) {
  const payload = {
    scope: 'CLIENT_ACCESS',
    userId: userId,
  };

  let config = {
    method: 'post',
    url: 'https://au-api.basiq.io/token',
    headers: {
      'Authorization': `Basic ${process.env.BASIQ_API_KEYS}`,
      'Content-Type':  'application/json',
      'basiq-version': '3.0'
    },
    data: payload
  }

  try {
    const response = await axios(config)
    return response.data.access_token;
  } catch(error) {
    throw error
  }
}

async function retrieveUser(userId, accessToken) {
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
    console.error('Error retrieving user' + error)

    if (error.response.status === 404) {
      const error = new Error('Basiq user not found');
      error.status = 404;
      throw error;
    }

    throw error
  }
}

async function listUserAccounts(accessToken, userId) {
  // STEP 5: Fetch your aggregated data 
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
    throw error
  }
}

async function retrieveUserAccount(accessToken, userId, accountId) {
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
    throw error
  }
}

async function listUserTransactions(accessToken, userId) {
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
    throw error
  }
}

async function retrieveUserTransaction(accessToken, userId, transactionId) {
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
    throw error
  }  
};

module.exports = { 
  getAccessToken, 
  createUser, 
  getClientToken, 
  retrieveUser, 
  listUserAccounts, 
  retrieveUserAccount, 
  listUserTransactions, 
  retrieveUserTransaction 
}

