"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DappPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the home dashboard by default
    router.replace('/dapp/home');
  }, [router]);

  // Show a loading state while redirecting
  return (
    <div className="flex h-screen bg-gray-100 items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading dashboard...</p>
      </div>
    </div>
  );
} 