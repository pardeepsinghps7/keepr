'use client';

import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";

import Badge from "../ui/badge/Badge";
import Image from "next/image";
import { supabaseClient } from "@/lib/supabaseClient";
import Link from "next/link";

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

export default function RecentItemsTable() {

  const [items, setItems] = useState<FormattedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async() => {
      setLoading(true);
      setError(null);

      const {data, error} = await supabaseClient
        .from('lists')
        .select(`
          id,
          label,
          icon,
          is_default,
          created_at,
          items(count)
        `)
        .limit(5)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error:', error.message);
        setError('Failed to fetch data.');
        setLoading(false);
        return;
      }

      const formatted : FormattedItem[] = (data as ListItem[]).map((item) => ({
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
      setLoading(false);


    };
    fetchData();
  }, []);

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[1102px]">
          <Table>
            {/* Table Header */}
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Icon
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Label
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Pre-defined
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Items
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Created At
                </TableCell>
              </TableRow>
            </TableHeader>

            {/* Table Body */}
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 overflow-hidden">
                        <Image
                          width={40}
                          height={40}
                          src={item.icon}
                          alt={item.icon}
                        />
                        {item.icon}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {item.label}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {item.is_default}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {item.items_count}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    <div className="flex -space-x-2">
                      {item.created_at}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="mt-4 flex justify-center">
            <Link
              href="/lists" // Replace with your actual route
              className="inline-flex items-center mb-4 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition"
            >
              View All
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
