'use client'

import { DataTable } from '@/components/tables/DataTable'
import { useEffect, useState } from 'react'

const userColumns = [
    {
        header: 'ID',
        accessorKey: 'id',
    },
    {
        header: 'Email',
        accessorKey: 'email',
    },
    {
        header: 'Created At',
        accessorKey: 'created_at',
    },
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
