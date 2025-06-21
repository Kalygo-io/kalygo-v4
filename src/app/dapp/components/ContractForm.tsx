"use client";

import { useState } from 'react';

const ContractForm = () => {
    const [endDate, setEndDate] = useState("");
  
    return (
      <div className="bg-white p-8 rounded-lg shadow-md">
        <div className="grid grid-cols-2 gap-8 mb-6">
          <div>
            <label htmlFor="buyer-address" className="block text-sm font-medium text-gray-700 mb-1">
              Buyer
            </label>
            <input
              type="text"
              id="buyer-address"
              placeholder="Buyer Address"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="seller-address" className="block text-sm font-medium text-gray-700 mb-1">
              Seller
            </label>
            <input
              type="text"
              id="seller-address"
              placeholder="Seller Address"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
  
        <div className="mb-6">
          <label htmlFor="arbiter-address" className="block text-sm font-medium text-gray-700 mb-1">
            Arbiter
          </label>
          <input
            type="text"
            id="arbiter-address"
            placeholder="Arbiter Address"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
  
        <div className="mb-6">
          <label htmlFor="agreement-hash" className="block text-sm font-medium text-gray-700 mb-1">
            Hash of agreement terms
          </label>
          <input
            type="text"
            id="agreement-hash"
            placeholder="Hash of agreement terms"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
  
        <div className="mb-6">
          <label htmlFor="end-date" className="flex items-center text-sm font-medium text-gray-700 mb-1">
            End Date
            <button className="ml-2 text-gray-500 hover:text-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h5M20 20v-5h-5M4 20h5v-5M20 4h-5v5" />
              </svg>
            </button>
          </label>
          <input
            type="text"
            id="end-date"
            placeholder="Sat Jun 21 2025 17:32:49 GMT-0400"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
  
        <button className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition-colors">
          Deploy
        </button>
      </div>
    );
  };
  
  export default ContractForm; 