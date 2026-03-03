import RegistryCard from '@/components/RegistryCard';

import {
	Folder,
	FileText,
	Send,
	ListChecks,
	Clock3,
	CircleAlert,
} from 'lucide-react';

export default function DocumentTrackingPage() {
	return (
		<div className='flex'>
			<main className='flex-1'>
				<header className='mb-10'>
					<h1 className={`font-lexend text-2xl font-bold text-[#595a5d]`}>
						Document Tracking
					</h1>
					<p className={`font-inter mt-1 text-xs text-slate-400`}>
						Records Management Module for Routing and Tracking Documents
					</p>
				</header>

				<div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
					<RegistryCard
						icon={Folder}
						title='Incoming Documents'
						description='View and log incoming requests and submitted records'
						buttonText='Open Inbox'
					/>
					<RegistryCard
						icon={FileText}
						title='Document Register'
						description='Create and manage official document registry entries'
						buttonText='Register Document'
					/>
					<RegistryCard
						icon={Send}
						title='Routing & Endorsement'
						description='Forward documents to offices and assign responsible staff'
						buttonText='Route Document'
					/>
					<RegistryCard
						icon={ListChecks}
						title='Status Tracking'
						description='Track document progress from submission to completion'
						buttonText='View Status'
						variant='secondary'
					/>
					<RegistryCard
						icon={Clock3}
						title='Pending Documents'
						description='Monitor overdue and unresolved documents requiring action'
						buttonText='Review Pending'
						variant='secondary'
					/>
					<RegistryCard
						icon={CircleAlert}
						title='Document Alerts'
						description='Generate reminders for deadlines and pending endorsements'
						buttonText='View Alerts'
						variant='secondary'
					/>
				</div>
			</main>
		</div>
	);
}
