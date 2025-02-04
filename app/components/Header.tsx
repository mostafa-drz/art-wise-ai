'use client';

import React from 'react';
import Link from 'next/link';
import { User } from '../types';

interface HeaderProps {
  user?: User | null;
  logout: () => void;
}
const Header: React.FC<HeaderProps> = ({ user, logout }) => {
  return (
    <header className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-md text-white py-4 px-6 flex justify-between items-center">
      {/* Logo/Brand */}
      <Link
        href="/"
        className="text-2xl font-bold tracking-wide hover:opacity-90 transition-opacity"
      >
        Art Wise AI
      </Link>

      {/* User Controls */}
      <div className="flex items-center space-x-4">
        {user ? (
          <div className="flex items-center space-x-3">
            <span className="text-sm font-medium bg-white bg-opacity-20 px-3 py-1 rounded-full">
              {user.email}
            </span>
            <button
              onClick={logout}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded transition-transform transform hover:scale-105"
            >
              Logout
            </button>
          </div>
        ) : (
          <Link
            href="/login"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded transition-transform transform hover:scale-105"
          >
            Login
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;
