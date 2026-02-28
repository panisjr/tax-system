'use client';

import Swal from 'sweetalert2';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, UsersRound, ShieldCheck, Activity, Pencil, Trash2 } from 'lucide-react';

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
	status?: boolean;
	email?: string;
};

export default function ViewUserPage() {
	const router = useRouter();
	const [users, setUsers] = useState<ListedUser[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [loadError, setLoadError] = useState<string | null>(null);

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
						role: user.role || 'Unassigned',
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
  const result = await Swal.fire({
    html: `
      <div class="text-left">
        <h2 class="font-lexend text-lg font-semibold text-[#0F172A] mb-2">
          Delete User
        </h2>
        <p class="font-inter text-sm text-slate-500 mb-4">
          You are about to remove 
          <span class="font-semibold text-[#0F172A]">${name}</span>.
        </p>
        <div class="font-inter text-xs text-rose-500 bg-rose-50 border border-rose-100 rounded-md px-3 py-2">
          This action cannot be undone.
        </div>
      </div>
    `,
    showCancelButton: true,
    confirmButtonText: 'Delete User',
    cancelButtonText: 'Cancel',
    reverseButtons: true,
    focusCancel: true,
    background: '#ffffff',
    buttonsStyling: false,
    customClass: {
      popup: 'rounded-xl p-6 shadow-lg',
      confirmButton:
        'bg-[#0F172A] text-white text-xs font-inter px-4 py-2 rounded-md hover:bg-slate-800 transition',
      cancelButton:
        'border border-gray-200 text-slate-600 text-xs font-inter px-4 py-2 rounded-md hover:bg-gray-50 transition mr-2',
    },
  });

  if (!result.isConfirmed) return;

  // Optional: API delete here

  setUsers((prev) => prev.filter((user) => user.empID !== empID));

  await Swal.fire({
    html: `
      <div class="text-left">
        <h2 class="font-lexend text-lg font-semibold text-[#0F172A] mb-2">
          User Deleted
        </h2>
        <p class="font-inter text-sm text-slate-500">
          ${name} has been successfully removed.
        </p>
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

					{loadError && (
						<div className='mb-4 rounded border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700'>
							{loadError}
						</div>
					)}

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

								{!isLoading && users.map((user) => (
									<tr key={`${user.empID}-${user.email}`} className='border-b border-gray-100'>
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
