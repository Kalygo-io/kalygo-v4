export default function Roadmap() {
  return (
    <section id="roadmap" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Development Roadmap
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Our journey to revolutionize escrow with AI and blockchain technology
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
                <p className="text-gray-600">Q1 2024</p>
                <ul className="mt-4 text-sm text-gray-600 space-y-1">
                  <li>• Smart contract development</li>
                  <li>• Basic escrow functionality</li>
                  <li>• Security audits</li>
                  <li>• Beta testing with select partners</li>
                </ul>
              </div>
            </div>
            
            {/* Phase 2 */}
            <div className="relative flex items-center justify-end">
              <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-blue-600 rounded-full border-4 border-white shadow-lg"></div>
              <div className="w-5/12 pl-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Phase 2: AI Integration</h3>
                <p className="text-gray-600">Q2 2024</p>
                <ul className="mt-4 text-sm text-gray-600 space-y-1">
                  <li>• AI-powered dispute resolution</li>
                  <li>• Natural language processing</li>
                  <li>• Automated risk assessment</li>
                  <li>• Advanced analytics dashboard</li>
                </ul>
              </div>
            </div>
            
            {/* Phase 3 */}
            <div className="relative flex items-center">
              <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-blue-600 rounded-full border-4 border-white shadow-lg"></div>
              <div className="w-5/12 pr-8 text-right">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Phase 3: Expansion</h3>
                <p className="text-gray-600">Q3 2024</p>
                <ul className="mt-4 text-sm text-gray-600 space-y-1">
                  <li>• Multi-chain support</li>
                  <li>• DeFi integrations</li>
                  <li>• Mobile app launch</li>
                  <li>• Partnership ecosystem</li>
                </ul>
              </div>
            </div>
            
            {/* Phase 4 */}
            <div className="relative flex items-center justify-end">
              <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-blue-600 rounded-full border-4 border-white shadow-lg"></div>
              <div className="w-5/12 pl-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Phase 4: Scale</h3>
                <p className="text-gray-600">Q4 2024</p>
                <ul className="mt-4 text-sm text-gray-600 space-y-1">
                  <li>• Global market expansion</li>
                  <li>• Advanced AI agents</li>
                  <li>• DAO governance</li>
                  <li>• Enterprise solutions</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 