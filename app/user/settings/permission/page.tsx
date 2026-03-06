'use client';

import Swal from 'sweetalert2';
import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
    ArrowLeft,
    KeyRound,
    Pencil,
    Plus,
    Trash2,
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

import {
  Table,
  TableContainer,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/table";

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
                        value="${permission.name.replace(/"/g, '"')}"
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
        <div className="flex w-full overflow-x-hidden">
            <main className="flex-1 w-full">
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
                            className='font-lexend h-10 rounded bg-[#0F172A] px-5 text-xs font-medium text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer'
                        >
                            <Plus className='mr-2 h-4 w-4 inline' />
                            {isAdding ? 'Adding...' : 'Add Permission'}
                        </button>
                    </div>
                </header>

                <section className='w-full rounded-lg border border-gray-200 bg-white p-6 shadow-sm'>
                    
                    <div className='mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
                        <div className='flex items-center gap-3'>
                            <div className='rounded-md bg-slate-100 p-2'>
                                <KeyRound className='h-5 w-5 text-[#00154A]' />
                            </div>
                            <h2 className='font-lexend text-sm font-semibold text-[#848794]'>
                                Role Permission Matrix
                            </h2>
                        </div>
                        
                        <div className="relative w-full sm:max-w-xs">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <input
                                value={globalFilter ?? ''}
                                onChange={e => setGlobalFilter(e.target.value)}
                                placeholder="Search permissions..."
                                className="w-full rounded-md border border-gray-200 py-2 pl-10 pr-4 text-sm font-inter outline-none focus:ring-2 focus:ring-slate-100"
                            />
                        </div>
                    </div>

                    {loadError && (
                        <div className='mb-4 rounded border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700'>
                            {loadError}
                        </div>
                    )}

                    <TableContainer>
                        <Table className="min-w-155">
                            <TableHeader>
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <TableRow key={headerGroup.id}>
                                        {headerGroup.headers.map((header) => (
                                            <TableHead key={header.id}>
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(
                                                          header.column.columnDef.header,
                                                          header.getContext()
                                                      )}
                                            </TableHead>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableHeader>
                            <TableBody>
                                {isLoading && (
                                    <TableRow>
                                        <TableCell colSpan={4} className="py-10 text-center text-slate-400">
                                            Loading permissions...
                                        </TableCell>
                                    </TableRow>
                                )}

                                {!isLoading && permissions.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={4} className="py-10 text-center text-slate-400">
                                            No permissions found.
                                        </TableCell>
                                    </TableRow>
                                )}

                                {!isLoading && table.getRowModel().rows.length === 0 && permissions.length > 0 && (
                                    <TableRow>
                                        <TableCell colSpan={4} className="py-10 text-center text-slate-400">
                                            No permissions match your search.
                                        </TableCell>
                                    </TableRow>
                                )}

                                {!isLoading && table.getRowModel().rows.map((row) => (
                                    <TableRow key={row.id} className="hover:bg-slate-50 transition-colors">
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell
                                                key={cell.id}
                                                className={
                                                    cell.column.id === 'id' 
                                                        ? 'font-medium' 
                                                        : cell.column.id === 'name' 
                                                            ? 'text-slate-700' 
                                                            : ''
                                                }
                                            >
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {!isLoading && permissions.length > 0 && (
                        <div className="flex items-center justify-between px-2 mt-4">
                            <div className="font-inter text-xs text-slate-500">
                                Page <span className="font-medium text-slate-900">{table.getPageCount() === 0 ? 0 : table.getState().pagination.pageIndex + 1}</span> of{" "}
                                <span className="font-medium text-slate-900">{table.getPageCount()}</span>
                            </div>
                            
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => table.previousPage()}
                                    disabled={!table.getCanPreviousPage()}
                                    className="inline-flex h-8 items-center rounded-md border border-gray-200 bg-white px-3 text-xs font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                                >
                                    <ChevronLeft className="mr-1 h-3 w-3" />
                                    Previous
                                </button>
                                <button
                                    onClick={() => table.nextPage()}
                                    disabled={!table.getCanNextPage()}
                                    className="inline-flex h-8 items-center rounded-md border border-gray-200 bg-white px-3 text-xs font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
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

