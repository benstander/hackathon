import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const FinancialContext = createContext();

export function FinancialProvider({ children }) {
  const [userData, setUserData] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mock user ID - replace with actual user ID from your auth system
  const userId = 'fb919047-167b-4b33-9cfc-ab963c780166';

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [userData, accountsData, transactionsData] = await Promise.all([
          api.getUser(userId),
          api.getUserAccounts(userId),
          api.getUserTransactions(userId)
        ]);

        setUserData(userData);
        setAccounts(accountsData);
        setTransactions(transactionsData);
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching financial data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  const value = {
    userData,
    accounts,
    transactions,
    loading,
    error,
    refreshData: () => {
      setLoading(true);
      fetchData();
    }
  };

  return (
    <FinancialContext.Provider value={value}>
      {children}
    </FinancialContext.Provider>
  );
}

export function useFinancial() {
  const context = useContext(FinancialContext);
  if (context === undefined) {
    throw new Error('useFinancial must be used within a FinancialProvider');
  }
  return context;
} 