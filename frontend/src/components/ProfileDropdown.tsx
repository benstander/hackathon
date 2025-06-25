"use client";
import React, { useState, useRef, useEffect, isValidElement, ReactNode, ReactElement } from "react";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import Image from "next/image";

const ProfileDropdown = ({ children }: { children?: ReactNode }) => {
  const { user, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  const handleSignOut = async () => {
    await signOut();
    setOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {children && isValidElement(children) ? (
        React.cloneElement(children as ReactElement, {
          onClick: (e: React.MouseEvent) => {
            e.stopPropagation();
            setOpen((prev) => !prev);
            if (isValidElement(children) && children.props.onClick) children.props.onClick(e);
          },
        })
      ) : (
        <button
          className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-primary hover:bg-gray-300 transition-colors"
          onClick={() => setOpen((prev) => !prev)}
          aria-label="Account menu"
        >
          <Image src="/icons/account-icon.svg" alt="Profile" width={28} height={28} />
        </button>
      )}
      {open && (
        <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50">
          {user ? (
            <>
              <div className="px-4 py-2 border-b border-gray-100">
                <p className="text-sm font-medium text-gray-900">{user.email}</p>
                <p className="text-xs text-gray-500">Signed in</p>
              </div>
              <Link 
                href="/profile" 
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                onClick={() => setOpen(false)}
              >
                Profile
              </Link>
              <Link 
                href="/settings" 
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                onClick={() => setOpen(false)}
              >
                Settings
              </Link>
              <button
                onClick={handleSignOut}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link 
                href="/auth" 
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                onClick={() => setOpen(false)}
              >
                Sign in
              </Link>
              <Link 
                href="/auth?mode=signup" 
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                onClick={() => setOpen(false)}
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown; 