'use client';

import { useEffect, useState } from 'react';
import { supabaseClient } from '@/lib/supabaseClient';
import { DataTable } from '@/components/tables/DataTable';
import {useRouter, usePathname} from "next/navigation";
import  { LIST_IDS } from '@/contants/lists';

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

interface SelectedItem extends FormattedItem {
    list_id: string;
    podcast_type: string;
    location: string;
    brewery: string;
    author: string;
    year: string;
    image_url: string;
    recommended_by: string;
    notes: string;
}

export default function ItemsPage() {
    const router = useRouter()
    const searchParams = usePathname();
    const listId = searchParams.split('/').pop()
    const [items, setItems] = useState<FormattedItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedItem, setselectedItem] = useState<SelectedItem | null>(null);
    const [showModal, setShowModal] = useState(false);

    const handleView = (item: any) => {
        setselectedItem(item);
        console.log(item)
        setShowModal(true);
    };

    const columns = (handleView: (item: any) => void) => [
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
            cell: ({ row } : {row: any} ) => {
                const item = row.original;

                return (
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => handleView(item)}
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
                        </button>
                    </div>
                );
            },
            enableSorting: false,
        },
    ];
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
                list_id: item.list_id,
                podcast_type: item.podcast_type,
                location: item.location,
                brewery: item.brewery,
                title: item.title,
                author: item.author,
                year: item.year,
                image_url: item.image_url,
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
                <>
                    <DataTable data={items} columns={columns(handleView)} />
                    {showModal && selectedItem && (
                        <div
                            className="fixed inset-0 flex items-center justify-center p-5 overflow-y-auto modal z-99999">
                            <div
                                className="modal-close-btn fixed inset-0 h-full w-full bg-gray-400/50 backdrop-blur-[32px]"></div>
                            <div className="relative w-full max-w-[600px] rounded-3xl bg-white p-6 dark:bg-gray-900 lg:p-10">
                                <button onClick={() => setShowModal(false)} className="absolute right-3 top-3 z-999 flex h-9.5 w-9.5 items-center justify-center rounded-full bg-gray-100 text-gray-400 transition-colors hover:bg-gray-200 hover:text-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white sm:right-6 sm:top-6 sm:h-11 sm:w-11">
                                    <svg className="fill-current" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M6.04289 16.5413C5.65237 16.9318 5.65237 17.565 6.04289 17.9555C6.43342 18.346 7.06658 18.346 7.45711 17.9555L11.9987 13.4139L16.5408 17.956C16.9313 18.3466 17.5645 18.3466 17.955 17.956C18.3455 17.5655 18.3455 16.9323 17.955 16.5418L13.4129 11.9997L17.955 7.4576C18.3455 7.06707 18.3455 6.43391 17.955 6.04338C17.5645 5.65286 16.9313 5.65286 16.5408 6.04338L11.9987 10.5855L7.45711 6.0439C7.06658 5.65338 6.43342 5.65338 6.04289 6.0439C5.65237 6.43442 5.65237 7.06759 6.04289 7.45811L10.5845 11.9997L6.04289 16.5413Z" fill=""></path>
                                    </svg>
                                </button>

                                <div>
                                    <h4 className="mb-6 text-lg font-medium text-gray-800 dark:text-white/90">
                                        Item Detail
                                    </h4>
                                    <div
                                        className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
                                        {selectedItem?.list_id === LIST_IDS.Podcasts && (
                                            <div>
                                                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                                    Podcast Type
                                                </p>
                                                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                                    {selectedItem.podcast_type}
                                                </p>
                                            </div>
                                        )}
                                        <div>
                                            <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                                Title/Name
                                            </p>
                                            <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                                {selectedItem.title}
                                            </p>
                                        </div>
                                        {[LIST_IDS.Bourbon, LIST_IDS.Wine].includes(selectedItem?.list_id || '') && (
                                            <div>
                                                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                                    Year
                                                </p>
                                                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                                    {selectedItem.year}
                                                </p>
                                            </div>
                                        )}
                                        {[LIST_IDS.Restaurants].includes(selectedItem?.list_id || '') && (
                                            <div>
                                                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                                    Location
                                                </p>
                                                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                                    {selectedItem.location}
                                                </p>
                                            </div>
                                        )}
                                        {[LIST_IDS.Beer].includes(selectedItem?.list_id || '') && (
                                            <div>
                                                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                                    Brewery
                                                </p>
                                                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                                    {selectedItem.brewery}
                                                </p>
                                            </div>
                                        )}
                                        {selectedItem?.list_id === LIST_IDS.Books && (
                                            <div>
                                                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                                    Author
                                                </p>
                                                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                                    {selectedItem.author}
                                                </p>
                                            </div>
                                        )}
                                        <div>
                                            <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                                Save for Later
                                            </p>
                                            <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                                {selectedItem.save_for_later ? 'Yes' : 'No'}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                                Status
                                            </p>
                                            <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                                {selectedItem.status}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                                Rating
                                            </p>
                                            <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                                {selectedItem.rating}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                                Recommended by
                                            </p>
                                            <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                                {selectedItem.recommended_by}
                                            </p>
                                        </div>
                                        {[LIST_IDS.Bourbon, LIST_IDS.Wine].includes(selectedItem?.list_id || '') && (
                                            <div>
                                                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                                    Image
                                                </p>
                                                <div className="relative h-25 w-full max-w-25">
                                                    <img src={selectedItem.image_url} alt="" className="overflow-hidden"/>
                                                </div>
                                            </div>
                                        )}
                                        <div>
                                            <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                                Created At
                                            </p>
                                            <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                                {selectedItem.created_at}
                                            </p>
                                        </div>
                                    </div>
                                    <div
                                        className="grid grid-cols-1 gap-4 mt-3">
                                        <div>
                                            <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                                Notes
                                            </p>
                                            <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                                {selectedItem.notes}
                                            </p>
                                        </div>
                                    </div>
                                </div>


                                <div className="flex items-center justify-end w-full gap-3 mt-8">
                                    <button onClick={() => setShowModal(false)} type="button" className="flex w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 sm:w-auto">
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
