import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api'; // Adjust this to match your backend URL

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
    console.log("HELLO")
    const response = await axios.post(`${API_BASE_URL}/prompts/ask`, {
      userId: userId,
      question
    });
    return response.data;
  }
}; 