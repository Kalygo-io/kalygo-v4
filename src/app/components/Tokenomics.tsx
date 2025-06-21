export default function Tokenomics() {
  return (
    <section id="tokenomics" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Tokenomics
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            $KALY token powers the ecosystem and rewards active participants
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Token Distribution */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-8">Token Distribution</h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-blue-600 rounded-full mr-4"></div>
                  <span className="font-medium text-gray-900">Public Sale</span>
                </div>
                <span className="text-2xl font-bold text-blue-600">40%</span>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-green-600 rounded-full mr-4"></div>
                  <span className="font-medium text-gray-900">Ecosystem & Rewards</span>
                </div>
                <span className="text-2xl font-bold text-green-600">25%</span>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-purple-600 rounded-full mr-4"></div>
                  <span className="font-medium text-gray-900">Team & Advisors</span>
                </div>
                <span className="text-2xl font-bold text-purple-600">15%</span>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-orange-600 rounded-full mr-4"></div>
                  <span className="font-medium text-gray-900">Development Fund</span>
                </div>
                <span className="text-2xl font-bold text-orange-600">12%</span>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-red-600 rounded-full mr-4"></div>
                  <span className="font-medium text-gray-900">Marketing</span>
                </div>
                <span className="text-2xl font-bold text-red-600">8%</span>
              </div>
            </div>
          </div>
          
          {/* Token Utility */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-8">Token Utility</h3>
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-xl">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900">Governance</h4>
                </div>
                <p className="text-gray-600">
                  Vote on platform upgrades, feature proposals, and ecosystem decisions
                </p>
              </div>
              
              <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-xl">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900">Staking Rewards</h4>
                </div>
                <p className="text-gray-600">
                  Earn passive income by staking tokens and participating in network security
                </p>
              </div>
              
              <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-xl">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900">Fee Discounts</h4>
                </div>
                <p className="text-gray-600">
                  Reduced transaction fees and premium features for token holders
                </p>
              </div>
              
              <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-6 rounded-xl">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900">Community Access</h4>
                </div>
                <p className="text-gray-600">
                  Exclusive access to AI agents, early features, and community events
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Token Metrics */}
        <div className="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
          <h3 className="text-2xl font-bold mb-8 text-center">Token Metrics</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold mb-2">100M</div>
              <div className="text-blue-100">Total Supply</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">$0.10</div>
              <div className="text-blue-100">Initial Price</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">4 Years</div>
              <div className="text-blue-100">Vesting Period</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">Base</div>
              <div className="text-blue-100">Network</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 