'use client'

import { DataTable } from '@/components/tables/DataTable'
import { useEffect, useState } from 'react'
import Link from "next/link";
import { supabaseClient } from '@/lib/supabaseClient';

const userColumns = (handleView : (item: any) => void, handleDelete : (item: any) => void) => [
    {
        header: 'Avatar',
        accessorKey: 'path',
        cell: ({ row } : any) => {
            const item = row.original;
            return (
                <img src={item.path} alt="" className="w-20 h-20 rounded-full" />
            );
        },
        enableSorting: false,
    },
    {
        header: 'Created At',
        accessorKey: 'created_at',
    },
    {
        header: 'Actions',
        id: 'actions',
        cell: ({ row }: any) => {
            const item = row.original;

            return (
                <div className="flex items-center gap-2">
                    {/* <button onClick={() => handleDelete(item)} className="text-gray-500 hover:text-error-500 dark:text-gray-400 dark:hover:text-error-500"> */}
                        {/* <svg className="fill-current" width="21" height="21" viewBox="0 0 21 21" fill="none"
                             xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" clipRule="evenodd"
                                  d="M7.04142 4.29199C7.04142 3.04935 8.04878 2.04199 9.29142 2.04199H11.7081C12.9507 2.04199 13.9581 3.04935 13.9581 4.29199V4.54199H16.1252H17.166C17.5802 4.54199 17.916 4.87778 17.916 5.29199C17.916 5.70621 17.5802 6.04199 17.166 6.04199H16.8752V8.74687V13.7469V16.7087C16.8752 17.9513 15.8678 18.9587 14.6252 18.9587H6.37516C5.13252 18.9587 4.12516 17.9513 4.12516 16.7087V13.7469V8.74687V6.04199H3.8335C3.41928 6.04199 3.0835 5.70621 3.0835 5.29199C3.0835 4.87778 3.41928 4.54199 3.8335 4.54199H4.87516H7.04142V4.29199ZM15.3752 13.7469V8.74687V6.04199H13.9581H13.2081H7.79142H7.04142H5.62516V8.74687V13.7469V16.7087C5.62516 17.1229 5.96095 17.4587 6.37516 17.4587H14.6252C15.0394 17.4587 15.3752 17.1229 15.3752 16.7087V13.7469ZM8.54142 4.54199H12.4581V4.29199C12.4581 3.87778 12.1223 3.54199 11.7081 3.54199H9.29142C8.87721 3.54199 8.54142 3.87778 8.54142 4.29199V4.54199ZM8.8335 8.50033C9.24771 8.50033 9.5835 8.83611 9.5835 9.25033V14.2503C9.5835 14.6645 9.24771 15.0003 8.8335 15.0003C8.41928 15.0003 8.0835 14.6645 8.0835 14.2503V9.25033C8.0835 8.83611 8.41928 8.50033 8.8335 8.50033ZM12.9168 9.25033C12.9168 8.83611 12.581 8.50033 12.1668 8.50033C11.7526 8.50033 11.4168 8.83611 11.4168 9.25033V14.2503C11.4168 14.6645 11.7526 15.0003 12.1668 15.0003C12.581 15.0003 12.9168 14.6645 12.9168 14.2503V9.25033Z"
                                  fill=""></path>
                        </svg> */}
                    {/* </button> */}

                    <Link href={
                        `${item.path}`
                    } target="_blank" className="text-gray-500 hover:text-error-500 dark:text-gray-400 dark:hover:text-error-500">
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
                </div>
            );
        },
        enableSorting: false,
    }
]

export default function UsersPage() {
    const [items, setItems] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true)
            try {
                const res = await fetch('/api/admin/avatars')
                const data = await res.json()
                if (res.ok) {
                    setItems(data)
                } else {
                    throw new Error(data.error)
                }
            } catch (err: any) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        fetchUsers()
    }, [])

    const [selectedItem, setselectedItem] = useState<any>(null);
    const [showModal, setShowModal] = useState(false);

    const handleView = (item: any) => {
        setselectedItem(item);
        setShowModal(true);
    };

    const handleDelete = async (item: any) => {
        const confirmed = confirm(`Are you sure?`);
        if (!confirmed) return;

        const { error } = await supabaseClient.from('avatars').delete().eq('id',item.id);

        // const res = await fetch(`/api/admin/avatars/${item.id}`, {
        //     method: 'DELETE'
        // });

        if (error) {
            console.error('Delete failed:', error.message);
            alert('Failed to delete the avatar. Please try again.');
            return;
        }

        setItems((prev) => prev.filter((m) => m.id !== item.id));

    };

    return (
        <div>
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">Avatars</h2>
            </div>

            {error && <p className="text-red-500">Error: {error}</p>}
            {loading ? (
                <p>Loading...</p>
            ) : (
                <>
                    <DataTable data={items} columns={userColumns(handleView, handleDelete)}/>
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
                                            <div>
                                                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                                    Title
                                                </p>
                                                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                                    {selectedItem?.title ?? 'N/A'}
                                                </p>
                                            </div>
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
                                                    {selectedItem?.status ?? 'N/A'}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                                    Rating
                                                </p>
                                                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                                    {selectedItem?.rating ?? 'N/A'}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                                    Recommended by
                                                </p>
                                                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                                    {selectedItem?.recommended_by ?? 'N/A'}
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
                                                    {selectedItem?.notes ?? 'N/A'}
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
    )
}
