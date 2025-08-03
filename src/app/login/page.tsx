'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Loading from '../loading';


export default function LoginPage() {
    const router = useRouter();

    useEffect(() => {
        router.push('/');
      }, [router]);

    return <Loading />;
}
