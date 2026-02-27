import {
	House,
	TriangleAlert,
	UserRoundPlus,
	UsersRound,
	WalletCards,
	FileBadge,
} from 'lucide-react';

type TaxpayerCardItem = {
	title: string;
	description: string;
	buttonLabel: string;
	Icon: React.ComponentType<{ className?: string }>;
	isPrimary?: boolean;
};

const taxpayerCards: TaxpayerCardItem[] = [
	{
		title: 'Taxpayer Master List',
		description: 'View and manage all registered taxpayers',
		buttonLabel: 'Open Taxpayer List',
		Icon: UsersRound,
		isPrimary: true,
	},
	{
		title: 'Register New Taxpayer',
		description: 'Create a new taxpayer profile',
		buttonLabel: 'Add Taxpayer',
		Icon: UserRoundPlus,
		isPrimary: true,
	},
	{
		title: 'Linked Properties',
		description: 'View all properties owned by a taxpayer',
		buttonLabel: 'View Properties',
		Icon: House,
		isPrimary: true,
	},
	{
		title: 'Payment History',
		description: 'Track payments and official receipts',
		buttonLabel: 'View Payments',
		Icon: WalletCards,
	},
	{
		title: 'Delinquent Accounts',
		description: 'Taxpayers with unpaid or overdue RPT',
		buttonLabel: 'View Delinquencies',
		Icon: TriangleAlert,
	},
	{
		title: 'Certifications & Records',
		description: 'Issue certifications and official records',
		buttonLabel: 'Generate Certificate',
		Icon: FileBadge,
	},
];

export default function TaxPayersCard() {
	return (
		<section className='w-full'>
			<div className='mb-8'>
				<h1 className='text-4xl font-bold text-[#666D7D]'>Taxpayer Records</h1>
				<p className='mt-2 text-lg text-[#A0A5B2]'>
					Unified Taxpayer Profiles - Assessor & Tresurer Module
				</p>
			</div>

			<div className='grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3'>
				{taxpayerCards.map(({ title, description, buttonLabel, Icon, isPrimary }) => (
					<article
						key={title}
						className='flex min-h-48 flex-col border border-gray-200 bg-white p-6 shadow-sm'
					>
						<Icon className='h-6 w-6 text-[#00154A]' />

						<h2 className='mt-5 text-2xl font-semibold text-[#80838f]'>{title}</h2>
						<p className='mt-3 text-sm text-[#c2c7d0]'>{description}</p>

						<button
							type='button'
							className={`mt-auto h-10 w-full border text-sm font-medium transition-colors ${
								isPrimary
									? 'border-[#0f1729] bg-[#0f1729] text-[#949ba3] hover:bg-slate-900'
									: 'border-[#E5E7EB] bg-white text-[#B7BCC6] hover:bg-gray-50'
							}`}
						>
							{buttonLabel}
						</button>
					</article>
				))}
			</div>
		</section>
	);
}
