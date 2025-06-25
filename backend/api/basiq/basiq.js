const express = require('express');
const { authenticateUser } = require('../../middleware');
const basiqRouter = express.Router();
const { 
  getAccessToken, 
  createUser, 
  getClientToken, 
  retrieveUser, 
  listUserAccounts, 
  retrieveUserAccount, 
  listUserTransactions, 
  retrieveUserTransaction,
  validateUserId,
  validateEmail
} = require('../../Utils/basiqHelper')
const { 
  createOrUpdateUser,
  updateUserBasiqId,
  getUserById,
  createBankConnection,
  updateBankConnectionStatus,
  getBankConnectionsByUserId,
  createBankAccount,
  getBankAccountsByUserId,
  updateBankAccountBalance
} = require('../../db/queries/users');

// Add a new user to basiq
basiqRouter.post('/user', async (req, res) => {
  const { email, mobileNumber, firstName, middleName, lastName } = req.body;

  try {
    const accessToken = await getAccessToken()
    const basiqUserId = await createUser(accessToken, email, mobileNumber, firstName, middleName, lastName)
    res.status(201).json({ basiqUserId: basiqUserId })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Unable to add user to basiq' })
  }
})

// Client token endpoint (from starter kit)
basiqRouter.get('/client-token', authenticateUser, async (req, res) => {
  try {
    const { userId } = req.query;
    
    // Validate the userId query parameter
    if (!userId || !validateUserId(userId)) {
      return res.status(400).json({ 
        error: 'Invalid or missing userId parameter' 
      });
    }

    // Ensure user can only get tokens for their own userId
    if (userId !== req.user.id) {
      return res.status(403).json({ 
        error: 'Access denied - can only get tokens for your own user ID' 
      });
    }

    const clientToken = await getClientToken(userId);
    res.status(200).json(clientToken);
    
  } catch (error) {
    console.error('Client token generation error:', error);
    res.status(500).json({ 
      error: 'Failed to generate client token',
      message: error.message 
    });
  }
});

// Initialize bank connection for a user - NOW REQUIRES AUTHENTICATION
basiqRouter.post('/connect/init', authenticateUser, async (req, res) => {
  try {
    const { email, mobile_number, first_name, last_name } = req.body;
    const user_id = req.user.id; // Get user ID from authenticated token
    
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Check if user already has a Basiq user ID
    let user = await getUserById(user_id).catch(() => null);
    let basiqUserId = user?.basiq_user_id;

    if (!basiqUserId) {
      // Create user in Basiq
      const accessToken = await getAccessToken();
      basiqUserId = await createUser(accessToken, email, mobile_number, first_name, '', last_name);
      
      // Save/update user in our database
      await createOrUpdateUser(user_id, {
        email,
        mobile_number,
        first_name,
        last_name,
        basiq_user_id: basiqUserId
      });
    }

    // Generate client token for Basiq Connect
    const clientToken = await getClientToken(basiqUserId);

    console.log('Basiq Connect URL:', `https://connect.sandbox.basiq.io/?token=${clientToken}`);
    console.log('Client Token:', clientToken);

    res.json({
      basiq_user_id: basiqUserId,
      client_token: clientToken,
      connect_url: `https://connect.sandbox.basiq.io/?token=${clientToken}`
    });

  } catch (error) {
    console.error('Bank connection init error:', error);
    res.status(500).json({ error: 'Failed to initialize bank connection' });
  }
});

// Handle connection callback/webhook - NOW REQUIRES AUTHENTICATION
basiqRouter.post('/connect/callback', authenticateUser, async (req, res) => {
  try {
    const { basiq_user_id, connection_id, institution_id, institution_name, status } = req.body;
    const user_id = req.user.id; // Get user ID from authenticated token

    if (!basiq_user_id) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Create bank connection record
    const connectionData = {
      user_id,
      basiq_user_id,
      connection_id,
      institution_id,
      institution_name,
      status: status || 'connected'
    };

    const bankConnection = await createBankConnection(connectionData);

    // If connection is successful, sync accounts
    if (status === 'connected' || !status) {
      await syncUserAccounts(user_id, basiq_user_id, bankConnection.id);
    }

    res.json({ success: true, connection: bankConnection });

  } catch (error) {
    console.error('Connection callback error:', error);
    res.status(500).json({ error: 'Failed to process connection callback' });
  }
});

// Sync user accounts from Basiq
async function syncUserAccounts(user_id, basiq_user_id, connection_id) {
  try {
    const accessToken = await getAccessToken();
    const accountsResponse = await listUserAccounts(accessToken, basiq_user_id);
    
    if (accountsResponse.data) {
      for (const account of accountsResponse.data) {
        const accountData = {
          user_id,
          connection_id,
          basiq_account_id: account.id,
          account_number: account.accountNo,
          account_name: account.name,
          account_type: account.type,
          institution_name: account.institution,
          balance: parseFloat(account.balance) || 0,
          available_balance: parseFloat(account.availableFunds) || 0,
          currency: account.currency || 'AUD',
          status: account.status || 'active'
        };

        await createBankAccount(accountData);
      }
    }
  } catch (error) {
    console.error('Error syncing accounts:', error);
    throw error;
  }
}

// Get user's bank connections - NOW REQUIRES AUTHENTICATION
basiqRouter.get('/connections/:user_id', authenticateUser, async (req, res) => {
  try {
    const { user_id } = req.params;
    
    // Ensure user can only access their own connections
    if (user_id !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    const connections = await getBankConnectionsByUserId(user_id);
    res.json(connections);

  } catch (error) {
    console.error('Error fetching connections:', error);
    res.status(500).json({ error: 'Failed to fetch bank connections' });
  }
});

// Get user's bank accounts - NOW REQUIRES AUTHENTICATION
basiqRouter.get('/accounts/:user_id', authenticateUser, async (req, res) => {
  try {
    const { user_id } = req.params;
    
    // Ensure user can only access their own accounts
    if (user_id !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    const accounts = await getBankAccountsByUserId(user_id);
    res.json(accounts);

  } catch (error) {
    console.error('Error fetching accounts:', error);
    res.status(500).json({ error: 'Failed to fetch bank accounts' });
  }
});

// Sync/refresh user data - NOW REQUIRES AUTHENTICATION
basiqRouter.post('/sync/:user_id', authenticateUser, async (req, res) => {
  try {
    const { user_id } = req.params;
    
    // Ensure user can only sync their own data
    if (user_id !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    const user = await getUserById(user_id);
    if (!user?.basiq_user_id) {
      return res.status(404).json({ error: 'User not found or no Basiq connection' });
    }

    const accessToken = await getAccessToken();
    
    // Get updated accounts
    const accountsResponse = await listUserAccounts(accessToken, user.basiq_user_id);
    
    if (accountsResponse.data) {
      for (const account of accountsResponse.data) {
        await updateBankAccountBalance(
          account.id,
          parseFloat(account.balance) || 0,
          parseFloat(account.availableFunds) || 0
        );
      }
    }

    // Get updated accounts from database
    const updatedAccounts = await getBankAccountsByUserId(user_id);
    
    res.json({ 
      success: true, 
      accounts: updatedAccounts,
      synced_at: new Date().toISOString()
    });

  } catch (error) {
    console.error('Sync error:', error);
    res.status(500).json({ error: 'Failed to sync user data' });
  }
});

// Retrieve a specific basiq user account 
basiqRouter.get('/user/:basiqUserId', async (req, res) => {
  const { basiqUserId } = req.params
  
  if (!basiqUserId || typeof basiqUserId !== 'string' || basiqUserId.trim().length === 0) {
    return res.status(400).json({ error: 'Invalid or missing userId parameter' });
  }

  try {
    const accessToken = await getAccessToken()
    const userData = await retrieveUser(basiqUserId, accessToken)

    if (!userData) {
      return res.status(404).json({ error: 'Basiq user not found'})
    }

    res.json(userData)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Unable to retrieve user'})
  }
})

// Retrieve all accounts of a basiq user 
basiqRouter.get('/user/:basiqUserId/accounts', async (req, res) => {
  const { basiqUserId } = req.params
  
  if (!basiqUserId || typeof basiqUserId !== 'string' || basiqUserId.trim().length === 0) {
    return res.status(400).json({ error: 'Invalid or missing userId parameter' });
  }

  try {
    const accessToken = await getAccessToken()
    const accountsData = await listUserAccounts(accessToken, basiqUserId)

    if (!accountsData) {
      return res.status(404).json({ error: 'Basiq user accounts not found'})
    }

    res.json(accountsData)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Unable to retrieve user accounts'})
  }
})

// Retrieve specific account from a user 
basiqRouter.get('/user/:basiqUserId/accounts/:accountId', async (req, res) => {
  const { basiqUserId, accountId } = req.params
  
  if (!basiqUserId || typeof basiqUserId !== 'string' || basiqUserId.trim().length === 0) {
    return res.status(400).json({ error: 'Invalid or missing userId parameter' });
  }

  if (!accountId || typeof accountId !== 'string' || accountId.trim().length === 0) {
    return res.status(400).json({ error: 'Invalid or missing accountId parameter' });
  }

  try {
    const accessToken = await getAccessToken()
    const accountData = await retrieveUserAccount(accessToken, basiqUserId, accountId)

    if (!accountData) {
      return res.status(404).json({ error: 'Basiq user account not found'})
    }

    res.json(accountData)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Unable to retrieve user account'})
  }
})

// Retrieve all transactions from a user 
basiqRouter.get('/user/:basiqUserId/transactions', async (req, res) => {
  const { basiqUserId } = req.params
  
  if (!basiqUserId || typeof basiqUserId !== 'string' || basiqUserId.trim().length === 0) {
    return res.status(400).json({ error: 'Invalid or missing userId parameter' });
  }

  try {
    const accessToken = await getAccessToken()
    const transactionsData = await listUserTransactions(accessToken, basiqUserId)

    if (!transactionsData) {
      return res.status(404).json({ error: 'Basiq user transactions not found'})
    }

    res.json(transactionsData)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Unable to retrieve user transactions'})
  }
})

// Retrieve a specific transaction from a user 
basiqRouter.get('/user/:basiqUserId/transactions/:transactionId', async (req, res) => {
  const { basiqUserId, transactionId } = req.params
  
  if (!basiqUserId || typeof basiqUserId !== 'string' || basiqUserId.trim().length === 0) {
    return res.status(400).json({ error: 'Invalid or missing userId parameter' });
  }

  if (!transactionId || typeof transactionId !== 'string' || transactionId.trim().length === 0) {
    return res.status(400).json({ error: 'Invalid or missing transactionId parameter' });
  }

  try {
    const accessToken = await getAccessToken()
    const transactionData = await retrieveUserTransaction(accessToken, basiqUserId, transactionId)

    if (!transactionData) {
      return res.status(404).json({ error: 'Basiq user transaction not found'})
    }

    res.json(transactionData)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Unable to retrieve user transaction'})
  }
})

module.exports = basiqRouter;























