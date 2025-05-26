'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { supabaseClient } from '@/lib/supabaseClient';
import { DataTable } from '@/components/tables/DataTable';
import {useRouter, usePathname} from "next/navigation";

interface ListItem {
    id: string;
    title: string;
    status: string;
    rating: number;
    save_for_later: boolean;
    created_at: string;
}

interface FormattedItem {
    id: string;
    title: string;
    status: string;
    rating: string | number;
    save_for_later: string;
    created_at: string;
}

export default function ItemsPage() {
    const router = useRouter()
    const searchParams = usePathname();
    const listId = searchParams.split('/').pop()
    const [items, setItems] = useState<FormattedItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const columns = useMemo(
        () => [
            {
                header: 'Title/Name',
                accessorKey: 'title',
            },
            {
                header: 'Status',
                accessorKey: 'status',
            },
            {
                header: 'Rating',
                accessorKey: 'rating',
            },
            {
                header: 'Save for Later',
                accessorKey: 'save_for_later',
            },
            {
                header: 'Created At',
                accessorKey: 'created_at',
            },
            {
                header: 'Actions',
                id: 'actions',
                cell: ({ row }: any) => (
                    <Link
                        href={`lists/${row.original.id}`}
                        className="text-gray-500 hover:text-error-500 dark:text-gray-400 dark:hover:text-error-500"
                    >
                        <svg
                            className="fill-current"
                            width="21"
                            height="21"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M12 4.5C7.305 4.5 3.187 7.364 1.5 12c1.687 4.636 5.805 7.5 10.5 7.5s8.813-2.864 10.5-7.5C20.813 7.364 16.695 4.5 12 4.5Zm0 12.25a4.75 4.75 0 1 1 0-9.5 4.75 4.75 0 0 1 0 9.5Zm0-2a2.75 2.75 0 1 0 0-5.5 2.75 2.75 0 0 0 0 5.5Z"
                                fill="currentColor"
                            />
                        </svg>
                    </Link>
                ),
                enableSorting: false,
            },
        ],
        []
    );
    function toWords(str: string) {
        return str
            .replace(/_/g, ' ') // Replace underscores with spaces
            .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize each word
    }
    useEffect(() => {
        if (!listId) return;
        const fetchData = async () => {
            setLoading(true);
            setError(null);

            const { data, error } = await supabaseClient
                .from('items')
                .select(`*, lists(label)`)
                .eq('list_id', listId)
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Supabase error:', error.message);
                setError('Failed to fetch data.');
                setLoading(false);
                return;
            }

            const formatted: FormattedItem[] = (data as ListItem[]).map((item) => ({
                id: item.id,
                title: item.title,
                status: toWords(item.status),
                rating: item.rating > 0 ? item.rating : '',
                save_for_later: item.save_for_later ? 'Yes' : 'No',
                created_at: new Intl.DateTimeFormat('en-US', {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                }).format(new Date(item.created_at)),
            }));

            setItems(formatted);
            setLoading(false);
        };

        fetchData();
    }, [router, listId]);

    return (
        <div>
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">
                    Items
                </h2>
            </div>

            {error && <p className="text-red-500">Error: {error}</p>}
            {loading ? (
                <p>Loading...</p>
            ) : (
                <DataTable data={items} columns={columns} />
            )}
        </div>
    );
}
