"use client";
import RegistryCard from '@/components/RegistryCard';
import { useRouter } from "next/navigation";

import {
	UsersRound,
	UserRoundPlus,
	Shield,
	KeyRound,
	Activity,
	Settings,
} from 'lucide-react';
import { Lexend, Inter } from 'next/font/google';

const lexend = Lexend({ subsets: ['latin'], weight: ['700'] });
const inter = Inter({ subsets: ['latin'], weight: ['400', '600'] });

export default function UserRoleManagementPage() {

	const router = useRouter();

	return (
		<div className='flex'>
			<main className='flex-1'>
				<header className='mb-10'>
					<h1 className={`${lexend.className} text-2xl font-bold text-[#595a5d]`}>
						User Role & Management
					</h1>
					<p className={`${inter.className} mt-1 text-xs text-slate-400`}>
						System Administrator Module Access Control and Accountability
					</p>
				</header>

				<div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
					<RegistryCard
						icon={UsersRound}
						title='User Accounts'
						description='Manage system users from Assessor, Treasurer, and Admin'
						buttonText='View Users'
					/>
					<RegistryCard
						icon={UserRoundPlus}
						title='Add New User'
						description='Create new user accounts with assigned roles'
						buttonText='Create User'
					/>
					<RegistryCard
						icon={Shield}
						title='Role Management'
						description='Define roles and access permissions per module'
						buttonText='Manage Roles'
					/>
					<RegistryCard
						icon={KeyRound}
						title='Permission Settings'
						description='Fine-grained access control for system features'
						buttonText='Configure Permissions'
						variant='secondary'
					/>
					<RegistryCard
						icon={Activity}
						title='User Activity Logs'
						description='Track logins, actions, and system usage'
						buttonText='View Logs'
						variant='secondary'
					/>
					<RegistryCard
						icon={Settings}
						title='Security Settings'
						description='Password policies, session control, and MFA'
						buttonText='Security Options'
						variant='secondary'
					/>
				</div>
			</main>
		</div>
	);
}
