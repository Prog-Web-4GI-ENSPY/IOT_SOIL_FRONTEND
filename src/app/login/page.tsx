"use client";

import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import LoginForm from '@/features/auth/components/LoginForm';
import { Suspense } from 'react';

// Composant interne pour gérer les SearchParams (nécessaire pour Next.js 15+)
function LoginContent() {
  const searchParams = useSearchParams();
  const role = searchParams.get('role');

  return <LoginForm role={role} />;
}

export default function LoginPage() {
  return (
    <main className="relative min-h-screen w-full flex items-center justify-center p-4">
      {/* Background Image fixe */}
      <div className="absolute inset-0 z-[-1]">
        <Image
          src="/image.png"
          alt="Fond rural"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/15 backdrop-blur-[2px]" />
      </div>

      {/* Utilisation de Suspense car useSearchParams est utilisé côté client */}
      <Suspense fallback={<div className="text-white">Chargement...</div>}>
        <LoginContent />
      </Suspense>
    </main>
  );
}