const express = require('express');
const userRouter = express.Router();
const { getAccessToken, createUser, getClientTokenForUser, fetchUserAccounts } = require('../utils/basiq')

// Add a new user to basiq
userRouter.post('/basiq', async (req, res) => {
  const { email, mobileNumber, firstName, middleName, lastName } = req.body;

  try {
    const token = await getAccessToken()
    const userId = await createUser(token, email, mobileNumber, number, firstName, middleName, lastName)
    res.status(201).json({ basiqUserId: userId })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Unable to add user to basiq' })
  }
})

// Send back consent url for added user
userRouter.get('/basiq/:userId/consent', async (req, res) => {
  const userId = req.params.userId

  if (!userId || typeof userId !== 'string' || userId.trim().length === 0) {
    return res.status(400).json({ error: 'Invalid or missing userId parameter' });
  }

  try {
    const clientToken = await getClientTokenForUser(userId)
    res.json({ consentUrl: `https://consent.basiq.io/home?token=${clientToken}` })
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to generate clientToken for user' })
  }
})

// List all the accounts of the user 
userRouter.get('/basiq/:userId/accounts', async (req, res) => {
  const userId = req.params.userId

  if (!userId || typeof userId !== 'string' || userId.trim().length === 0) {
    return res.status(400).json({ error: 'Invalid or missing userId parameter' });
  }

  try {
    const clientToken = await getClientTokenForUser(userId)
    const accountData = await fetchUserAccounts(clientToken, userId)
    res.json(accountData)
  } catch (error) {
    console.error(error)
    res.status(500).json( {error: 'Unable to list user accounts' })
  }

})

























