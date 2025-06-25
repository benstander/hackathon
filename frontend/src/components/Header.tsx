import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
        
const Header = ({ onConnectBank }: { onConnectBank?: () => void }) => {
  const handleLogoClick = (e: React.MouseEvent) => {
    if (window.location.pathname === '/') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    // Otherwise, let Link handle navigation
  };

  return (
    <header className="w-full flex items-center justify-between px-8 py-4 bg-white z-20">
      {/* Brand name */}
      <div className="flex items-center">
        <Link href="/" onClick={handleLogoClick} className="text-2xl font-medium text-gray-900 tracking-tight cursor-pointer">
          Kapital
        </Link>
      </div>
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onConnectBank}
          className="flex items-center gap-3 px-6 py-2 border border-gray-300 rounded-full bg-white text-gray-800 font-medium hover:bg-gray-50 transition text-base shadow-sm"
        >
          <span className="text-lg">+</span>
          <span>Connect bank</span>
        </button>
        <ProfileDropdown />
      </div>
    </header>
  );
};

export default Header; 