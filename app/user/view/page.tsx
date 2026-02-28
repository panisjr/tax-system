'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, UsersRound, ShieldCheck, Activity } from 'lucide-react';

const users = [
	{ name: 'Juan Dela Cruz', role: 'Assessor', status: 'Active' },
	{ name: 'Maria Santos', role: 'Treasurer', status: 'Active' },
	{ name: 'Admin User', role: 'Administrator', status: 'Active' },
	{ name: 'Ramon Reyes', role: 'Assessor', status: 'Inactive' },
];

export default function ViewUserPage() {
	const router = useRouter();

	const handleBack = () => {
		router.push('/user');
	};

	const handleAddUser = () => {
		router.push('/user/create');
	};

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
							<h1 className={`font-lexd text-2xl font-bold text-[#595a5d]`}>
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
					<div className='mb-5 flex items-center gap-3'>
						<div className='rounded-md bg-slate-100 p-2'>
							<UsersRound className='h-5 w-5 text-[#00154A]' />
						</div>
						<h2 className={`font-inter text-sm font-semibold text-[#848794]`}>
							User Directory
						</h2>
					</div>

					<div className='overflow-x-auto'>
						<table className='w-full min-w-155 border-collapse'>
							<thead>
								<tr className='border-b border-gray-200'>
									<th className={`font-inter px-3 py-3 text-left text-xs font-semibold text-slate-500`}>
										Name
									</th>
									<th className={`font-inter px-3 py-3 text-left text-xs font-semibold text-slate-500`}>
										Role
									</th>
									<th className={`font-inter px-3 py-3 text-left text-xs font-semibold text-slate-500`}>
										Status
									</th>
									<th className={`font-inter px-3 py-3 text-right text-xs font-semibold text-slate-500`}>
										Actions
									</th>
								</tr>
							</thead>
							<tbody>
								{users.map((user) => (
									<tr key={user.name} className='border-b border-gray-100'>
										<td className={`font-inter px-3 py-3 text-sm text-slate-700`}>
											{user.name}
										</td>
										<td className={`font-inter px-3 py-3 text-sm text-slate-600`}>
											<div className='inline-flex items-center gap-2'>
												<ShieldCheck className='h-4 w-4 text-slate-400' />
												{user.role}
											</div>
										</td>
										<td className={`font-inter px-3 py-3 text-sm`}>
											<span
												className={`rounded px-2 py-1 text-xs ${
													user.status === 'Active'
														? 'bg-emerald-50 text-emerald-600'
														: 'bg-gray-100 text-gray-500'
												}`}
											>
												{user.status}
											</span>
										</td>
										<td className='px-3 py-3'>
											<div className='flex justify-end'>
												<button
													type='button'
													className={`font-inter inline-flex items-center gap-2 rounded border border-gray-200 px-3 py-1.5 text-xs text-slate-600 transition-colors hover:bg-gray-50 cursor-pointer`}
												>
													<Activity className='h-3.5 w-3.5' />
													View Log
												</button>
											</div>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</section>
			</main>
		</div>
	);
}
