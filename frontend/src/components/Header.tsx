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
        <ProfileDropdown />
      </div>
    </header>
  );
};

export default Header; 