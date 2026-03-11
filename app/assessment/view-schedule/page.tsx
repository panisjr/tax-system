import Link from 'next/link';
import {
	ArrowLeft,
	CalendarClock,
	CalendarDays,
	CheckCircle2,
	Clock3,
	FileText,
	Filter,
	Plus,
	Printer,
} from 'lucide-react';

const scheduleRows = [
	{
		period: 'Q1 2026',
		releaseDate: 'January 05, 2026',
		dueDate: 'March 31, 2026',
		gracePeriod: 'April 10, 2026',
		status: 'Active',
	},
	{
		period: 'Q2 2026',
		releaseDate: 'April 01, 2026',
		dueDate: 'June 30, 2026',
		gracePeriod: 'July 10, 2026',
		status: 'Upcoming',
	},
	{
		period: 'Q3 2026',
		releaseDate: 'July 01, 2026',
		dueDate: 'September 30, 2026',
		gracePeriod: 'October 10, 2026',
		status: 'Upcoming',
	},
	{
		period: 'Q4 2026',
		releaseDate: 'October 01, 2026',
		dueDate: 'December 31, 2026',
		gracePeriod: 'January 10, 2027',
		status: 'Upcoming',
	},
];

export default function ViewSchedulePage() {
	return (
		<div className='w-full'>
			<Link
				href='/assessment'
				className='font-lexend mb-5 inline-flex items-center gap-2 text-sm text-slate-500 transition-colors hover:text-slate-700'
			>
				<ArrowLeft className='h-4 w-4' />
				Back to Assessment & Billing
			</Link>

			<header className='mb-8 rounded-xl border border-slate-200 bg-linear-to-r from-[#f8fbff] via-white to-[#f2f6ff] p-6 shadow-sm'>
				<div className='flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between'>
					<div>
						<h1 className='font-lexend text-2xl font-bold text-[#595a5d]'>Billing Schedules</h1>
						<p className='font-inter mt-1 text-xs text-slate-400'>
							Treasurer Module - Manage annual and quarterly billing cycle deadlines
						</p>
					</div>
					<div className='flex flex-wrap items-center gap-2'>
						<button
							type='button'
							className='cursor-pointer font-inter inline-flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 hover:bg-gray-50'
						>
							<Printer className='h-4 w-4' />
							Print Schedule
						</button>
						<button
							type='button'
							className='cursor-pointer font-inter inline-flex items-center gap-2 rounded bg-[#0F172A] px-4 py-2 text-xs font-medium text-[#8A9098] transition-colors hover:bg-slate-800'
						>
							<Plus className='h-4 w-4' />
							Add New Cycle
						</button>
					</div>
				</div>
			</header>

			<div className='mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
				<SummaryCard icon={CalendarDays} label='Total Cycles' value='4' subtext='Configured for 2026' />
				<SummaryCard icon={CalendarClock} label='Current Cycle' value='Q1 2026' subtext='Billing in progress' />
				<SummaryCard icon={Clock3} label='Next Deadline' value='Mar 31' subtext='Q1 due date' />
				<SummaryCard icon={CheckCircle2} label='Compliance Setup' value='100%' subtext='No missing schedule data' />
			</div>

			<section className='rounded-lg border border-gray-200 bg-white p-5 shadow-sm'>
				<div className='mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
					<h2 className='font-lexend text-sm font-semibold text-[#595a5d]'>Cycle Details</h2>
					<div className='flex items-center gap-2'>
						<button
							type='button'
							className='cursor-pointer font-inter inline-flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 hover:bg-gray-50'
						>
							<Filter className='h-3.5 w-3.5' />
							Filter Year
						</button>
						<button
							type='button'
							className='cursor-pointer font-inter inline-flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 hover:bg-gray-50'
						>
							<FileText className='h-3.5 w-3.5' />
							Export CSV
						</button>
					</div>
				</div>

				<div className='overflow-x-auto'>
					<table className='w-full min-w-180 border-separate border-spacing-0'>
						<thead>
							<tr>
								<th className='font-inter border-b border-slate-200 px-3 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500'>
									Billing Period
								</th>
								<th className='font-inter border-b border-slate-200 px-3 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500'>
									Release Date
								</th>
								<th className='font-inter border-b border-slate-200 px-3 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500'>
									Due Date
								</th>
								<th className='font-inter border-b border-slate-200 px-3 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500'>
									Grace Period Ends
								</th>
								<th className='font-inter border-b border-slate-200 px-3 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500'>
									Status
								</th>
								<th className='font-inter border-b border-slate-200 px-3 py-3 text-right text-[11px] font-semibold uppercase tracking-wide text-slate-500'>
									Action
								</th>
							</tr>
						</thead>
						<tbody>
							{scheduleRows.map((row) => (
								<tr key={row.period}>
									<td className='font-inter border-b border-slate-100 px-3 py-3 text-sm font-semibold text-slate-700'>{row.period}</td>
									<td className='font-inter border-b border-slate-100 px-3 py-3 text-sm text-slate-600'>{row.releaseDate}</td>
									<td className='font-inter border-b border-slate-100 px-3 py-3 text-sm text-slate-600'>{row.dueDate}</td>
									<td className='font-inter border-b border-slate-100 px-3 py-3 text-sm text-slate-600'>{row.gracePeriod}</td>
									<td className='border-b border-slate-100 px-3 py-3'>
										<StatusBadge status={row.status} />
									</td>
									<td className='border-b border-slate-100 px-3 py-3 text-right'>
										<button
											type='button'
											className='cursor-pointer font-inter rounded-md border border-gray-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-gray-50'
										>
											Edit
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</section>
		</div>
	);
}

function SummaryCard({
	icon: Icon,
	label,
	value,
	subtext,
}: {
	icon: React.ElementType;
	label: string;
	value: string;
	subtext: string;
}) {
	return (
		<div className='rounded-lg border border-slate-200 bg-white p-4 shadow-sm'>
			<div className='mb-2 inline-flex rounded-md bg-slate-100 p-2'>
				<Icon className='h-4 w-4 text-[#00154A]' />
			</div>
			<p className='font-inter text-[11px] font-medium text-slate-500'>{label}</p>
			<p className='font-lexend mt-1 text-lg font-semibold text-slate-800'>{value}</p>
			<p className='font-inter mt-1 text-[11px] text-slate-400'>{subtext}</p>
		</div>
	);
}

function StatusBadge({ status }: { status: 'Active' | 'Upcoming' }) {
	if (status === 'Active') {
		return (
			<span className='font-inter inline-flex rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-semibold text-emerald-700'>
				Active
			</span>
		);
	}

	return (
		<span className='font-inter inline-flex rounded-full bg-amber-50 px-2 py-1 text-[10px] font-semibold text-amber-700'>
			Upcoming
		</span>
	);
}
