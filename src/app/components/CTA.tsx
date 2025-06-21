interface CTAProps {
  onEnterDApp: () => void;
  onWatchDemo: () => void;
}

export default function CTA({ onEnterDApp, onWatchDemo }: CTAProps) {
  return (
    <section className="py-20 bg-gradient-to-r from-blue-500 to-blue-600">
      <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
          Are you ready?
        </h2>
        <p className="text-xl text-blue-100 mb-8">
          Join the frontier of what&apos;s possible. A world where you can trust the technology you do business with.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-lg text-lg font-semibold transition-all transform hover:scale-105 shadow-lg"
            onClick={onEnterDApp}
          >
            Enter dApp
          </button>
          <button 
            className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold transition-all"
            onClick={onWatchDemo}
          >
            Watch Demo
          </button>
        </div>
      </div>
    </section>
  );
} 