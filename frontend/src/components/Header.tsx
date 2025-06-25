"use client";
import React from 'react';
import Link from 'next/link';
import ProfileDropdown from './ProfileDropdown';
import { ConnectBank } from './ConnectBank';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { user } = useAuth();

  return (
    <header className="w-full flex items-center justify-between px-6 py-4 border-b bg-white shadow-sm z-20">
      <Link href="/" className="text-2xl font-bold text-primary">
        onTrack
      </Link>
      
      <div className="flex items-center gap-4">
        {user && (
          <ConnectBank 
            onConnectionSuccess={() => {
              // Optionally refresh page data or show success message
              console.log('Bank connected successfully!');
            }}
          />
        )}
        
        {user ? (
          // Show profile dropdown for authenticated users
          <ProfileDropdown />
        ) : (
          // Show sign in/sign up buttons for unauthenticated users
          <div className="flex items-center gap-3">
            <Link
              href="/auth"
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
            >
              Sign in
            </Link>
            <Link
              href="/auth?mode=signup"
              className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary/90 rounded-lg transition-colors"
            >
              Sign up
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header; 