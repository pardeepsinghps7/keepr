'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { supabaseClient } from '@/lib/supabaseClient';
import { DataTable } from '@/components/tables/DataTable';
import { LIST_IDS } from '@/contants/lists';

interface ListItem {
    id: string;
    list_id: string;
    podcast_type: string;
    location: string;
    brewery: string;
    author: string;
    year: string;
    image_url: string;
    title: string;
    episode_title: string;
    series_title: string;
    status: string;
    rating: number;
    save_for_later: boolean;
    created_at: string;
    recommended_by: string;
    notes: string;
}

interface FormattedItem {
    id: string;
    list_id: string;
    podcast_type: string;
    location: string;
    brewery: string;
    author: string;
    year: string;
    image_url: string;
    title: string;
    episode_title: string;
    series_title: string;
    status: string;
    rating: string | number;
    save_for_later: string;
    created_at: string;
    recommended_by: string;
    notes: string;
}

export default function ItemsPage() {
    const router = useRouter();
    const pathname = usePathname();
    const listId = pathname.split('/').pop();

    const [items, setItems] = useState<FormattedItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedItem, setSelectedItem] = useState<FormattedItem | null>(null);
    const [showModal, setShowModal] = useState(false);

    const handleView = (item: FormattedItem) => {
        setSelectedItem(item);
        setShowModal(true);
    };

    const toWords = (str: string) =>
        str.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());

    const columns = [
        {
            header: 'Title/Name',
            accessorKey: 'title',
            cell: ({ row }: { row: any }) => {
                const item = row.original;
                return listId === LIST_IDS.Podcasts
                    ? `${item.episode_title} (${item.series_title})`
                    : item.title;
            },
        },
        { header: 'Status', accessorKey: 'status' },
        { header: 'Rating', accessorKey: 'rating' },
        { header: 'Save for Later', accessorKey: 'save_for_later' },
        { header: 'Created At', accessorKey: 'created_at' },
        {
            header: 'Actions',
            id: 'actions',
            cell: ({ row }: { row: any }) => (
                <button
                    onClick={() => handleView(row.original)}
                    className="text-gray-500 hover:text-error-500 dark:text-gray-400 dark:hover:text-error-500"
                >
                    <svg
                        className="fill-current"
                        width="21"
                        height="21"
                        viewBox="0 0 24 24"
                        fill="none"
                    >
                        <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M12 4.5C7.305 4.5 3.187 7.364 1.5 12c1.687 4.636 5.805 7.5 10.5 7.5s8.813-2.864 10.5-7.5C20.813 7.364 16.695 4.5 12 4.5Zm0 12.25a4.75 4.75 0 1 1 0-9.5 4.75 4.75 0 0 1 0 9.5Zm0-2a2.75 2.75 0 1 0 0-5.5 2.75 2.75 0 0 0 0 5.5Z"
                            fill="currentColor"
                        />
                    </svg>
                </button>
            ),
            enableSorting: false,
        },
    ];

    useEffect(() => {
        if (!listId) return;

        const fetchData = async () => {
            setLoading(true);
            setError(null);

            const { data, error } = await supabaseClient
                .from('items')
                .select('*')
                .eq('list_id', listId)
                .order('created_at', { ascending: false });

            if (error) {
                console.error(error);
                setError('Failed to fetch data.');
                setLoading(false);
                return;
            }

            const formatted = (data as ListItem[]).map((item) => ({
                ...item,
                podcast_type: item.podcast_type ? toWords(item.podcast_type) : '',
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
    }, [listId, router]);

    return (
        <div>
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">Items</h2>
            </div>

            {error && <p className="text-red-500">Error: {error}</p>}
            {loading ? (
                <p>Loading...</p>
            ) : (
                <>
                    <DataTable data={items} columns={columns} />
                    {showModal && selectedItem && (
                        <ItemModal
                            item={selectedItem}
                            onClose={() => setShowModal(false)}
                            listId={listId!}
                        />
                    )}
                </>
            )}
        </div>
    );
}

// Extracted Modal Component for clarity and reusability
const ItemModal = ({
                       item,
                       onClose,
                       listId,
                   }: {
    item: FormattedItem;
    onClose: () => void;
    listId: string;
}) => (
    <div className="fixed inset-0 flex items-center justify-center p-5 overflow-y-auto modal z-99999">
        <div className="fixed inset-0 h-full w-full bg-gray-400/50 backdrop-blur-[32px]" />
        <div className="relative w-full max-w-[600px] rounded-3xl bg-white p-6 dark:bg-gray-900 lg:p-10">
            <button
                onClick={onClose}
                className="absolute right-3 top-3 z-999 flex h-9.5 w-9.5 items-center justify-center rounded-full bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >
                <svg
                    className="fill-current"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                >
                    <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M6.043 16.541c-.39.39-.39 1.023 0 1.414.39.39 1.023.39 1.414 0L12 13.414l4.543 4.543c.39.39 1.023.39 1.414 0 .39-.39.39-1.023 0-1.414L13.414 12l4.543-4.543c.39-.39.39-1.023 0-1.414-.39-.39-1.023-.39-1.414 0L12 10.586 7.457 6.043c-.39-.39-1.023-.39-1.414 0-.39.39-.39 1.023 0 1.414L10.586 12l-4.543 4.543Z"
                    />
                </svg>
            </button>

            <div>
                <h4 className="mb-6 text-lg font-medium text-gray-800 dark:text-white/90">
                    Item Detail
                </h4>
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
                    {listId === LIST_IDS.Podcasts && (
                        <>
                            <Detail label="Podcast Type" value={item.podcast_type} />
                            <Detail label="Series Title" value={item.series_title} />
                            <Detail label="Episode Title" value={item.episode_title} />
                        </>
                    )}
                    {listId !== LIST_IDS.Podcasts && <Detail label="Title/Name" value={item.title} />}
                    {['Bourbon', 'Wine'].includes(listId) && <Detail label="Year" value={item.year} />}
                    {listId === LIST_IDS.Restaurants && (
                        <Detail label="Location" value={item.location} />
                    )}
                    {listId === LIST_IDS.Beer && <Detail label="Brewery" value={item.brewery} />}
                    {listId === LIST_IDS.Books && <Detail label="Author" value={item.author} />}
                    <Detail label="Save for Later" value={item.save_for_later} />
                    <Detail label="Status" value={item.status} />
                    <Detail label="Rating" value={item.rating} />
                    <Detail label="Recommended by" value={item.recommended_by} />
                    {['Bourbon', 'Wine'].includes(listId) && (
                        <div>
                            <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">Image</p>
                            <img
                                src={item.image_url}
                                alt=""
                                className="overflow-hidden w-full max-w-25"
                            />
                        </div>
                    )}
                    <Detail label="Created At" value={item.created_at} />
                </div>
                <div className="grid grid-cols-1 gap-4 mt-3">
                    <Detail label="Notes" value={item.notes} />
                </div>
            </div>

            <div className="flex items-center justify-end w-full gap-3 mt-8">
                <button
                    onClick={onClose}
                    type="button"
                    className="flex w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 sm:w-auto"
                >
                    Close
                </button>
            </div>
        </div>
    </div>
);

const Detail = ({
                    label,
                    value,
                }: {
    label: string;
    value: string | number;
}) => (
    <div>
        <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">{label}</p>
        <p className="text-sm font-medium text-gray-800 dark:text-white/90">
            {value}
        </p>
    </div>
);
