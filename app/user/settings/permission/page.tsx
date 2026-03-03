'use client';

import { useRouter } from 'next/navigation';
import {
	ArrowLeft,
	KeyRound,
	Shield,
	UsersRound,
	FolderLock,
	Save,
} from 'lucide-react';

const permissionGroups = [
	{
		title: 'User & Role Management',
		icon: UsersRound,
		permissions: [
			'View user accounts',
			'Create and edit users',
			'Assign and update roles',
		],
	},
	{
		title: 'Assessment & Billing',
		icon: Shield,
		permissions: [
			'View assessments',
			'Create billing records',
			'Approve adjustments',
		],
	},
	{
		title: 'Payments & Collections',
		icon: FolderLock,
		permissions: [
			'View payment entries',
			'Post and validate payments',
			'Export collection reports',
		],
	},
] as const;

export default function PermissionSettingsPage() {
	const router = useRouter();

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
							className='font-inter inline-flex h-10 cursor-pointer items-center gap-2 rounded bg-[#0F172A] px-5 text-xs font-medium text-[#8A9098] transition-colors hover:bg-slate-800'
						>
							<Save className='h-4 w-4' />
							Save Permission Changes
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

					<div className='space-y-6'>
						{permissionGroups.map((group) => {
							const GroupIcon = group.icon;

							return (
								<div key={group.title} className='rounded-md border border-gray-200 p-4'>
									<div className='mb-4 flex items-center gap-2'>
										<GroupIcon className='h-4 w-4 text-slate-600' />
										<h3 className='font-inter text-sm font-semibold text-slate-700'>
											{group.title}
										</h3>
									</div>

									<div className='grid grid-cols-1 gap-3 sm:grid-cols-3'>
										{group.permissions.map((permission) => (
											<label
												key={permission}
												className='font-inter inline-flex items-center gap-2 rounded border border-gray-200 px-3 py-2 text-xs text-slate-600'
											>
												<input type='checkbox' className='cursor-pointer h-4 w-4 rounded border-gray-300' defaultChecked />
												{permission}
											</label>
										))}
									</div>
								</div>
							);
						})}
					</div>
				</section>
			</main>
		</div>
	);
}
