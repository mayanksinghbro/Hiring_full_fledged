import { Building2, BarChart3, Users } from 'lucide-react';
import HiringDashboard from '@/components/company/HiringDashboard';
import { db } from '@/lib/db';

export default async function CompanyPortal() {
    // 1. Fetch real stats from the database
    const activePostings = await db.jobPosting.count({ where: { status: 'active' } });
    const resumesAnalyzed = await db.resume.count();
    const candidatesShortlisted = await db.application.count({ where: { status: 'offered' } });

    return (
        <div className="min-h-screen bg-[#F0F2F5] min-w-[1280px] flex flex-col font-sans text-gray-900">
            {/* HEADER */}
            <header className="h-[64px] bg-white border-b border-gray-200 flex items-center justify-between px-10 shrink-0 z-20">
                <div className="flex items-center gap-8">
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-50 p-2 rounded-lg">
                            <span className="material-symbols-outlined text-[#2563EB] text-2xl">grid_view</span>
                        </div>
                        <span className="text-[20px] font-bold tracking-tight text-gray-900">Placify</span>
                    </div>
                    <nav className="flex items-center gap-2 h-[64px]">
                        <a href="/student" className="text-[14px] font-medium text-[#6B7280] px-4 h-full flex items-center hover:text-[#2563EB] border-b-2 border-transparent">Student</a>
                        <a href="/company" className="text-[14px] font-medium text-[#2563EB] px-4 h-full flex items-center border-b-2 border-[#2563EB]">Company</a>
                        <a href="/college" className="text-[14px] font-medium text-[#6B7280] px-4 h-full flex items-center hover:text-[#2563EB] border-b-2 border-transparent">College</a>
                    </nav>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-full border border-green-200">
                        <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                        <span className="text-[13px] font-medium text-green-700">AI Online</span>
                    </div>
                    <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                        <div className="h-10 w-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold text-sm">HR</div>
                    </div>
                </div>
            </header>

            {/* BODY */}
            <div className="flex flex-1 overflow-hidden">
                {/* LEFT SIDEBAR */}
                <aside className="w-[260px] bg-white border-r border-gray-200 flex flex-col shrink-0 overflow-y-auto py-[32px] px-[24px]">
                    <nav className="flex-1 space-y-2">
                        <button className="w-full flex items-center px-4 py-2 text-[14px] font-medium rounded-lg sidebar-item-active">
                            <span className="material-symbols-outlined mr-3 text-[20px]">dashboard</span>Dashboard
                        </button>
                        <button className="w-full flex items-center px-4 py-2 text-[14px] font-medium rounded-lg text-[#6B7280] hover:bg-gray-50">
                            <span className="material-symbols-outlined mr-3 text-[20px]">work</span>Job Postings
                        </button>
                        <button className="w-full flex items-center px-4 py-2 text-[14px] font-medium rounded-lg text-[#6B7280] hover:bg-gray-50">
                            <span className="material-symbols-outlined mr-3 text-[20px]">analytics</span>Analytics
                        </button>
                    </nav>
                    <div className="mt-auto pt-6 border-t border-gray-100">
                        <p className="text-[13px] text-gray-500 mb-2">Hiring powered by</p>
                        <p className="text-[16px] font-bold text-gray-900">Gemini AI</p>
                        <p className="text-[12px] text-gray-400 mt-1">Blind hiring • Bias-free screening</p>
                    </div>
                </aside>

                {/* MAIN */}
                <main className="flex-grow p-[32px] overflow-y-auto">
                    <div className="max-w-5xl mx-auto">
                        <div className="mb-6">
                            <h1 className="text-[28px] font-bold text-gray-900">Company Hiring Portal</h1>
                            <p className="text-[15px] text-gray-500 mt-1">AI-powered resume screening with blind hiring principles</p>
                        </div>

                        {/* Stats - Live Data */}
                        <div className="grid grid-cols-3 gap-4 mb-8">
                            {[
                                { label: 'Active Postings', value: activePostings.toLocaleString(), icon: 'work', color: 'bg-blue-100 text-blue-600' },
                                { label: 'Resumes Analyzed', value: resumesAnalyzed.toLocaleString(), icon: 'description', color: 'bg-purple-100 text-purple-600' },
                                { label: 'Shortlisted', value: candidatesShortlisted.toLocaleString(), icon: 'group', color: 'bg-green-100 text-green-600' },
                            ].map((stat) => (
                                <div key={stat.label} className="bg-white rounded-[16px] p-5 flex items-center gap-4 shadow-sm border border-gray-100">
                                    <div className={`${stat.color} p-3 rounded-xl`}>
                                        <span className="material-symbols-outlined text-2xl">{stat.icon}</span>
                                    </div>
                                    <div>
                                        <p className="text-[24px] font-bold text-gray-900">{stat.value}</p>
                                        <p className="text-[13px] text-gray-500">{stat.label}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Dashboard Interactivity (Form + Leaderboard) */}
                        <HiringDashboard />
                    </div>
                </main>

                {/* RIGHT SIDEBAR */}
                <aside className="w-[300px] shrink-0 mt-[32px] mr-[24px] mb-[32px]">
                    <div className="bg-white rounded-[16px] p-[28px] h-full overflow-y-auto shadow-sm border border-gray-100">
                        <h3 className="text-[15px] font-bold text-gray-900 mb-6">Recent Activity</h3>
                        <div className="space-y-4">
                            {[
                                { text: 'Resume batch uploaded', time: '2 min ago', icon: 'upload_file', color: 'bg-blue-100 text-blue-600' },
                                { text: 'AI analysis completed', time: '15 min ago', icon: 'smart_toy', color: 'bg-purple-100 text-purple-600' },
                                { text: '3 candidates shortlisted', time: '1 hour ago', icon: 'how_to_reg', color: 'bg-green-100 text-green-600' },
                                { text: 'Interview emails sent', time: '3 hours ago', icon: 'mail', color: 'bg-orange-100 text-orange-600' },
                            ].map((item, i) => (
                                <div key={i} className="flex items-start gap-3">
                                    <div className={`${item.color} p-2 rounded-lg shrink-0`}>
                                        <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
                                    </div>
                                    <div>
                                        <p className="text-[14px] text-gray-800 font-medium">{item.text}</p>
                                        <p className="text-[12px] text-gray-400">{item.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-8 pt-6 border-t border-gray-100">
                            <h3 className="text-[15px] font-bold text-gray-900 mb-3">Quick Stats</h3>
                            <div className="space-y-3">
                                <div>
                                    <div className="flex justify-between text-[13px] mb-1">
                                        <span className="text-gray-600">Avg Match Score</span>
                                        <span className="font-bold text-gray-900">84%</span>
                                    </div>
                                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-blue-500 rounded-full" style={{ width: '84%' }}></div></div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-[13px] mb-1">
                                        <span className="text-gray-600">Response Rate</span>
                                        <span className="font-bold text-gray-900">92%</span>
                                    </div>
                                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-green-500 rounded-full" style={{ width: '92%' }}></div></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}
