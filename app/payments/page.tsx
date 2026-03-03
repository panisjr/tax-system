import RegistryCard from '@/components/RegistryCard';

import {
	WalletCards,
	ReceiptText,
	CreditCard,
	ListChecks,
	CircleAlert,
	FileText,
} from 'lucide-react';

export default function PaymentsMonitoringPage() {
	return (
		<div className='flex'>
			<main className='flex-1'>
				<header className='mb-10'>
					<h1 className={`font-lexend text-2xl font-bold text-[#595a5d]`}>
						Payments & OR Monitoring
					</h1>
					<p className={`font-inter mt-1 text-xs text-slate-400`}>
						Treasurer Module - Real-Time Payment and Official Receipt Tracking
					</p>
				</header>

				<div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
					<RegistryCard
						icon={WalletCards}
						title='Record Payment'
						description='Post RPT payments and update taxpayer balances'
						buttonText='New Payment'
					/>
					<RegistryCard
						icon={ReceiptText}
						title='Official Receipt Issuance'
						description='Issue and manage official receipts'
						buttonText='Issue OR'
					/>
					<RegistryCard
						icon={CreditCard}
						title='Payment Channels'
						description='Manage cash, bank, and online payment methods'
						buttonText='Configure'
					/>
					<RegistryCard
						icon={ListChecks}
						title='OR & Payment Logs'
						description='View chronological payment and OR records'
						buttonText='View Logs'
						variant='secondary'
					/>
					<RegistryCard
						icon={CircleAlert}
						title='Unapplied/Voided OR'
						description='Monitor voided or unapplied receipts'
						buttonText='Review'
						variant='secondary'
					/>
					<RegistryCard
						icon={FileText}
						title='Collection Reports'
						description='Generate daily, monthly, and annual collection reports'
						buttonText='Generate Reports'
						variant='secondary'
					/>
				</div>
			</main>
		</div>
	);
}
