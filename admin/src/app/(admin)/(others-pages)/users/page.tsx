'use client'

import { DataTable } from '@/components/tables/DataTable'
import Link from 'next/link'
import { useEffect, useState } from 'react'

const userColumns = [
    {
        header: 'Email',
        accessorKey: 'email',
    },
    {
        header: 'Email Confirmed',
        accessorKey: 'email_confirmed',
    },
    {
        header: 'Created At',
        accessorKey: 'created_at',
    },
    {
        header: 'Last Sign In At',
        accessorKey: 'last_sign_in_at',
    },
    {
        header: 'Actions',
        id: 'actions',
        cell: ({row}: any) => (
            <Link 
            href={`users/${row.original.id}`}
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
    }
]

export default function UsersPage() {
    const [users, setUsers] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true)
            try {
                const res = await fetch('/api/admin/users')
                const data = await res.json()
                if (res.ok) {
                    setUsers(data)
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

    return (
        <div>
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">Users</h2>
            </div>

            {error && <p className="text-red-500">Error: {error}</p>}
            {loading ? (
                <p>Loading...</p>
            ) : (
                <DataTable data={users} columns={userColumns} />
            )}
        </div>
    )
}
