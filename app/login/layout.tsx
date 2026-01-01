'use client'


import { useAppSelector } from '@/store/hooks';
import { useRouter } from 'next/navigation';
import React, { ReactNode, useEffect } from 'react'

const LoginLayout = ({ children }: { children: ReactNode }) => {
    const user = useAppSelector((state) => state.user);
    const router = useRouter();

    useEffect(() => {
        if(user.initialized && user.userId){
            router.push(`/tasks`);
        }
    }, []);

    if (user.userId) return null;

    return <>{children}</>;
}

export default LoginLayout