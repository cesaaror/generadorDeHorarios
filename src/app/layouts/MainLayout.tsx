'use client';

import React from 'react';
import { useTheme } from '../context/ThemeContext';

type MainLayoutProps = {
  children: React.ReactNode;
};

export default function MainLayout({ children }: MainLayoutProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
      <header className="py-4 px-8 shadow-md flex justify-between items-center">
        <h1 className="text-lg font-bold">My Dashboard</h1>
        <button
          onClick={toggleTheme}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Toggle Theme
        </button>
      </header>
      <main className="p-8">{children}</main>
    </div>
  );
}
