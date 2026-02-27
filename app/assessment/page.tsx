import RegistryCard from '@/components/RegistryCard';

import {
	Calculator,
	FileText,
	Receipt,
	Percent,
	CalendarDays,
	ClipboardList,
} from 'lucide-react';
import { Lexend, Inter } from 'next/font/google';

const lexend = Lexend({ subsets: ['latin'], weight: ['700'] });
const inter = Inter({ subsets: ['latin'], weight: ['400', '600'] });

export default function AssessmentBillingPage() {
	return (
		<div className='flex'>
			<main className='flex-1'>
				<header className='mb-10'>
					<h1 className={`${lexend.className} text-2xl font-bold text-[#595a5d]`}>
						Assessment & Billing
					</h1>
					<p className={`${inter.className} mt-1 text-xs text-slate-400`}>
						Treasurer Module - RPT Computation and Billing Management
					</p>
				</header>

				<div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
					<RegistryCard
						icon={Calculator}
						title='RPT Assessment'
						description='Compute real property tax based on assessed values'
						buttonText='Compute Tax'
					/>
					<RegistryCard
						icon={FileText}
						title='Billing Generation'
						description='Generate billing statements and assessment notices'
						buttonText='Generate Bill'
					/>
					<RegistryCard
						icon={Receipt}
						title='Official Receipt Monitoring'
						description='Manage issued ORs and billing references'
						buttonText='View OR'
					/>
					<RegistryCard
						icon={Percent}
						title='Discounts & Penalties'
						description='Apply early payment discounts and late penalties'
						buttonText='Configure'
						variant='secondary'
					/>
					<RegistryCard
						icon={CalendarDays}
						title='Billing Schedules'
						description='Manage annual and quarterly billing cycles'
						buttonText='View Schedules'
						variant='secondary'
					/>
					<RegistryCard
						icon={ClipboardList}
						title='Billing & Assessment Reports'
						description='Generate billing summaries and collection reports'
						buttonText='Generate Reports'
						variant='secondary'
					/>
				</div>
			</main>
		</div>
	);
}
