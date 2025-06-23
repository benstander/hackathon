import React from 'react';
import Link from 'next/link';
import ProfileDropdown from './ProfileDropdown';

const Header = () => {
  return (
    <header className="w-full flex items-center justify-between px-6 py-4 border-b bg-white shadow-sm z-20">
      <Link href="/" className="text-2xl font-bold text-primary">
        onTrack
      </Link>
      <ProfileDropdown />
    </header>
  );
};

export default Header; 