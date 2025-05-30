'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { supabaseClient } from '@/lib/supabaseClient';
import { DataTable } from '@/components/tables/DataTable';

interface ListItem {
  id: string;
  label: string;
  icon: string;
  is_default: boolean;
  created_at: string;
  items: { count: number }[];
}

interface FormattedItem {
  id: string;
  label: string;
  icon: string;
  is_default: string;
  items_count: number;
  created_at: string;
}

export default function UsersPage() {
  const [items, setItems] = useState<FormattedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const columns = useMemo(() => [
    {
      header: 'Icon',
      accessorKey: 'icon',
      cell: ({ row }: any) => (
          <div className="w-5 h-5 overflow-hidden">
            <img src={row.original.icon} alt={row.original.label} />
          </div>
      ),
      enableSorting: false,
      enableGlobalFilter: false
    },
    { header: 'Label', accessorKey: 'label' },
    { header: 'Items', accessorKey: 'items_count' },
    { header: 'Created At', accessorKey: 'created_at' },
    {
      header: 'View Items',
      id: 'actions',
      cell: ({row}: any) => (
          <Link
              href={`/lists/${row.original.id}`}
              className="inline-flex items-center gap-2 rounded-lg bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-theme-xs ring-1 ring-inset ring-gray-300 transition hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700 dark:hover:bg-white/[0.03]"
              title='View Items'
          >
            View
          </Link>
      ),
      enableSorting: false,
    },
  ], []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error } = await supabaseClient
            .from('lists')
            .select(`
            id,
            label,
            icon,
            created_at,
            items(count)
          `).eq('is_default', false)
            .order('created_at', { ascending: false });

        if (error) throw new Error(error.message);

        const formatted: FormattedItem[] = (data as ListItem[]).map((item) => ({
          id: item.id,
          label: item.label,
          icon: item.icon,
          is_default: item.is_default ? 'Yes' : 'No',
          items_count: item.items?.[0]?.count ?? 0,
          created_at: new Intl.DateTimeFormat('en-US', {
            dateStyle: 'medium',
            timeStyle: 'short',
          }).format(new Date(item.created_at)),
        }));

        setItems(formatted);
      } catch (err) {
        console.error('Error fetching data:', (err as Error).message);
        setError('Failed to fetch data.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
      <div>
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">
            Lists
          </h2>
        </div>

        {error && <p className="text-red-500">Error: {error}</p>}
        {loading ? (
            <p>Loading...</p>
        ) : (
            <DataTable data={items} columns={columns} />
        )}
      </div>
  );
}
