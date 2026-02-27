import {
	House,
	TriangleAlert,
	UserRoundPlus,
	UsersRound,
	WalletCards,
	FileBadge,
} from 'lucide-react';
import { Lexend, Inter } from 'next/font/google';

const lexend = Lexend({ subsets: ['latin'], weight: ['700'] });
const inter = Inter({ subsets: ['latin'], weight: ['400', '600'] });

type TaxpayerCardItem = {
	title: string;
	description: string;
	buttonLabel: string;
	Icon: React.ComponentType<{ className?: string }>;
	variant?: 'primary' | 'secondary';
};

const taxpayerCards: TaxpayerCardItem[] = [
	{
		title: 'Taxpayer Master List',
		description: 'View and manage all registered taxpayers',
		buttonLabel: 'Open Taxpayer List',
		Icon: UsersRound,
		variant: 'primary',
	},
	{
		title: 'Register New Taxpayer',
		description: 'Create a new taxpayer profile',
		buttonLabel: 'Add Taxpayer',
		Icon: UserRoundPlus,
		variant: 'primary',
	},
	{
		title: 'Linked Properties',
		description: 'View all properties owned by a taxpayer',
		buttonLabel: 'View Properties',
		Icon: House,
		variant: 'primary',
	},
	{
		title: 'Payment History',
		description: 'Track payments and official receipts',
		buttonLabel: 'View Payments',
		Icon: WalletCards,
		variant: 'secondary',
	},
	{
		title: 'Delinquent Accounts',
		description: 'Taxpayers with unpaid or overdue RPT',
		buttonLabel: 'View Delinquencies',
		Icon: TriangleAlert,
		variant: 'secondary',
	},
	{
		title: 'Certifications & Records',
		description: 'Issue certifications and official records',
		buttonLabel: 'Generate Certificate',
		Icon: FileBadge,
		variant: 'secondary',
	},
];

export default function TaxPayersCard() {
	return (
		<>
			<header className='mb-10'>
				<h1 className={`${lexend.className} text-2xl font-bold text-[#595a5d]`}>
					Taxpayer Records
				</h1>
				<p className={`${inter.className} mt-1 text-xs text-slate-400`}>
					Unified Taxpayer Profiles - Assessor & Treasurer Module
				</p>
			</header>

			<div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
				{taxpayerCards.map(({ title, description, buttonLabel, Icon, variant = 'secondary' }) => (
					<article
						key={title}
						className='flex min-h-48 flex-col border border-gray-200 bg-white p-6 shadow-sm'
					>
						<Icon className='h-6 w-6 text-[#00154A]' />

						<h2 className={`${inter.className} mt-5 text-[22px] font-semibold text-[#80838f]`}>
							{title}
						</h2>
						<p className={`${inter.className} mt-3 text-sm text-[#c2c7d0]`}>
							{description}
						</p>

						<button
							type='button'
							className={`${inter.className} mt-auto h-10 w-full border text-xs font-medium transition-colors ${
								variant === 'primary'
									? 'border-[#0f1729] bg-[#0f1729] text-[#949ba3] hover:bg-slate-900'
									: 'border-[#E5E7EB] bg-white text-[#B7BCC6] hover:bg-gray-50'
							}`}
						>
							{buttonLabel}
						</button>
					</article>
				))}
			</div>
		</>
	);
}
