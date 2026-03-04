'use client';

import Swal from 'sweetalert2';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
	ArrowLeft,
	KeyRound,
	Plus,
} from 'lucide-react';

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
					'bg-[#0F172A] text-white text-xs font-inter px-4 py-2 rounded-md hover:bg-slate-800 transition',
				cancelButton:
					'border border-gray-200 text-slate-600 text-xs font-inter px-4 py-2 rounded-md hover:bg-gray-50 transition mr-2',
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
				await Swal.fire({
					html: `
						<div class="text-left">
							<h2 class="font-lexend text-lg font-semibold text-[#0F172A] mb-2">Unable to Add Permission</h2>
							<p class="font-inter text-sm text-slate-500">${data.error ?? 'Failed to create permission.'}</p>
						</div>
					`,
					showConfirmButton: true,
					confirmButtonText: 'OK',
					buttonsStyling: false,
					background: '#ffffff',
					customClass: {
						popup: 'rounded-xl p-6 shadow-lg',
						confirmButton:
							'bg-[#0F172A] text-white text-xs font-inter px-4 py-2 rounded-md hover:bg-slate-800 transition',
					},
				});
				return;
			}

			await fetchPermissions();

			await Swal.fire({
				html: `
					<div class="text-left">
						<h2 class="font-lexend text-lg font-semibold text-[#0F172A] mb-2">Permission Added</h2>
						<p class="font-inter text-sm text-slate-500">${data.message ?? 'Permission added successfully.'}</p>
					</div>
				`,
				showConfirmButton: true,
				confirmButtonText: 'OK',
				buttonsStyling: false,
				background: '#ffffff',
				customClass: {
					popup: 'rounded-xl p-6 shadow-lg',
					confirmButton:
						'bg-[#0F172A] text-white text-xs font-inter px-4 py-2 rounded-md hover:bg-slate-800 transition',
				},
			});
		} catch {
			await Swal.fire({
				html: `
					<div class="text-left">
						<h2 class="font-lexend text-lg font-semibold text-[#0F172A] mb-2">Unable to Connect</h2>
						<p class="font-inter text-sm text-slate-500">Please try again.</p>
					</div>
				`,
				showConfirmButton: true,
				confirmButtonText: 'OK',
				buttonsStyling: false,
				background: '#ffffff',
				customClass: {
					popup: 'rounded-xl p-6 shadow-lg',
					confirmButton:
						'bg-[#0F172A] text-white text-xs font-inter px-4 py-2 rounded-md hover:bg-slate-800 transition',
				},
			});
		} finally {
			setIsAdding(false);
		}
	};

	useEffect(() => {
		fetchPermissions();
	}, []);

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
					<div className='mb-5 flex items-center gap-3'>
						<div className='rounded-md bg-slate-100 p-2'>
							<KeyRound className='h-5 w-5 text-[#00154A]' />
						</div>
						<h2 className='font-inter text-sm font-semibold text-[#848794]'>
							Role Permission Matrix
						</h2>
					</div>

					{loadError && (
						<div className='mb-4 rounded border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700'>
							{loadError}
						</div>
					)}

					<div className='space-y-4'>
						{isLoading && (
							<div className='rounded-md border border-gray-200 p-4'>
								<p className='font-inter text-sm text-slate-500'>Loading permissions...</p>
							</div>
						)}

						{!isLoading && permissions.length === 0 && (
							<div className='rounded-md border border-gray-200 p-4'>
								<p className='font-inter text-sm text-slate-500'>No permissions found.</p>
							</div>
						)}

						{!isLoading && permissions.length > 0 && (
							<div className='grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3'>
								{permissions.map((permission) => (
									<div
										key={permission.id}
										className='rounded-md border border-gray-200 px-3 py-3'
									>
										<p className='font-inter text-xs text-slate-400'>Permission #{permission.id}</p>
										<p className='font-inter mt-1 text-sm font-medium text-slate-700'>
											{permission.name}
										</p>
										<p className='font-inter mt-1 text-xs text-slate-400'>
											Created:{' '}
											{permission.created_at
												? new Date(permission.created_at).toLocaleDateString()
												: '-'}
										</p>
									</div>
								))}
							</div>
						)}
					</div>
				</section>
			</main>
		</div>
	);
}
