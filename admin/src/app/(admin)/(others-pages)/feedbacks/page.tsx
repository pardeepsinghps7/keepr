'use client'

import { DataTable } from '@/components/tables/DataTable'
import { supabaseClient } from '@/lib/supabaseClient'
import { useEffect, useState } from 'react'

interface FormattedItem {
  id: string;
  email: string;
  version: string;
  feedback: string;
  created_at: string;
}

export default function UsersPage() {
    const [users, setUsers] = useState<FormattedItem[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [selectedItem, setSelectedItem] = useState<FormattedItem | null>(null);
    const [showModal, setShowModal] = useState(false);

    const handleView = (item: FormattedItem) => {
        setSelectedItem(item);
        setShowModal(true);
    };

    const columns = [
        {
            header: 'Email',
            accessorKey: 'email',
        },
        {
            header: 'Version',
            accessorKey: 'version',
        },
        {
            header: 'Feedback',
            id: 'feedback',
            cell: ({row}: any) => (
               row.original.feedback.length > 100 ? row.original.feedback.slice(0, 100) + "..." : row.original.feedback
            ),
        },
        {
            header: 'Created At',
            accessorKey: 'created_at',
        },
        {
            header: 'Detail',
            id: 'actions',
            cell: ({row}: any) => (
                <button
                    onClick={() => handleView(row.original)}
                    className="inline-flex items-center gap-2 rounded-lg bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-theme-xs ring-1 ring-inset ring-gray-300 transition hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700 dark:hover:bg-white/[0.03]"
                    title='View'
                >
                    View
                </button>
            ),
        }
    ]

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true)
            try {

                const {data,error} = await supabaseClient.rpc('get_users_feedbacks')

                if (error) {
                    throw new Error("RPC Error:", error)
                }

                const formattedUser: FormattedItem[] = (data).map((row:any) => ({
                    id: row.id,
                    email: row.email,
                    version: row.version,
                    feedback: row.feedback,
                    created_at: new Intl.DateTimeFormat('en-US', {
                        dateStyle: 'medium',
                        timeStyle: 'short',
                    }).format(new Date(row.created_at))
                }));
                
                setUsers(formattedUser) 
            } catch (err: any) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        fetchUsers()
    }, [])

    return (
        <div>
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">Feedbacks</h2>
            </div>

            {error && <p className="text-red-500">Error: {error}</p>}
            {loading ? (
                <p>Loading...</p>
            ) : (
                <>
                    <DataTable data={users} columns={columns} />
                    {showModal && selectedItem && (
                        <ItemModal
                            item={selectedItem}
                            onClose={() => setShowModal(false)}
                        />
                    )}
                </>
            )}
        </div>
    )
}

const ItemModal = ({
                       item,
                       onClose,
                   }: {
    item: FormattedItem;
    onClose: () => void;
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
                    Feedback
                </h4>
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-1 lg:gap-7 2xl:gap-x-32">
                    {item.feedback}
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
