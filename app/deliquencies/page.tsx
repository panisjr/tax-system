"use client"

import RegistryCard from '@/components/RegistryCard';
import { useRouter } from 'next/navigation';

import {
	CircleAlert,
	Clock3,
	FileWarning,
	Send,
	BellRing,
	FileText,
} from 'lucide-react';

export default function DeliquenciesNoticesPage() {
	const router = useRouter();
	return (
		<div className='flex'>
			<main className='flex-1'>
				<header className='mb-10'>
					<h1 className={`font-lexend text-2xl font-bold text-[#595a5d]`}>
						Delinquencies & Notices
					</h1>
					<p className={`font-inter mt-1 text-xs text-slate-400`}>
						Enforcement & Compliance Module Monitoring Overdue RPT Accounts
					</p>
				</header>

				<div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
					<RegistryCard
						icon={CircleAlert}
						title='Delinquent Accounts'
						description='List of taxpayers with unpaid RPT obligations'
						buttonText='View Accounts'
						onButtonClick={() => router.push('/deliquencies/deliquent_accounts')}
					/>
					<RegistryCard
						icon={Clock3}
						title='Aging of Delinquencies'
						description='1,2,5+ year delinquency classification'
						buttonText='View Aging'
						onButtonClick={() => router.push('/deliquencies/aging_of_deliquencies')}
					/>
					<RegistryCard
						icon={FileWarning}
						title='Notice Generation'
						description='Auto-generate demand and delinquency notices'
						buttonText='Generate Notices'
						onButtonClick={() => router.push('/deliquencies/notice_generation')}
					/>
					<RegistryCard
						icon={Send}
						title='Notice Distribution'
						description='Track released, served, and acknowledged notices'
						buttonText='Track Distribution'
						variant='secondary'
						onButtonClick={() => router.push('/deliquencies/notice_distribution')}
					/>
					<RegistryCard
						icon={BellRing}
						title='Reminders & Alerts'
						description='Automated reminders for taxpayers and staff'
						buttonText='Configure Alerts'
						variant='secondary'
						onButtonClick={() => router.push('/deliquencies/reminder_alerts')}
					/>
					<RegistryCard
						icon={FileText}
						title='Delinquency Reports'
						description='Generate enforcement and compliance reports'
						buttonText='Generate Reports'
						variant='secondary'
						onButtonClick={() => router.push('/deliquencies/deliquency_reports')}
					/>
				</div>
			</main>
		</div>
	);
}
