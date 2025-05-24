const express = require('express');
const basiqRouter = express.Router();
const { getAccessToken, createUser, getClientToken, listUserAccounts, retrieveUser } = require('../utils/basiqHelper')

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
    const clientToken = await getClientToken(basiqUserId)
    const user = await retrieveUser(basiqUserId, clientToken)

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
    const clientToken = await getClientToken(basiqUserId)
    const accountData = await listUserAccounts(clientToken, basiqUserId)
    res.json(accountData)
  } catch (error) {
    console.error(error)
    res.status(500).json( {error: 'Unable to list user accounts' })
  }
})

module.exports = basiqRouter























