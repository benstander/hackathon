import axios from 'axios';
import { supabase } from '../lib/supabaseClient';

const API_BASE_URL = 'http://localhost:3000/api'; // Point to Express backend

// Helper function to get auth token
const getAuthToken = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.access_token;
};

// Helper function to create authenticated axios instance
const createAuthenticatedRequest = async () => {
  const token = await getAuthToken();
  return axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
};

export const api = {
  // Get user's Basiq user ID first, then call Basiq API
  getUser: async (userId) => {
    const axiosInstance = await createAuthenticatedRequest();
    // First get user from our database to get Basiq user ID
    const userResponse = await axiosInstance.get(`/basiq/connections/${userId}`);
    if (!userResponse.data || userResponse.data.length === 0) {
      throw new Error('No Basiq connection found for user');
    }
    
    const basiqUserId = userResponse.data[0].basiq_user_id;
    const response = await axiosInstance.get(`/basiq/user/${basiqUserId}`);
    return response.data;
  },

  // Get user's accounts from our database (not directly from Basiq)
  getUserAccounts: async (userId) => {
    const axiosInstance = await createAuthenticatedRequest();
    const response = await axiosInstance.get(`/basiq/accounts/${userId}`);
    return response.data;
  },

  // Get specific account details from Basiq API
  getAccountDetails: async (userId, accountId) => {
    const axiosInstance = await createAuthenticatedRequest();
    // First get user's Basiq user ID
    const userResponse = await axiosInstance.get(`/basiq/connections/${userId}`);
    if (!userResponse.data || userResponse.data.length === 0) {
      throw new Error('No Basiq connection found for user');
    }
    
    const basiqUserId = userResponse.data[0].basiq_user_id;
    const response = await axiosInstance.get(`/basiq/user/${basiqUserId}/accounts/${accountId}`);
    return response.data;
  },

  // Get user's transactions from Basiq API
  getUserTransactions: async (userId) => {
    const axiosInstance = await createAuthenticatedRequest();
    // First get user's Basiq user ID
    const userResponse = await axiosInstance.get(`/basiq/connections/${userId}`);
    if (!userResponse.data || userResponse.data.length === 0) {
      throw new Error('No Basiq connection found for user');
    }
    
    const basiqUserId = userResponse.data[0].basiq_user_id;
    const response = await axiosInstance.get(`/basiq/user/${basiqUserId}/transactions`);
    return response.data;
  },

  // Get specific transaction details from Basiq API
  getTransactionDetails: async (userId, transactionId) => {
    const axiosInstance = await createAuthenticatedRequest();
    // First get user's Basiq user ID
    const userResponse = await axiosInstance.get(`/basiq/connections/${userId}`);
    if (!userResponse.data || userResponse.data.length === 0) {
      throw new Error('No Basiq connection found for user');
    }
    
    const basiqUserId = userResponse.data[0].basiq_user_id;
    const response = await axiosInstance.get(`/basiq/user/${basiqUserId}/transactions/${transactionId}`);
    return response.data;
  },

  // AI Chat endpoint
  askAI: async (userId, question) => {
    const axiosInstance = await createAuthenticatedRequest();
    const response = await axiosInstance.post(`/prompts/ask`, {
      userId: userId,
      question
    });
    return response.data;
  },

  // Bank Connection Management
  
  // Initialize bank connection
  initBankConnection: async (userData) => {
    const axiosInstance = await createAuthenticatedRequest();
    const response = await axiosInstance.post(`/basiq/connect/init`, userData);
    return response.data;
  },

  // Handle connection callback
  handleConnectionCallback: async (callbackData) => {
    const axiosInstance = await createAuthenticatedRequest();
    const response = await axiosInstance.post(`/basiq/connect/callback`, callbackData);
    return response.data;
  },

  // Get user's bank connections from our database
  getUserConnections: async (userId) => {
    const axiosInstance = await createAuthenticatedRequest();
    const response = await axiosInstance.get(`/basiq/connections/${userId}`);
    return response.data;
  },

  // Get user's bank accounts from our database
  getUserBankAccounts: async (userId) => {
    const axiosInstance = await createAuthenticatedRequest();
    const response = await axiosInstance.get(`/basiq/accounts/${userId}`);
    return response.data;
  },

  // Sync user's bank data
  syncUserData: async (userId) => {
    const axiosInstance = await createAuthenticatedRequest();
    const response = await axiosInstance.post(`/basiq/sync/${userId}`);
    return response.data;
  }
}; 