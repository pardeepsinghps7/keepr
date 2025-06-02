'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { supabaseClient } from '@/lib/supabaseClient';
import { DataTable } from '@/components/tables/DataTable';
import { LIST_IDS } from '@/contants/lists';
import Image from "next/image";

interface ListItem {
    id: string;
    list_id: string;
    list_label: string;
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
    lists: { label: string }; // Adjusted to match your select('*, lists(label)')
}

interface FormattedItem extends Omit<ListItem, 'save_for_later' | 'rating' | 'status' | 'podcast_type' | 'lists'> {
    podcast_type: string;
    status: string;
    rating: string | number;
    save_for_later: string;
    created_at: string;
    list_label: string;
}

const toWords = (str: string) =>
    str.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());

export default function ItemsPage() {
    const pathname = usePathname();
    const userId = pathname.split('/').pop();

    const [items, setItems] = useState<FormattedItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedItem, setSelectedItem] = useState<FormattedItem | null>(null);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const { data, error } = await supabaseClient
                .from('items')
                .select('*, lists(label)')
                .eq('user_id', userId)
                .order('created_at', { ascending: false });

            if (error) throw error;

            const formatted: FormattedItem[] = (data as ListItem[]).map((item) => ({
                ...item,
                podcast_type: item.podcast_type ? toWords(item.podcast_type) : '',
                list_label: toWords(item.lists.label),
                status: toWords(item.status),
                rating: item.rating > 0 ? item.rating : 'N/A',
                save_for_later: item.save_for_later ? 'Yes' : 'No',
                created_at: new Intl.DateTimeFormat('en-US', {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                }).format(new Date(item.created_at)),
            }));

            setItems(formatted);
        } catch (err) {
            console.error(err);
            setError('Failed to fetch data.');
        } finally {
            setLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        if (userId) fetchData();
    }, [userId, fetchData]);

    const columns = useMemo(() => [
        {
            header: 'Title/Name',
            accessorKey: 'title',
            cell: ({ row }: { row: any }) => {
                const item = row.original;
                return item.list_id === LIST_IDS.Podcasts
                    ? `${item.episode_title} (${item.series_title})`
                    : item.title;
            },
        },
        { header: 'List', accessorKey: 'list_label' },
        { header: 'Status', accessorKey: 'status' },
        { header: 'Rating', accessorKey: 'rating' },
        { header: 'Save for Later', accessorKey: 'save_for_later' },
        { header: 'Created At', accessorKey: 'created_at' },
        {
            header: 'View Details',
            id: 'actions',
            cell: ({ row }: { row: any }) => (
                <button
                    onClick={() => setSelectedItem(row.original)}
                    className="inline-flex items-center gap-2 rounded-lg bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-theme-xs ring-1 ring-inset ring-gray-300 transition hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700 dark:hover:bg-white/[0.03]"
                    title='View Detail'
                >
                    View
                </button>
            ),
            enableSorting: false,
        },
    ], []);

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
                    {selectedItem && (
                        <ItemModal item={selectedItem} onClose={() => setSelectedItem(null)} />
                    )}
                </>
            )}
        </div>
    );
}

const ItemModal = ({ item, onClose }: { item: FormattedItem; onClose: () => void }) => (
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
                <h4 className="mb-6 text-lg font-medium text-gray-800 dark:text-white/90">Item Detail</h4>
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
                    {item.list_id === LIST_IDS.Podcasts && (
                        <>
                            <Detail label="Podcast Type" value={item.podcast_type} />
                            <Detail label="Series Title" value={item.series_title} />
                            <Detail label="Episode Title" value={item.episode_title} />
                        </>
                    )}
                    {item.list_id !== LIST_IDS.Podcasts && <Detail label="Title/Name" value={item.title} />}
                    {[LIST_IDS.Bourbon, LIST_IDS.Wine].includes(item.list_id) && <Detail label="Year" value={item.year} />}
                    {item.list_id === LIST_IDS.Restaurants && <Detail label="Location" value={item.location} />}
                    {item.list_id === LIST_IDS.Beer && <Detail label="Brewery" value={item.brewery} />}
                    {item.list_id === LIST_IDS.Books && <Detail label="Author" value={item.author} />}
                    <Detail label="Save for Later" value={item.save_for_later} />
                    <Detail label="Status" value={item.status} />
                    <Rating label="Rating" value={item?.rating ?? "N/A"} />
                    <Detail label="Recommended by" value={item.recommended_by ? item.recommended_by : "N/A"} />
                    {[LIST_IDS.Bourbon, LIST_IDS.Wine].includes(item.list_id) && (
                        <div>
                            <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">Image</p>
                            {item.image_url && (
                                <Image src={item.image_url} alt="" className="overflow-hidden w-full max-w-25"/>
                            )}
                        </div>
                    )}
                    <Detail label="Created At" value={item.created_at} />
                </div>
                <div className="grid grid-cols-1 gap-4 mt-3">
                    <Detail label="Notes" value={item.notes ? item.notes : "N/A"} />
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

const Detail = ({ label, value }: { label: string; value: string | number }) => (
    <div>
        <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">{label}</p>
        <p className="text-sm font-medium text-gray-800 dark:text-white/90">{value}</p>
    </div>
);

const Rating = ({
                    label,
                    value,
                }: {
    label: string;
    value: string | number | null | undefined;
}) => {
    const rating = Number(value);
    const maxStars = 5;

    const isValidRating = !isNaN(rating) && rating > 0;

    return (
        <div>
            <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">{label}</p>
            {isValidRating ? (
                <div className="flex items-center">
                    {[...Array(maxStars)].map((_, index) => (
                        <svg
                            key={index}
                            className={`shrink-0 size-5 ${
                                index < rating ? 'text-gray-800' : 'text-gray-300'
                            }`}
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            viewBox="0 0 16 16"
                        >
                            <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                        </svg>
                    ))}
                </div>
            ) : (
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                    {value}
                </p>
            )}
        </div>
    );
};