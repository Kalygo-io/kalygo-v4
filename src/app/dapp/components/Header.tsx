"use client";

import { useState } from 'react';

const Header = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
    return (
      <header className="bg-white shadow-md p-4 flex justify-end items-center">
        <button className="bg-blue-500 text-white px-4 py-2 rounded-md mr-4 hover:bg-blue-600">
          Sign In with Unstoppable
        </button>
        <button className="bg-blue-500 text-white px-4 py-2 rounded-md mr-4 hover:bg-blue-600">
          Sign In
        </button>
        <div className="relative">
          <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </button>
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
              <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile</a>
              <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Settings</a>
              <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Logout</a>
            </div>
          )}
        </div>
      </header>
    );
  };
  
  export default Header; 