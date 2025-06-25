const cors = require("cors");
const express = require("express");
const morgan  = require("morgan");
const jwt = require('jsonwebtoken');

function setupAppMiddleware(app){
  require("dotenv").config();

  app.use(morgan("dev"))

  app.use(cors({
    origin: '*',
  }));

  app.use(express.json());

  app.use(express.urlencoded({extended: true}));
}

// Authentication middleware to validate Supabase JWT tokens
function authenticateUser(req, res, next) {
  const authHeader = req.headers.authorization;
  
  console.log('🔐 Auth middleware - Headers:', {
    authorization: authHeader ? 'Bearer [TOKEN]' : 'None',
    'content-type': req.headers['content-type'],
    origin: req.headers.origin
  });
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('❌ No Bearer token provided');
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.substring(7); // Remove 'Bearer ' prefix
  console.log('🔑 Token received (first 20 chars):', token.substring(0, 20) + '...');
  
  try {
    // Verify the JWT token using Supabase JWT secret
    const decoded = jwt.verify(token, process.env.SUPABASE_JWT_SECRET, {
      algorithms: ['HS256']
    });
    
    console.log('✅ Token verified successfully');
    console.log('👤 User info:', {
      id: decoded.sub,
      email: decoded.email,
      role: decoded.role || 'authenticated'
    });
    
    // Add user info to request - Supabase JWT structure
    req.user = {
      id: decoded.sub, // User ID from Supabase
      email: decoded.email,
      role: decoded.role || 'authenticated'
    };
    
    next();
  } catch (error) {
    console.error('❌ Token verification failed:', error);
    
    // More detailed error logging
    if (error.name === 'JsonWebTokenError') {
      console.error('🔍 JWT Error:', error.message);
    } else if (error.name === 'TokenExpiredError') {
      console.error('⏰ Token expired:', error.message);
    } else if (error.name === 'NotBeforeError') {
      console.error('⏳ Token not active:', error.message);
    }
    
    return res.status(401).json({ error: 'Invalid token' });
  }
}

module.exports = { setupAppMiddleware, authenticateUser };