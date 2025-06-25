const express = require('express');
const { authenticateUser } = require('../../middleware');
const { getClientToken, validateUserId } = require('../../Utils/basiqHelper');

const router = express.Router();

/**
 * This API endpoint retrieves a Basiq API token with the scope of `CLIENT_ACCESS`
 * Following the pattern from the official Basiq starter kit
 * 
 * https://api.basiq.io/reference/authentication
 */

router.get('/client-token', authenticateUser, async (req, res) => {
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

module.exports = router; 