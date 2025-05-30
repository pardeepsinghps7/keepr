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
        header: 'View Items',
        id: 'actions',
        cell: ({row}: any) => (
            <Link
            href={`users/${row.original.id}`}
            className="inline-flex items-center gap-2 rounded-lg bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-theme-xs ring-1 ring-inset ring-gray-300 transition hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700 dark:hover:bg-white/[0.03]"
            title='View Items'
            >
                Items
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

                const formattedUser: FormattedUser[] = (data).map((user:any) => ({
                    id: user.id,
                    email: user.email,
                    email_confirmed: user.email_confirmed ? 'Yes' : 'No',
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
