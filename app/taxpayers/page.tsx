import RegistryCard from '@/components/RegistryCard';

import {
	House,
	TriangleAlert,
	UserPlus,
	UsersRound,
	Wallet,
	FileText,
} from 'lucide-react';

export default function TaxPayersPage() {
	return (
		<div className='flex'>
			<main className='flex-1'>
				<header className='mb-10'>
					<h1 className={`font-lexend text-2xl font-bold text-[#595a5d]`}>
						Taxpayer Records
					</h1>
					<p className={`font-inter mt-1 text-xs text-slate-400`}>
						Unified Taxpayer Profiles - Assessor & Treasurer Module
					</p>
				</header>

				<div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
					<RegistryCard
						icon={UsersRound}
						title='Taxpayer Master List'
						description='View and manage all registered taxpayers'
						buttonText='Open Taxpayer List'
					/>
					<RegistryCard
						icon={UserPlus}
						title='Register New Taxpayer'
						description='Create a new taxpayer profile'
						buttonText='Add Taxpayer'
					/>
					<RegistryCard
						icon={House}
						title='Linked Properties'
						description='View all properties owned by a taxpayer'
						buttonText='View Properties'
					/>
					<RegistryCard
						icon={Wallet}
						title='Payment History'
						description='Track payments and official receipts'
						buttonText='View Payments'
						variant='secondary'
					/>
					<RegistryCard
						icon={TriangleAlert}
						title='Delinquent Accounts'
						description='Taxpayers with unpaid or overdue RPT'
						buttonText='View Delinquencies'
						variant='secondary'
					/>
					<RegistryCard
						icon={FileText}
						title='Certifications & Records'
						description='Issue certifications and official records'
						buttonText='Generate Certificate'
						variant='secondary'
					/>
				</div>
			</main>
		</div>
	);
}
