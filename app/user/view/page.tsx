'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { 
    ArrowLeft, 
    UsersRound, 
    ShieldCheck, 
    Activity, 
    Pencil, 
    Trash2,
    ChevronLeft,
    ChevronRight,
    Search // <-- 1. Imported Search icon
} from 'lucide-react';
import { confirmDelete, showError, showDeleteSuccess } from '@/components/DeleteUserAction';
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel, // <-- 2. Imported the filter logic
  flexRender,
} from "@tanstack/react-table";

type ListedUser = {
    empID: string;
    name: string;
    role: string;
    status: 'Active' | 'Inactive';
    email: string;
};

type ApiUser = {
    empID?: string;
    firstname?: string;
    middlename?: string;
    lastname?: string;
    suffix?: string;
    role?: string;
    roles?: {
        name?: string;
    } | null;
    status?: boolean;
    email?: string;
};

export default function ViewUserPage() {
    const router = useRouter();
    const [users, setUsers] = useState<ListedUser[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState<string | null>(null);
    
    // --- 3. Added state for our Search Bar ---
    const [globalFilter, setGlobalFilter] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            setIsLoading(true);
            setLoadError(null);

            try {
                const response = await fetch('/api/user/list', { cache: 'no-store' });
                const data = (await response.json()) as {
                    error?: string;
                    users?: ApiUser[];
                };

                if (!response.ok) {
                    setLoadError(data.error ?? 'Failed to load users.');
                    setUsers([]);
                    return;
                }

                const mapped = (data.users ?? []).map((user) => {
                    const fullname = [
                        user.firstname?.trim() || '',
                        user.middlename?.trim() || '',
                        user.lastname?.trim() || '',
                        user.suffix?.trim() || '',
                    ]
                        .filter(Boolean)
                        .join(' ');

                    return {
                        empID: user.empID || user.email || Math.random().toString(36),
                        name: fullname || 'Unnamed User',
                        role: user.roles?.name || user.role || 'Unassigned',
                        status: user.status ? 'Active' : 'Inactive',
                        email: user.email || '',
                    } as ListedUser;
                });

                setUsers(mapped);
            } catch {
                setLoadError('Unable to connect to server.');
                setUsers([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const handleBack = () => {
        router.push('/user');
    };

    const handleAddUser = () => {
        router.push('/user/create');
    };

    const handleEditUser = (empID: string) => {
        router.push(`/user/create?empID=${encodeURIComponent(empID)}`);
    };

    const handleDeleteUser = async (empID: string, name: string) => {
        const confirmed = await confirmDelete(name);
        if (!confirmed) return;

        try {
            const res = await fetch('/api/user/delete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ empID }),
            });

            const data = await res.json();

            if (!res.ok) {
                await showError(data.error || 'An error occurred while deleting the user.', 'Unable to delete user');
                return;
            }

            setUsers((prev) => prev.filter((user) => user.empID !== empID));

            await showDeleteSuccess(name);
        } catch (err) {
            await showError('Unable to connect to server.');
        }
    };

    const columns = useMemo(() => [
        {
            accessorKey: 'name',
            header: 'Name',
        },
        {
            accessorKey: 'role',
            header: 'Role',
            cell: ({ row }: any) => (
                <div className='inline-flex items-center gap-2'>
                    <ShieldCheck className='h-4 w-4 text-slate-400' />
                    {row.original.role}
                </div>
            )
        },
        {
            accessorKey: 'status',
            header: 'Status',
            cell: ({ row }: any) => {
                const status = row.original.status;
                return (
                    <span
                        className={`rounded px-2 py-1 text-xs ${
                            status === 'Active'
                                ? 'bg-emerald-50 text-emerald-600'
                                : 'bg-gray-100 text-gray-500'
                        }`}
                    >
                        {status}
                    </span>
                );
            }
        },
        {
            id: 'actions',
            header: () => <div className="text-right">Actions</div>,
            cell: ({ row }: any) => {
                const user = row.original;
                return (
                    <div className='flex justify-end gap-2'>
                        <button
                            type='button'
                            className={`font-inter inline-flex items-center gap-2 rounded border border-gray-200 px-3 py-1.5 text-xs text-slate-600 transition-colors hover:bg-gray-50 cursor-pointer`}
                        >
                            <Activity className='h-3.5 w-3.5' />
                            View Log
                        </button>
                        <button
                            type='button'
                            onClick={() => handleEditUser(user.empID)}
                            className={`font-inter inline-flex items-center gap-2 rounded border border-gray-200 px-3 py-1.5 text-xs text-slate-600 transition-colors hover:bg-gray-50 cursor-pointer`}
                        >
                            <Pencil className='h-3.5 w-3.5' />
                            Edit
                        </button>
                        <button
                            type='button'
                            onClick={() => handleDeleteUser(user.empID, user.name)}
                            className={`font-inter inline-flex items-center gap-2 rounded border border-gray-200 px-3 py-1.5 text-xs text-rose-600 transition-colors hover:bg-rose-50 cursor-pointer`}
                        >
                            <Trash2 className='h-3.5 w-3.5' />
                            Delete
                        </button>
                    </div>
                );
            }
        }
    ], []); 

    // --- 4. Updated Hook to include the Filter logic ---
    const table = useReactTable({
        data: users,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFilteredRowModel: getFilteredRowModel(), 
        onGlobalFilterChange: setGlobalFilter,
        initialState: {
            pagination: {
                pageSize: 5, 
            },
		},
		state: {
            globalFilter, 
        },
    });

    return (
        <div className='flex'>
            <main className='flex-1'>
                <header className='mb-8'>
                    <button
                        type='button'
                        onClick={handleBack}
                        className={`font-lexend mb-5 inline-flex items-center gap-2 text-sm text-slate-500 transition-colors hover:text-slate-700 cursor-pointer`}
                    >
                        <ArrowLeft className='h-4 w-4' />
                        Back to User Management
                    </button>

                    <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
                        <div>
                            <h1 className={`font-lexend text-2xl font-bold text-[#595a5d]`}>
                                View Users
                            </h1>
                            <p className={`font-inter mt-1 text-xs text-slate-400`}>
                                Review user accounts, assigned roles, and account status
                            </p>
                        </div>

                        <button
                            type='button'
                            onClick={handleAddUser}
                            className={`font-lexend h-10 rounded bg-[#0F172A] px-5 text-xs font-medium text-[#8A9098] transition-colors hover:bg-slate-800 cursor-pointer`}
                        >
                            Add New User
                        </button>
                    </div>
                </header>

                <section className='rounded-lg border border-gray-200 bg-white p-6 shadow-sm'>
                    
                    {/* --- 5. Added the Search Bar UI --- */}
                    <div className='mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
                        <div className='flex items-center gap-3'>
                            <div className='rounded-md bg-slate-100 p-2'>
                                <UsersRound className='h-5 w-5 text-[#00154A]' />
                            </div>
                            <h2 className={`font-inter text-sm font-semibold text-[#848794]`}>
                                User Directory
                            </h2>
                        </div>
                        
                        <div className="flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 w-full sm:max-w-xs focus-within:ring-2 focus-within:ring-slate-200 transition-shadow">
                            <Search className="h-4 w-4 text-slate-400" />
                            <input
                                value={globalFilter ?? ''}
                                onChange={e => setGlobalFilter(e.target.value)}
                                placeholder="Search users by name, role..."
                                className="w-full bg-transparent text-sm font-inter outline-none placeholder:text-slate-400 text-slate-700"
                            />
                        </div>
                    </div>

                    {loadError && (
                        <div className='mb-4 rounded border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700'>
                            {loadError}
                        </div>
                    )}

                    <div className='overflow-x-auto mb-4'>
                        <table className='w-full min-w-155 border-collapse'>
                            <thead>
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <tr key={headerGroup.id} className='border-b border-gray-200'>
                                        {headerGroup.headers.map((header) => (
                                            <th key={header.id} className={`font-inter px-3 py-3 text-left text-xs font-semibold text-slate-500`}>
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(
                                                          header.column.columnDef.header,
                                                          header.getContext()
                                                      )}
                                            </th>
                                        ))}
                                    </tr>
                                ))}
                            </thead>
                            <tbody>
                                {isLoading && (
                                    <tr>
                                        <td className='font-inter px-3 py-8 text-center text-sm text-slate-500' colSpan={4}>
                                            Loading users...
                                        </td>
                                    </tr>
                                )}

                                {!isLoading && users.length === 0 && (
                                    <tr>
                                        <td className='font-inter px-3 py-8 text-center text-sm text-slate-500' colSpan={4}>
                                            No users found.
                                        </td>
                                    </tr>
                                )}

                                {!isLoading && table.getRowModel().rows.length === 0 && users.length > 0 && (
                                    <tr>
                                        <td className='font-inter px-3 py-8 text-center text-sm text-slate-500' colSpan={4}>
                                            No users match your search.
                                        </td>
                                    </tr>
                                )}

                                {!isLoading && table.getRowModel().rows.map((row) => (
                                    <tr key={row.id} className='border-b border-gray-100 transition-colors hover:bg-slate-50'>
                                        {row.getVisibleCells().map((cell) => (
                                            <td key={cell.id} className={`font-inter px-3 py-3 text-sm ${cell.column.id === 'name' ? 'text-slate-700' : 'text-slate-600'}`}>
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* PAGINATION CONTROLS */}
                    {!isLoading && users.length > 0 && (
                        <div className="flex items-center justify-between px-2 mt-4">
                            <div className="font-inter text-xs text-slate-500">
                                Showing Page <span className="font-medium text-slate-900">{table.getPageCount() === 0 ? 0 : table.getState().pagination.pageIndex + 1}</span> of{" "}
                                <span className="font-medium text-slate-900">{table.getPageCount()}</span>
                            </div>
                            
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => table.previousPage()}
                                    disabled={!table.getCanPreviousPage()}
                                    className="inline-flex h-8 items-center justify-center rounded-md border border-gray-200 bg-white px-3 text-xs font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <ChevronLeft className="mr-1 h-3 w-3" />
                                    Previous
                                </button>
                                <button
                                    onClick={() => table.nextPage()}
                                    disabled={!table.getCanNextPage()}
                                    className="inline-flex h-8 items-center justify-center rounded-md border border-gray-200 bg-white px-3 text-xs font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    Next
                                    <ChevronRight className="ml-1 h-3 w-3" />
                                </button>
                            </div>
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}