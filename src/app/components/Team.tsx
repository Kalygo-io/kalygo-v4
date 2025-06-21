import Image from "next/image";

export default function Team() {
  return (
    <section id="team" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Meet Our Team
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Experienced professionals from AI, blockchain, and Tech backgrounds
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Team Member 1 */}
          <div className="bg-white p-8 rounded-xl shadow-lg text-center hover:shadow-xl transition-shadow">
            <Image 
              src="/team/tad_duval.png" 
              alt="Tad Duval" 
              width={96}
              height={96}
              className="w-24 h-24 rounded-full mx-auto mb-6 object-cover"
            />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Tad Duval</h3>
            <p className="text-blue-600 font-medium mb-4">CEO & Founder</p>
            <p className="text-gray-600 text-sm mb-4">
              14+ years in software development.
            </p>
            <div className="flex justify-center space-x-3">
              
              <a href="https://www.linkedin.com/in/%F0%9F%8C%88-tad-duval-%F0%9F%8C%88-4a57571a8/" className="text-gray-400 hover:text-blue-600 transition-colors">
                {/* LinkedIn logo */}
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <a href="https://x.com/CMD_LABS" className="text-gray-400 hover:text-blue-600 transition-colors">
                {/* X.com logo */}
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Team Member 2 */}
          <div className="bg-white p-8 rounded-xl shadow-lg text-center hover:shadow-xl transition-shadow">
            <Image 
              src="/team/andrei_lemeshevski.jpg" 
              alt="Andrei Lemeshevski" 
              width={96}
              height={96}
              className="w-24 h-24 rounded-full mx-auto mb-6 object-cover"
            />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Andrei Lemeshevski</h3>
            <p className="text-blue-600 font-medium mb-4">Growth Advisor</p>
            <p className="text-gray-600 text-sm mb-4">
              Founder of ETHMiami
            </p>
            <div className="flex justify-center space-x-3">
              <a href="https://www.linkedin.com/in/andrei-lemeshevski-76655b6/" className="text-gray-400 hover:text-blue-600 transition-colors">
                {/* LinkedIn logo */}
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <a href="https://x.com/EthMiami" className="text-gray-400 hover:text-blue-600 transition-colors">
                {/* X.com logo */}
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Team Member 3 */}
          <div className="bg-white p-8 rounded-xl shadow-lg text-center hover:shadow-xl transition-shadow">
            <Image 
              src="/team/nick_lemeshevski.jpg" 
              alt="Nick Lemeshevski" 
              width={96}
              height={96}
              className="w-24 h-24 rounded-full mx-auto mb-6 object-cover"
            />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Nick Lemeshevski</h3>
            <p className="text-blue-600 font-medium mb-4">Marketing Advisor</p>
            <p className="text-gray-600 text-sm mb-4">
              Base Influencer.
            </p>
            <div className="flex justify-center space-x-3">
              <a href="https://x.com/nickcryptopro" className="text-gray-400 hover:text-blue-600 transition-colors">
                {/* X.com logo */}
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
} 