'use client';

import React, { useState, useEffect } from 'react';
import { useBankConnection } from '../hooks/useBankConnection';

interface ConnectBankProps {
  onConnectionSuccess?: () => void;
  className?: string;
}

declare global {
  interface Window {
    BasiqConnect: any;
  }
}

export function ConnectBank({ onConnectionSuccess, className = '' }: ConnectBankProps) {
  const {
    hasConnectedBanks,
    connecting,
    syncing,
    error,
    initializeConnection,
    handleConnectionSuccess,
    syncData,
    accounts,
    clearError
  } = useBankConnection();

  const [showModal, setShowModal] = useState(false);
  const [connectUrl, setConnectUrl] = useState<string | null>(null);
  const [basiqLoaded, setBasiqLoaded] = useState(false);

  // Load Basiq Connect script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.basiq.io/connect/basiq-connect-v3.min.js';
    script.onload = () => setBasiqLoaded(true);
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const handleConnectBank = async () => {
    clearError();
    
    if (hasConnectedBanks) {
      // If already connected, show sync option
      await syncData();
      return;
    }

    try {
      const response = await initializeConnection();
      
      if (response?.client_token && basiqLoaded) {
        // Use Basiq Connect widget
        const basiqConnect = new window.BasiqConnect({
          token: response.client_token,
          onConnect: (connection: any) => {
            console.log('Bank connected:', connection);
            handleConnectionSuccess({
              basiq_user_id: response.basiq_user_id,
              connection_id: connection.id,
              institution_id: connection.institution?.id,
              institution_name: connection.institution?.name
            });
            setShowModal(false);
            onConnectionSuccess?.();
          },
          onCancel: () => {
            console.log('Connection cancelled');
            setShowModal(false);
          },
          onError: (error: any) => {
            console.error('Connection error:', error);
            setShowModal(false);
          }
        });

        setShowModal(true);
        
        // Show the widget
        setTimeout(() => {
          basiqConnect.open();
        }, 100);
      } else if (response?.connect_url) {
        // Fallback to URL redirect
        setConnectUrl(response.connect_url);
        setShowModal(true);
      }
    } catch (err) {
      console.error('Failed to connect bank:', err);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD'
    }).format(amount);
  };

  const getButtonText = () => {
    if (connecting) return 'Connecting...';
    if (syncing) return 'Syncing...';
    if (hasConnectedBanks) return 'Sync Banks';
    return 'Connect Bank';
  };

  const getButtonIcon = () => {
    if (hasConnectedBanks) {
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      );
    }
    return (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
      </svg>
    );
  };

  return (
    <>
      <button
        onClick={handleConnectBank}
        disabled={connecting || syncing}
        className={`
          inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
          transition-all duration-200 min-w-[120px] justify-center
          ${hasConnectedBanks 
            ? 'bg-green-50 text-green-700 border border-green-200 hover:bg-green-100' 
            : 'bg-blue-600 text-white hover:bg-blue-700'
          }
          disabled:opacity-50 disabled:cursor-not-allowed
          ${className}
        `}
      >
        {getButtonIcon()}
        <span>{getButtonText()}</span>
      </button>

      {/* Show connected accounts summary */}
      {hasConnectedBanks && accounts.length > 0 && (
        <div className="text-xs text-gray-600 mt-1">
          {accounts.length} account{accounts.length !== 1 ? 's' : ''} connected
        </div>
      )}

      {/* Error display */}
      {error && (
        <div className="text-xs text-red-600 mt-1 max-w-[200px]">
          {error}
        </div>
      )}

      {/* Modal for fallback URL method */}
      {showModal && connectUrl && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Connect Your Bank</h3>
            <p className="text-gray-600 mb-4">
              You'll be redirected to Basiq Connect to securely connect your Australian bank account.
            </p>
            <div className="flex gap-3">
              <a
                href={connectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg text-center hover:bg-blue-700 transition-colors"
              >
                Connect Bank
              </a>
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}