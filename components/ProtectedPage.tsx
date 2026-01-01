"use client"


import { RootState } from '@/store';
import { useAppSelector } from '@/store/hooks';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react'

const ProtectedPage = ({ children }: { children: React.ReactNode }) => {
  const user = useAppSelector((state: RootState) => state.user);
  const router = useRouter();

  useEffect(() => {
    if (user.initialized && !user?.userId) {
      const pathname = window.location.pathname;
      const search = window.location.search;
      router.replace(`/login?redirect=${encodeURIComponent(pathname + search)}`);
    }
  }, [user]);

  if (!user?.userId) return null;

  return <>{children}</>;
}

export default ProtectedPage
