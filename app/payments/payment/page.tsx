'use client';

import { useRouter } from 'next/navigation';
import Link from "next/link";
import { 
    ArrowLeft, 
    Save, 
    UserRound, 
    Banknote 
} from 'lucide-react';

export default function RecordPaymentPage() {
    const router = useRouter();

    return (
        <div className='flex'>
            <main className='flex-1'>
                
                {/* Header Section */}
                <header className='mb-8'>
                    <button
                        type='button'
                        onClick={() => router.back()}
                        className='font-lexend mb-5 inline-flex cursor-pointer items-center gap-2 text-sm text-slate-500 transition-colors hover:text-slate-700'
                    >
                        <ArrowLeft className='h-4 w-4' />
                        Back to Payments Monitoring
                    </button>

                    <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
                        <div>
                            <h1 className='font-lexend text-2xl font-bold text-[#595a5d]'>
                                Record New Payment
                            </h1>
                            <p className='font-inter mt-1 text-xs text-slate-400'>
                                Post Real Property Tax (RPT) payments and generate Official Receipts.
                            </p>
                        </div>

                        <div className='flex items-center gap-2'>
                            <Link
                                href="/payments"
                                className="font-inter inline-flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 hover:bg-gray-50"
                                >
                                Cancel
                            </Link>

                            <button
                                type='button'
                                className='font-inter inline-flex h-10 cursor-pointer items-center gap-2 rounded bg-[#0F172A] px-5 text-xs font-medium text-[#8A9098] transition-colors hover:bg-slate-800'
                            >
                                <Save className='h-4 w-4' />
                                Save Payment
                            </button>
                        </div>
                    </div>
                </header>

                <div className='space-y-6'>
                    
                    {/* Section 1: Taxpayer & Property Details */}
                    <section className='rounded-lg border border-gray-200 bg-white p-6 shadow-sm'>
                        <div className='mb-5 flex items-center gap-3'>
                            <div className='rounded-md bg-slate-100 p-2'>
                                <UserRound className='h-5 w-5 text-[#00154A]' />
                            </div>
                            <h2 className='font-inter text-sm font-semibold text-[#848794]'>
                                Taxpayer Details
                            </h2>
                        </div>

                        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                            <div>
                                <label className='font-inter text-xs font-medium text-slate-600'>
                                    Tax Declaration No. (TDN) <span className='text-rose-500'>*</span>
                                </label>
                                <input 
                                    type='text' 
                                    placeholder='e.g. 12-3456-789' 
                                    className='font-inter mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-200 placeholder:text-slate-400 text-slate-900' 
                                />
                            </div>
                            <div>
                                <label className='font-inter text-xs font-medium text-slate-600'>
                                    Taxpayer Name <span className='text-rose-500'>*</span>
                                </label>
                                <input 
                                    type='text' 
                                    placeholder='Juan Dela Cruz' 
                                    className='font-inter mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-200 placeholder:text-slate-400 text-slate-900' 
                                />
                            </div>
                        </div>
                    </section>

                    {/* Section 2: Payment Details */}
                    <section className='rounded-lg border border-gray-200 bg-white p-6 shadow-sm'>
                        <div className='mb-5 flex items-center gap-3'>
                            <div className='rounded-md bg-slate-100 p-2'>
                                <Banknote className='h-5 w-5 text-[#00154A]' />
                            </div>
                            <h2 className='font-inter text-sm font-semibold text-[#848794]'>
                                Payment Information
                            </h2>
                        </div>

                        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                            <div>
                                <label className='font-inter text-xs font-medium text-slate-600'>
                                    Amount Paid (₱) <span className='text-rose-500'>*</span>
                                </label>
                                <input 
                                    type='number' 
                                    placeholder='0.00' 
                                    className='font-inter mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-200 placeholder:text-slate-400 text-slate-900' 
                                />
                            </div>
                            <div>
                                <label className='font-inter text-xs font-medium text-slate-600'>
                                    Payment Channel <span className='text-rose-500'>*</span>
                                </label>
                                <select className='font-inter mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-200 bg-white text-slate-900'>
                                    <option value='cash'>Cash</option>
                                    <option value='check'>Manager&apos;s Check</option>
                                    <option value='online'>Online Transfer (Landbank)</option>
                                </select>
                            </div>
                            <div>
                                <label className='font-inter text-xs font-medium text-slate-600'>
                                    Official Receipt (O.R.) Number <span className='text-rose-500'>*</span>
                                </label>
                                <input 
                                    type='text' 
                                    placeholder='e.g. 9876543' 
                                    className='font-inter mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-200 placeholder:text-slate-400 text-slate-900' 
                                />
                            </div>
                            <div>
                                <label className='font-inter text-xs font-medium text-slate-600'>
                                    Payment Date <span className='text-rose-500'>*</span>
                                </label>
                                <input 
                                    type='date' 
                                    className='font-inter mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-200 text-slate-900' 
                                />
                            </div>
                        </div>
                    </section>

                </div>
            </main>
        </div>
    );
}