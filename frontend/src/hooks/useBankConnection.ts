import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

interface BankConnection {
  id: string;
  user_id: string;
  basiq_user_id: string;
  connection_id?: string;
  institution_id?: string;
  institution_name?: string;
  status: 'pending' | 'connected' | 'disconnected' | 'error';
  last_synced_at?: string;
  created_at: string;
  updated_at: string;
}

interface BankAccount {
  id: string;
  user_id: string;
  connection_id: string;
  basiq_account_id: string;
  account_number?: string;
  account_name?: string;
  account_type?: string;
  institution_name?: string;
  balance: number;
  available_balance: number;
  currency: string;
  status: string;
  bank_connections?: {
    institution_name?: string;
    status: string;
  };
}

export function useBankConnection() {
  const { user } = useAuth();
  const [connections, setConnections] = useState<BankConnection[]>([]);
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [loading, setLoading] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if user has any connected banks
  const hasConnectedBanks = connections.some(conn => conn.status === 'connected');
  
  // Check if user has any accounts
  const hasAccounts = accounts.length > 0;

  // Fetch user's connections and accounts
  const fetchUserData = useCallback(async () => {
    if (!user?.id) return;

    setLoading(true);
    setError(null);

    try {
      const [connectionsData, accountsData] = await Promise.all([
        api.getUserConnections(user.id),
        api.getUserBankAccounts(user.id)
      ]);

      setConnections(connectionsData || []);
      setAccounts(accountsData || []);
    } catch (err) {
      console.error('Error fetching user data:', err);
      setError('Failed to fetch bank data');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  // Initialize bank connection
  const initializeConnection = useCallback(async () => {
    if (!user?.id || !user?.email) return null;

    setConnecting(true);
    setError(null);

    try {
      const userData = {
        user_id: user.id,
        email: user.email,
        mobile_number: user.user_metadata?.mobile_number || '',
        first_name: user.user_metadata?.first_name || user.user_metadata?.full_name?.split(' ')[0] || '',
        last_name: user.user_metadata?.last_name || user.user_metadata?.full_name?.split(' ').slice(1).join(' ') || ''
      };

      const response = await api.initBankConnection(userData);
      return response;
    } catch (err) {
      console.error('Error initializing connection:', err);
      setError('Failed to initialize bank connection');
      return null;
    } finally {
      setConnecting(false);
    }
  }, [user]);

  // Handle connection success callback
  const handleConnectionSuccess = useCallback(async (connectionData: any) => {
    if (!user?.id) return;

    try {
      const callbackData = {
        user_id: user.id,
        basiq_user_id: connectionData.basiq_user_id,
        connection_id: connectionData.connection_id,
        institution_id: connectionData.institution_id,
        institution_name: connectionData.institution_name,
        status: 'connected'
      };

      await api.handleConnectionCallback(callbackData);
      
      // Refresh user data after successful connection
      await fetchUserData();
    } catch (err) {
      console.error('Error handling connection success:', err);
      setError('Failed to complete bank connection');
    }
  }, [user?.id, fetchUserData]);

  // Sync user data
  const syncData = useCallback(async () => {
    if (!user?.id) return;

    setSyncing(true);
    setError(null);

    try {
      await api.syncUserData(user.id);
      await fetchUserData();
    } catch (err) {
      console.error('Error syncing data:', err);
      setError('Failed to sync bank data');
    } finally {
      setSyncing(false);
    }
  }, [user?.id, fetchUserData]);

  // Load data on mount and user change
  useEffect(() => {
    if (user?.id) {
      fetchUserData();
    }
  }, [user?.id, fetchUserData]);

  return {
    connections,
    accounts,
    loading,
    connecting,
    syncing,
    error,
    hasConnectedBanks,
    hasAccounts,
    initializeConnection,
    handleConnectionSuccess,
    syncData,
    refreshData: fetchUserData,
    clearError: () => setError(null)
  };
}