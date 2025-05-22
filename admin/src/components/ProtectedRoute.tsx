// components/ProtectedRoute.tsx
'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabaseClient } from '@/lib/supabaseClient';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const [loading, setLoading] = useState(true);
    const [authorized, setAuthorized] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const checkSession = async () => {
            const {
                data: { session },
            } = await supabaseClient.auth.getSession();

            const role = session?.user?.app_metadata?.role;

            if (!session || role !== 'admin') {
                router.replace('/signin');
            } else {
                setAuthorized(true);
            }

            setLoading(false);
        };

        checkSession();
    }, [router]);

    if (loading) return <div>Loading...</div>;

    return authorized ? <>{children}</> : null;
}
