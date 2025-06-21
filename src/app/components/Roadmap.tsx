export default function Roadmap() {
  return (
    <section id="roadmap" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Development Roadmap
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Our journey to expand the escrow space with AI and blockchain technology
          </p>
        </div>
        
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-1/2 transform -translate-x-px h-full w-0.5 bg-blue-200"></div>
          
          <div className="space-y-12">
            {/* Phase 1 */}
            <div className="relative flex items-center">
              <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-blue-600 rounded-full border-4 border-white shadow-lg"></div>
              <div className="w-5/12 pr-8 text-right">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Phase 1: Foundation</h3>
                <p className="text-gray-600">Q3 2025</p>
                <ul className="mt-4 text-sm text-gray-600 space-y-1">
                  <li>• Smart contract development</li>
                  <li>• Full stack development</li>
                  <li>• Basic escrow functionality</li>
                  <li>• Security audits</li>
                  <li>• Quality assurance with partners</li>
                </ul>
              </div>
            </div>
            
            {/* Phase 2 */}
            <div className="relative flex items-center justify-end">
              <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-blue-600 rounded-full border-4 border-white shadow-lg"></div>
              <div className="w-5/12 pl-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Phase 2: Advanced Platform Development</h3>
                <p className="text-gray-600">Q4 2025</p>
                <ul className="mt-4 text-sm text-gray-600 space-y-1">
                  <li>• Onchain Escrow Dispute Oracles</li>
                  <li>• DAO-powered dispute resolution</li>
                  <li>• Rental Marketplace</li>
                  <li>• Onchain reputation system</li>
                </ul>
              </div>
            </div>
            
            {/* Phase 3 */}
            <div className="relative flex items-center">
              <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-blue-600 rounded-full border-4 border-white shadow-lg"></div>
              <div className="w-5/12 pr-8 text-right">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Phase 3: Frontier Research</h3>
                <p className="text-gray-600">Q1 2026</p>
                <ul className="mt-4 text-sm text-gray-600 space-y-1">
                  <li>• Multi-party computation</li>
                  <li>• Research team expansion</li>
                  <li>• Integration with and development of industry standard protocols (ACP, etc.)</li>
                </ul>
              </div>
            </div>
            
            {/* Phase 4 */}
            <div className="relative flex items-center justify-end">
              <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-blue-600 rounded-full border-4 border-white shadow-lg"></div>
              <div className="w-5/12 pl-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Phase 4: Scale</h3>
                <p className="text-gray-600">Q2 2026</p>
                <ul className="mt-4 text-sm text-gray-600 space-y-1">
                  <li>• Global expansion</li>
                  <li>• Fine-tuned arbitration models</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 