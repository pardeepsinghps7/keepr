'use client'

import { DataTable } from '@/components/tables/DataTable'
import { supabaseClient } from '@/lib/supabaseClient'
import Link from 'next/link'
import { useEffect, useState } from 'react'

interface FormattedUser {
  id: string;
  email: string;
  email_confirmed: string;
  created_at: string;
  last_sign_in_at: string;
  items_count: number;
}

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
        header: 'Items',
        accessorKey: 'item_count',
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
    const [users, setUsers] = useState<FormattedUser[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true)
            try {

                const {data,error} = await supabaseClient.rpc('get_users_with_item_count')

                if (error) {
                    throw new Error("RPC Error:", error)
                }

                console.log(data)

                const formattedUser: FormattedUser[] = (data).map((user:any) => ({
                    id: user.id,
                    email: user.email,
                    email_confirmed: user.email_confirmed_at ? 'Yes' : 'No',
                    created_at: new Intl.DateTimeFormat('en-US', {
                        dateStyle: 'medium',
                        timeStyle: 'short',
                    }).format(new Date(user.created_at)),
                    last_sign_in_at: user.last_sign_in_at ? new Intl.DateTimeFormat('en-US', {
                        dateStyle: 'medium',
                        timeStyle: 'short',
                    }).format(new Date(user.last_sign_in_at)) : 'N/A',
                    item_count: user.item_count ?? 0
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
