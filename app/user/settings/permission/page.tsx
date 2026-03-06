'use client';

import Swal from 'sweetalert2';
// --- CHANGED 1: Imported useMemo to hold our table columns efficiently
import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
    ArrowLeft,
    KeyRound,
    Pencil,
    Plus,
    Trash2,
    // --- CHANGED 2: Imported the icons needed for Search and Pagination UI
    Search,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';

import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel, 
  flexRender,
} from "@tanstack/react-table";

type Permission = {
    id: number;
    name: string;
    created_at?: string;
};

export default function PermissionSettingsPage() {
    const router = useRouter();
    const [permissions, setPermissions] = useState<Permission[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState<string | null>(null);
    const [isAdding, setIsAdding] = useState(false);
    const [editingPermissionId, setEditingPermissionId] = useState<number | null>(null);
    const [deletingPermissionId, setDeletingPermissionId] = useState<number | null>(null);

    // --- CHANGED 3: Added state to track our Search bar text
    const [globalFilter, setGlobalFilter] = useState('');

    const fetchPermissions = async () => {
        setIsLoading(true);
        setLoadError(null);

        try {
            const response = await fetch('/api/permissions/list', { cache: 'no-store' });
            const data = (await response.json()) as {
                error?: string;
                permissions?: Permission[];
            };

            if (!response.ok) {
                setLoadError(data.error ?? 'Failed to load permissions.');
                setPermissions([]);
                return;
            }

            setPermissions(data.permissions ?? []);
        } catch {
            setLoadError('Unable to connect to server.');
            setPermissions([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddPermission = async () => {
        const result = await Swal.fire({
            html: `
                <div class="text-left">
                    <h2 class="font-lexend text-lg font-semibold text-[#0F172A] mb-2">Add Permission</h2>
                    <p class="font-inter text-sm text-slate-500 mb-4">Create a new permission entry.</p>
                    <label class="font-inter block text-xs font-medium text-slate-600 mb-1">Permission Name</label>
                    <input
                        id="permission-name-input"
                        class="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-slate-200"
                        placeholder="Enter permission name"
                    />
                </div>
            `,
            showCancelButton: true,
            confirmButtonText: 'Add Permission',
            cancelButtonText: 'Cancel',
            reverseButtons: true,
            buttonsStyling: false,
            background: '#ffffff',
            customClass: {
                popup: 'rounded-xl p-6 shadow-lg',
                confirmButton:
                    'cursor-pointer bg-[#0F172A] text-white text-xs font-inter px-4 py-2 rounded-md hover:bg-slate-800 transition',
                cancelButton:
                    'cursor-pointer border border-gray-200 text-slate-600 text-xs font-inter px-4 py-2 rounded-md hover:bg-gray-50 transition mr-2',
            },
            preConfirm: () => {
                const input = document.getElementById('permission-name-input') as HTMLInputElement | null;
                const permissionName = input?.value?.trim() ?? '';

                if (!permissionName) {
                    Swal.showValidationMessage('Permission name is required.');
                    return null;
                }

                return permissionName;
            },
        });

        if (!result.isConfirmed || !result.value) return;

        setIsAdding(true);

        try {
            const response = await fetch('/api/permissions/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: result.value }),
            });

            const data = (await response.json()) as { error?: string; message?: string };

            if (!response.ok) {
                toast.error('Unable to Add Permission', {
                    description: data.error ?? 'Failed to create permission.',
                });
                return;
            }

            await fetchPermissions();
            toast.success('Permission Added', {
                description: data.message ?? 'Permission added successfully.',
            });
        } catch {
            toast.error('Unable to Connect', {
                description: 'Please try again.',
            });
        } finally {
            setIsAdding(false);
        }
    };

    const handleEditPermission = async (permission: Permission) => {
        const result = await Swal.fire({
            html: `
                <div class="text-left">
                    <h2 class="font-lexend text-lg font-semibold text-[#0F172A] mb-2">Edit Permission</h2>
                    <p class="font-inter text-sm text-slate-500 mb-4">Update the permission name.</p>
                    <label class="font-inter block text-xs font-medium text-slate-600 mb-1">Permission Name</label>
                    <input
                        id="edit-permission-name-input"
                        class="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-slate-200"
                        placeholder="Enter permission name"
                        value="${permission.name.replace(/"/g, '&quot;')}"
                    />
                </div>
            `,
            showCancelButton: true,
            confirmButtonText: 'Save Changes',
            cancelButtonText: 'Cancel',
            reverseButtons: true,
            buttonsStyling: false,
            background: '#ffffff',
            customClass: {
                popup: 'rounded-xl p-6 shadow-lg',
                confirmButton:
                    'cursor-pointer bg-[#0F172A] text-white text-xs font-inter px-4 py-2 rounded-md hover:bg-slate-800 transition',
                cancelButton:
                    'cursor-pointer border border-gray-200 text-slate-600 text-xs font-inter px-4 py-2 rounded-md hover:bg-gray-50 transition mr-2',
            },
            preConfirm: () => {
                const input = document.getElementById('edit-permission-name-input') as HTMLInputElement | null;
                const permissionName = input?.value?.trim() ?? '';

                if (!permissionName) {
                    Swal.showValidationMessage('Permission name is required.');
                    return null;
                }

                return permissionName;
            },
        });

        if (!result.isConfirmed || !result.value) return;

        setEditingPermissionId(permission.id);

        try {
            const response = await fetch('/api/permissions/update', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: permission.id, name: result.value }),
            });

            const data = (await response.json()) as { error?: string; message?: string };

            if (!response.ok) {
                toast.error('Unable to Update Permission', {
                    description: data.error ?? 'Failed to update permission.',
                });
                return;
            }

            await fetchPermissions();
            toast.success('Permission Updated', {
                description: data.message ?? 'Permission updated successfully.',
            });
        } catch {
            toast.error('Unable to Connect', {
                description: 'Please try again.',
            });
        } finally {
            setEditingPermissionId(null);
        }
    };

    const handleDeletePermission = async (permission: Permission) => {
        const result = await Swal.fire({
            html: `
                <div class="text-left">
                    <h2 class="font-lexend text-lg font-semibold text-[#0F172A] mb-2">Delete Permission?</h2>
                    <p class="font-inter text-sm text-slate-500">You are about to remove <span class="font-semibold text-[#0F172A]">${permission.name}</span>.</p>
                    <p class="font-inter mt-2 text-xs text-rose-500">This action cannot be undone.</p>
                </div>
            `,
            showCancelButton: true,
            confirmButtonText: 'Delete Permission',
            cancelButtonText: 'Cancel',
            reverseButtons: true,
            buttonsStyling: false,
            background: '#ffffff',
            customClass: {
                popup: 'rounded-xl p-6 shadow-lg',
                confirmButton:
                    'cursor-pointer bg-[#0F172A] text-white text-xs font-inter px-4 py-2 rounded-md hover:bg-slate-800 transition',
                cancelButton:
                    'cursor-pointer border border-gray-200 text-slate-600 text-xs font-inter px-4 py-2 rounded-md hover:bg-gray-50 transition mr-2',
            },
        });

        if (!result.isConfirmed) return;

        setDeletingPermissionId(permission.id);

        try {
            const response = await fetch('/api/permissions/delete', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: permission.id }),
            });

            const data = (await response.json()) as { error?: string; message?: string };

            if (!response.ok) {
                toast.error('Unable to Delete Permission', {
                    description: data.error ?? 'Failed to delete permission.',
                });
                return;
            }

            await fetchPermissions();
            toast.success('Permission Deleted', {
                description: data.message ?? 'Permission deleted successfully.',
            });
        } catch {
            toast.error('Unable to Connect', {
                description: 'Please try again.',
            });
        } finally {
            setDeletingPermissionId(null);
        }
    };

    useEffect(() => {
        fetchPermissions();
    }, []);

    // --- CHANGED 4: Built the TanStack Columns definition. 
    // We put it in useMemo so it doesn't get recreated on every keystroke in the search bar.
    // Notice we included editingPermissionId and deletingPermissionId in the dependency array at the end, 
    // so the buttons know to disable when loading!
    const columns = useMemo(() => [
        {
            accessorKey: 'id',
            header: 'ID',
            cell: ({ row }: any) => ` #${row.original.id}`
        },
        {
            accessorKey: 'name',
            header: 'Permission',
            cell: ({ row }: any) => (
                <div className='inline-flex items-center gap-2'>
                    <KeyRound className='h-4 w-4 text-slate-400' />
                    {row.original.name}
                </div>
            )
        },
        {
            accessorKey: 'created_at',
            header: 'Created',
            cell: ({ row }: any) => {
                const dateString = row.original.created_at;
                return dateString ? new Date(dateString).toLocaleDateString() : '-';
            }
        },
        {
            id: 'actions',
            header: () => <div className="text-right">Actions</div>,
            cell: ({ row }: any) => {
                const permission = row.original;
                return (
                    <div className='flex justify-end gap-2'>
                        <button
                            type='button'
                            onClick={() => handleEditPermission(permission)}
                            disabled={editingPermissionId === permission.id || deletingPermissionId === permission.id}
                            className='font-inter inline-flex cursor-pointer items-center gap-2 rounded border border-gray-200 px-3 py-1.5 text-xs text-slate-600 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60'
                        >
                            <Pencil className='h-3.5 w-3.5' />
                            {editingPermissionId === permission.id ? 'Saving...' : 'Edit'}
                        </button>

                        <button
                            type='button'
                            onClick={() => handleDeletePermission(permission)}
                            disabled={deletingPermissionId === permission.id || editingPermissionId === permission.id}
                            className='font-inter inline-flex cursor-pointer items-center gap-2 rounded border border-gray-200 px-3 py-1.5 text-xs text-rose-600 transition-colors hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60'
                        >
                            <Trash2 className='h-3.5 w-3.5' />
                            {deletingPermissionId === permission.id ? 'Deleting...' : 'Delete'}
                        </button>
                    </div>
                );
            }
        }
    ], [editingPermissionId, deletingPermissionId]);

    // --- CHANGED 5: Initialize the TanStack table hook.
    // This connects our data, columns, pagination math, and search text together.
    const table = useReactTable({
        data: permissions,
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
                        onClick={() => router.push('/user')}
                        className='font-lexend mb-5 inline-flex cursor-pointer items-center gap-2 text-sm text-slate-500 transition-colors hover:text-slate-700'
                    >
                        <ArrowLeft className='h-4 w-4' />
                        Back to User Management
                    </button>

                    <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
                        <div>
                            <h1 className='font-lexend text-2xl font-bold text-[#595a5d]'>
                                Permission Settings
                            </h1>
                            <p className='font-inter mt-1 text-xs text-slate-400'>
                                Configure feature-level access per role across system modules.
                            </p>
                        </div>

                        <button
                            type='button'
                            onClick={handleAddPermission}
                            disabled={isAdding}
                            className='font-inter inline-flex h-10 cursor-pointer items-center gap-2 rounded bg-[#0F172A] px-5 text-xs font-medium text-[#8A9098] transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60'
                        >
                            <Plus className='h-4 w-4' />
                            {isAdding ? 'Adding...' : 'Add Permission'}
                        </button>
                    </div>
                </header>

                <section className='rounded-lg border border-gray-200 bg-white p-6 shadow-sm'>
                    
                    {/* --- CHANGED 6: Added the Search Bar beside the table title */}
                    <div className='mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
                        <div className='flex items-center gap-3'>
                            <div className='rounded-md bg-slate-100 p-2'>
                                <KeyRound className='h-5 w-5 text-[#00154A]' />
                            </div>
                            <h2 className='font-inter text-sm font-semibold text-[#848794]'>
                                Role Permission Matrix
                            </h2>
                        </div>
                        
                        <div className="flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 w-full sm:max-w-xs focus-within:ring-2 focus-within:ring-slate-200 transition-shadow">
                            <Search className="h-4 w-4 text-slate-400" />
                            <input
                                value={globalFilter ?? ''}
                                onChange={e => setGlobalFilter(e.target.value)}
                                placeholder="Search permissions..."
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
                            {/* --- CHANGED 7: Dynamically mapped headers using TanStack --- */}
                            <thead>
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <tr key={headerGroup.id} className='border-b border-gray-200'>
                                        {headerGroup.headers.map((header) => (
                                            <th key={header.id} className='font-inter px-3 py-3 text-left text-xs font-semibold text-slate-500'>
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
                                            Loading permissions...
                                        </td>
                                    </tr>
                                )}

                                {!isLoading && permissions.length === 0 && (
                                    <tr>
                                        <td className='font-inter px-3 py-8 text-center text-sm text-slate-500' colSpan={4}>
                                            No permissions found.
                                        </td>
                                    </tr>
                                )}

                                {/* Message if search filter returns 0 results */}
                                {!isLoading && table.getRowModel().rows.length === 0 && permissions.length > 0 && (
                                    <tr>
                                        <td className='font-inter px-3 py-8 text-center text-sm text-slate-500' colSpan={4}>
                                            No permissions match your search.
                                        </td>
                                    </tr>
                                )}

                                {/* --- CHANGED 8: Render the rows using table.getRowModel() instead of mapping `permissions` directly --- */}
                                {!isLoading && table.getRowModel().rows.map((row) => (
                                    <tr key={row.id} className='border-b border-gray-100 transition-colors hover:bg-slate-50'>
                                        {row.getVisibleCells().map((cell) => (
                                            <td key={cell.id} className={`font-inter px-3 py-3 text-sm ${cell.column.id === 'id' ? 'font-medium' : ''} ${cell.column.id === 'name' ? 'text-slate-700' : 'text-slate-600'}`}>
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* --- CHANGED 9: Placed the generic Pagination UI below the table --- */}
                    {!isLoading && permissions.length > 0 && (
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