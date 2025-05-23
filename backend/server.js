// Load environment variables from .env file
require('dotenv').config();

// Import express and other middleware
const express = require('express');
const cors = require('cors');

// Import your router module (make sure this is exporting the router directly)
const financeRoutes = require('./routes/finance');

// Initialize express app
const app = express();

// Middleware setup
app.use(cors());
app.use(express.json());

// Mount finance routes under this path
app.use('/api/finance', financeRoutes);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});

