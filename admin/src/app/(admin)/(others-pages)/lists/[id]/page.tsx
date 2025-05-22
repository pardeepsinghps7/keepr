'use client'

import { DataTable } from '@/components/tables/DataTable'
import { useEffect, useState } from 'react'
import Link from "next/link";

const userColumns = (handleView, handleDelete) => [
    {
        header: 'Icon',
        accessorKey: 'icon',
        cell: ({ row }) => {
            const item = row.original;

            return (
                <div className="w-5 h-5 overflow-hidden">
                    <img src={item.icon} alt={item.label}/>
                </div>
            );
        },
        enableSorting: false,
    },
    {
        header: 'Label',
        accessorKey: 'label',
    },
    {
        header: 'Pre-defined',
        accessorKey: 'is_default',
    },
    {
        header: 'Items',
        accessorKey: 'items_count',
    },
    {
        header: 'Created At',
        accessorKey: 'created_at',
    },
    {
        header: 'Actions',
        id: 'actions',
        cell: ({ row }) => {
            const item = row.original;

            return (
                <div className="flex items-center gap-2">
                    <Link
                        href={
                            `lists/${item.id}`
                        }
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
        const fetchData = async () => {
            setLoading(true)
            try {
                const res = await fetch('/api/admin/lists')
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

        fetchData()
    }, [])

    return (
        <div>
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">Lists</h2>
            </div>

            {error && <p className="text-red-500">Error: {error}</p>}
            {loading ? (
                <p>Loading...</p>
            ) : (
                <>
                    <DataTable data={items} columns={userColumns(false, false)}/>
                </>
            )}
        </div>
    )
}
