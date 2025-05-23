'use client';

import React, { useState } from 'react';
import { exportToCSV } from "@/utils/exportCSV";
import {
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    getPaginationRowModel,
    flexRender,
    ColumnDef,
    SortingState,
    ColumnFiltersState,
} from '@tanstack/react-table';

interface DataTableProps<TData> {
    data: TData[];
    columns: any[];
}

export function DataTable<TData>({ data, columns }: DataTableProps<TData>) {
    const [globalFilter, setGlobalFilter] = useState('');
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

    const table = useReactTable({
        data,
        columns,
        state: {
            globalFilter,
            sorting,
            columnFilters,
        },
        onGlobalFilterChange: setGlobalFilter,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    const handleExport = () => {
        const exportData = table.getRowModel().rows.map((row) => row.original);
        exportToCSV(exportData, 'users.csv');
    };

    return (
        <div className="space-y-5 sm:space-y-6">
            <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] ">
                <div className="space-y-6">
                    <div className="overflow-hidden  dark:bg-white/[0.03] rounded-xl">
                <div className="p-4 border-t border-gray-100 dark:border-gray-800 sm:p-6">
                    {/* Filter + Search Header */}
                    <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        {/* Show items dropdown */}
                        <div className="flex items-center gap-3">
                            <span className="text-gray-500 dark:text-gray-400"> Show </span>
                            <select
                                id="itemsPerPage"
                                value={table.getState().pagination.pageSize}
                                onChange={(e) => table.setPageSize(Number(e.target.value))}
                                className="dark:bg-dark-900 h-9 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none py-2 pl-3 pr-8 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                            >
                                {[10, 20, 50].map((size) => (
                                    <option key={size} value={size}>
                                        {size}
                                    </option>
                                ))}
                            </select>
                            <span className="text-gray-500 dark:text-gray-400"> entries </span>
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                value={globalFilter ?? ''}
                                onChange={(e) => setGlobalFilter(e.target.value)}
                                placeholder="Search..."
                                className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent py-2 px-4 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 xl:w-[300px]"
                            />
                            <button
                                onClick={handleExport}
                                className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-[11px] text-sm font-medium text-gray-700 shadow-theme-xs dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 sm:w-auto"
                            >
                                Download CSV
                            </button>
                        </div>
                    </div>


                    {/* Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full text-sm text-left border-collapse">
                    <thead className="border-t border-gray-100 dark:border-white/[0.05]">
                    {table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <th key={header.id} className=" px-4 py-3 border border-gray-100 dark:border-white/[0.05]">
                                    {header.isPlaceholder ? null : (
                                        <div
                                            className="flex items-center justify-between cursor-pointer"
                                            onClick={() => header.column.toggleSorting()}
                                        >
                                            <p className="font-medium text-gray-700 text-theme-xs dark:text-gray-400">
                                                {flexRender(header.column.columnDef.header, header.getContext())}
                                            </p>

                                            <button className="flex flex-col gap-0.5 ml-2">
                                                {/* Ascending Arrow (up) */}
                                                <svg
                                                    className={
                                                        header.column.getIsSorted() === 'asc'
                                                            ? 'text-brand-500'
                                                            : 'text-gray-300 dark:text-gray-700'
                                                    }
                                                    width="8"
                                                    height="5"
                                                    viewBox="0 0 8 5"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        d="M4.40962 0.585167C4.21057 0.300808 3.78943 0.300807 3.59038 0.585166L1.05071 4.21327C0.81874 4.54466 1.05582 5 1.46033 5H6.53967C6.94418 5 7.18126 4.54466 6.94929 4.21327L4.40962 0.585167Z"
                                                        fill="currentColor"
                                                    />
                                                </svg>

                                                {/* Descending Arrow (down) */}
                                                <svg
                                                    className={
                                                        header.column.getIsSorted() === 'desc'
                                                            ? 'text-brand-500'
                                                            : 'text-gray-300 dark:text-gray-700'
                                                    }
                                                    width="8"
                                                    height="5"
                                                    viewBox="0 0 8 5"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        d="M4.40962 4.41483C4.21057 4.69919 3.78943 4.69919 3.59038 4.41483L1.05071 0.786732C0.81874 0.455343 1.05582 0 1.46033 0H6.53967C6.94418 0 7.18126 0.455342 6.94929 0.786731L4.40962 4.41483Z"
                                                        fill="currentColor"
                                                    />
                                                </svg>
                                            </button>
                                        </div>
                                    )}
                                </th>
                            ))}

                        </tr>
                    ))}
                    </thead>

                    <tbody>
                    {table.getRowModel().rows.map((row) => (
                        <tr key={row.id}>
                            {row.getVisibleCells().map((cell) => (
                                <td key={cell.id} className=" px-4 py-3 border border-gray-100 dark:border-white/[0.05] whitespace-nowrap">
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </td>
                            ))}
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-6">
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                        className="px-3 py-1.5 text-sm bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                    >
                        Prev
                    </button>
                    <button
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                        className="px-3 py-1.5 text-sm bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
                <div className="text-sm text-gray-600">
                    Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                </div>
            </div>
                </div>
                    </div>
                </div>
        </div>
        </div>
    );
}
