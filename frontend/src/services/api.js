import axios from 'axios';

const API_BASE_URL = '/api'; // Updated to use relative path for Next.js API routes

export const api = {
  // Returns user 
  getUser: async (userId) => {
    const response = await axios.get(`${API_BASE_URL}/basiq/user/${userId}`);
    return response.data;
  },

  // Returns all the accounts of the user  
  getUserAccounts: async (userId) => {
    const response = await axios.get(`${API_BASE_URL}/basiq/user/${userId}/accounts`);
    return response.data;
  },

  // Returns a specific account of the user
  getAccountDetails: async (userId, accountId) => {
    const response = await axios.get(`${API_BASE_URL}/basiq/user/${userId}/accounts/${accountId}`);
    return response.data;
  },

  // Return all the transactions of the user
  getUserTransactions: async (userId) => {
    const response = await axios.get(`${API_BASE_URL}/basiq/user/${userId}/transactions`);
    return response.data;
  },

  // Return a specific transaction of the user
  getTransactionDetails: async (userId, transactionId) => {
    const response = await axios.get(`${API_BASE_URL}/basiq/user/${userId}/transactions/${transactionId}`);
    return response.data;
  },

  // AI Chat endpoint
  askAI: async (userId, question) => {
    const response = await axios.post(`${API_BASE_URL}/prompts/ask`, {
      userId: userId,
      question
    });
    return response.data;
  },

  // Bank Connection Management
  
  // Initialize bank connection
  initBankConnection: async (userData) => {
    const response = await axios.post(`${API_BASE_URL}/basiq/connect/init`, userData);
    return response.data;
  },

  // Handle connection callback
  handleConnectionCallback: async (callbackData) => {
    const response = await axios.post(`${API_BASE_URL}/basiq/connect/callback`, callbackData);
    return response.data;
  },

  // Get user's bank connections
  getUserConnections: async (userId) => {
    const response = await axios.get(`${API_BASE_URL}/basiq/connections/${userId}`);
    return response.data;
  },

  // Get user's bank accounts from database
  getUserBankAccounts: async (userId) => {
    const response = await axios.get(`${API_BASE_URL}/basiq/accounts/${userId}`);
    return response.data;
  },

  // Sync user's bank data
  syncUserData: async (userId) => {
    const response = await axios.post(`${API_BASE_URL}/basiq/sync/${userId}`);
    return response.data;
  }
}; 