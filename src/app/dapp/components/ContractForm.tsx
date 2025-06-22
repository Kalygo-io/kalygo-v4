"use client";
const ContractForm = () => {
    
    return (
      <div className="bg-white p-8 rounded-lg shadow-md">
        <div className="grid grid-cols-2 gap-8 mb-6">
          <div>
            <label htmlFor="buyer-address" className="block text-sm font-medium text-gray-700 mb-1">
              Buyer Address
            </label>
            <input
              type="text"
              id="buyer-address"
              placeholder="0x..."
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="buyer-email" className="block text-sm font-medium text-gray-700 mb-1">
              Buyer Email
            </label>
            <input
              type="text"
              id="buyer-email"
              placeholder="buyer@example.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 mb-6">
          <div>
            <label htmlFor="seller-address" className="block text-sm font-medium text-gray-700 mb-1">
              Seller Address
            </label>
            <input
              type="text"
              id="seller-address"
              placeholder="0x..."
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="seller-email" className="block text-sm font-medium text-gray-700 mb-1">
              Seller Email
            </label>
            <input
              type="text"
              id="seller-email"
              placeholder="seller@example.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
  
        {/* <div className="mb-6">
          <label htmlFor="evaluator-address" className="block text-sm font-medium text-gray-700 mb-1">
            Evaluator
          </label>
          <input
            type="text"
            id="evaluator-address"
            placeholder="Evaluator Address"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div> */}

        <div className="grid grid-cols-2 gap-8 mb-6">
          <div>
            <label htmlFor="evaluator-address" className="block text-sm font-medium text-gray-700 mb-1">
              Evaluator Address
            </label>
            <input
              type="text"
              id="evaluator-address"
              placeholder="0x..."
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="evaluator-email" className="block text-sm font-medium text-gray-700 mb-1">
              Evaluator Email
            </label>
            <input
              type="text"
              id="evaluator-email"
              placeholder="evaluator@example.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
  
        <button className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition-colors">
          Deploy
        </button>
      </div>
    );
  };
  
  export default ContractForm; 