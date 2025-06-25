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
          className="py-2 px-2 rounded-full bg-white border border-gray-300 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-primary"
          onClick={() => setOpen((prev) => !prev)}
          aria-label="Account menu"
        >
          <Image src="/icons/account-icon.svg" alt="Profile" width={26} height={26} />
        </button>
      )}
      {open && (
        <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50">
          {user ? (
            <>
              <Link href="/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Account</Link>
              <Link href="/settings" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Settings</Link>
              <button
                onClick={handleSignOut}
                className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link href="/auth?mode=signin" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Sign In</Link>
              <Link href="/auth?mode=signup" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Sign Up</Link>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown; 