'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader } from 'lucide-react';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    router.replace(token ? '/dashboard' : '/login');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader className="h-8 w-8 animate-spin text-purple-600" />
    </div>
  );
}
