const express = require('express');
const basiqRouter = express.Router();
const { 
  getAccessToken, 
  createUser, 
  getClientToken, 
  retrieveUser, 
  listUserAccounts, 
  retrieveUserAccount, 
  listUserTransactions, 
  retrieveUserTransaction 
} = require('../utils/basiqHelper')

// Add a new user to basiq
basiqRouter.post('/user', async (req, res) => {
  const { email, mobileNumber, firstName, middleName, lastName } = req.body;

  try {
    const accessToken = await getAccessToken()
    const basiqUserId = await createUser(accessToken, email, mobileNumber, number, firstName, middleName, lastName)
    res.status(201).json({ basiqUserId: basiqUserId })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Unable to add user to basiq' })
  }
})

// Retrieve a user from basiq
basiqRouter.get('/user/:basiqUserId', async (req, res) => {
  const basiqUserId = req.params.basiqUserId

  if (!basiqUserId || typeof basiqUserId !== 'string' || basiqUserId.trim().length === 0) {
    return res.status(400).json({ error: 'Invalid or missing userId parameter' });
  }

  try {
    const accessToken = await getAccessToken()
    console.log(accessToken)
    const user = await retrieveUser(basiqUserId, accessToken)

    if (!user) {
      return res.status(404).json({ error: 'Basiq user not found'})
    }

    res.json(user)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Unable to retrieve user from basiq'})
  }
})

// Send back consent url for added user
basiqRouter.get('/user/:basiqUserId/consent', async (req, res) => {
  const basiqUserId = req.params.basiqUserId

  if (!basiqUserId || typeof basiqUserId !== 'string' || basiqUserId.trim().length === 0) {
    return res.status(400).json({ error: 'Invalid or missing userId parameter' });
  }

  try {
    const clientToken = await getClientToken(basiqUserId)
    res.json({ consentUrl: `https://consent.basiq.io/home?token=${clientToken}` })
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to generate clientToken for user' })
  }
})

// List all the accounts of the user 
basiqRouter.get('/user/:basiqUserId/accounts', async (req, res) => {
  const basiqUserId = req.params.basiqUserId

  if (!basiqUserId || typeof basiqUserId !== 'string' || basiqUserId.trim().length === 0) {
    return res.status(400).json({ error: 'Invalid or missing userId parameter' });
  }

  try {
    const accessToken = await getAccessToken()
    const accountsData = await listUserAccounts(accessToken, basiqUserId)
    res.json(accountsData)
  } catch (error) {
    console.error(error)
    res.status(500).json( {error: 'Unable to list user accounts' })
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

// List all transactions 
basiqRouter.get('/user/:basiqUserId/transactions', async (req, res) => {
  const basiqUserId = req.params.basiqUserId

  if (!basiqUserId || typeof basiqUserId !== 'string' || basiqUserId.trim().length === 0) {
    return res.status(400).json({ error: 'Invalid or missing userId parameter' });
  }

  try {
    const accessToken = await getAccessToken()
    const transactionsData = await listUserTransactions(accessToken, basiqUserId)

    res.json(transactionsData)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Unable to list user transactions'})
  }
})

// Retrieve a transaction
basiqRouter.get('/user/:basiqUserId/transactions/:transactionId', async (req, res) => {
  const { basiqUserId, transactionId } = req.params

  if (!basiqUserId || typeof basiqUserId !== 'string' || basiqUserId.trim().length === 0) {
    return res.status(400).json({ error: 'Invalid or missing userId parameter' });
  }

  if (!transactionId || typeof transactionId !== 'string' || transactionId.trim().length === 0) {
    return res.status(400).json({ error: 'Invalid or missing userId parameter' });
  }

  try {
    const accessToken = await getAccessToken()
    const transactionData = await retrieveUserTransaction(accessToken, basiqUserId, transactionId)

    res.json(transactionData)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Unable to retrieve user transaction'})
  }
})

module.exports = basiqRouter























