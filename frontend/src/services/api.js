import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api'; // Adjust this to match your backend URL

export const api = {
  // User endpoints
  getUser: async (userId) => {
    const response = await axios.get(`${API_BASE_URL}/basiq/user/${userId}`);
    return response.data;
  },

  // Account endpoints
  getUserAccounts: async (userId) => {
    const response = await axios.get(`${API_BASE_URL}/basiq/user/${userId}/accounts`);
    return response.data;
  },

  getAccountDetails: async (userId, accountId) => {
    const response = await axios.get(`${API_BASE_URL}/basiq/user/${userId}/accounts/${accountId}`);
    return response.data;
  },

  // Transaction endpoints
  getUserTransactions: async (userId) => {
    const response = await axios.get(`${API_BASE_URL}/basiq/user/${userId}/transactions`);
    return response.data;
  },

  getTransactionDetails: async (userId, transactionId) => {
    const response = await axios.get(`${API_BASE_URL}/basiq/user/${userId}/transactions/${transactionId}`);
    return response.data;
  },

  // AI Chat endpoint
  askAI: async (userId, question) => {
    const response = await axios.post(`${API_BASE_URL}/prompts/ask`, {
      user_id: userId,
      question
    });
    return response.data;
  }
}; 