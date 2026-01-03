"use client";

import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import RegisterForm from '@/components/auth/RegisterForm';
import { Suspense } from 'react';

function RegisterContent() {
  const searchParams = useSearchParams();
  const role = searchParams.get('role');
  return <RegisterForm role={role} />;
}

export default function RegisterPage() {
  return (
    <main className="relative min-h-screen w-full flex items-center justify-center p-4">
      <div className="absolute inset-0 z-[-1]">
        <Image src="/image.png" alt="Background" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-black/15 backdrop-blur-[2px]" />
      </div>

      <Suspense fallback={<div className="text-white">Chargement...</div>}>
        <RegisterContent />
      </Suspense>
    </main>
  );
}