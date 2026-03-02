import { School } from 'lucide-react';
import BatchAnalytics from '@/components/college/BatchAnalytics';
import CompanyMapping from '@/components/college/CompanyMapping';
import PlacementCharts from '@/components/college/PlacementCharts';
import { db } from '@/lib/db';

export default async function CollegePortal() {
    // 1. Fetch Placement Trend (Last 6 months)
    const offers = await db.placementOffer.findMany({
        where: { status: 'accepted' },
        select: { offerDate: true }
    });

    // Mocking trend data for visual display until more historical data exists
    const months = ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb'];
    const trendData = months.map((month, i) => ({
        month,
        placed: Math.floor(Math.random() * 20) + 10,
        offers: Math.floor(Math.random() * 25) + 15
    }));

    // 2. Fetch Skill Distribution
    const skillCounts = await db.studentSkill.groupBy({
        by: ['skillId'],
        _count: { studentId: true },
        orderBy: { _count: { studentId: 'desc' } },
        take: 5
    });

    const skillDistribution = await Promise.all(skillCounts.map(async (sc, i) => {
        const skill = await db.skill.findUnique({ where: { id: sc.skillId } });
        const colors = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];
        return {
            name: skill?.name || 'Unknown',
            value: sc._count.studentId,
            fill: colors[i % colors.length]
        };
    }));

    // 3. Fetch Visiting Companies (with jobs)
    const jobs = await db.jobPosting.findMany({
        include: {
            company: true,
            requirements: { include: { skill: true } },
            applications: {
                include: { student: true },
                orderBy: { matchScore: 'desc' },
                take: 5
            }
        }
    });

    const companiesData = jobs.map(job => ({
        id: job.id,
        name: job.company.name,
        role: job.title,
        package: `₹${job.packageLpa} LPA`,
        requirements: job.requirements.map(r => r.skill.name),
        topStudents: job.applications.map((app, i) => ({
            id: app.student.userId.substring(0, 8),
            rank: i + 1,
            matchScore: Number(app.matchScore || 0),
            strengths: app.aiJustification || 'Strong technical match',
            cgpa: Number(app.student.cgpa || 0)
        }))
    }));

    // For Sidebar stats - we can fetch these or just rely on components
    const totalStudentsCount = await db.student.count();
    const placedStudentsCount = await db.student.count({ where: { isPlaced: true } });
    const placementRate = totalStudentsCount > 0 ? Math.round((placedStudentsCount / totalStudentsCount) * 100) : 0;

    // Aggregates for Quick Stats
    const aggregateOffers = await db.placementOffer.aggregate({
        _avg: { packageLpa: true },
        _max: { packageLpa: true },
        where: { status: 'accepted' }
    });

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
                        <a href="/company" className="text-[14px] font-medium text-[#6B7280] px-4 h-full flex items-center hover:text-[#2563EB] border-b-2 border-transparent">Company</a>
                        <a href="/college" className="text-[14px] font-medium text-[#2563EB] px-4 h-full flex items-center border-b-2 border-[#2563EB]">College</a>
                    </nav>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-full border border-green-200">
                        <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                        <span className="text-[13px] font-medium text-green-700">AI Online</span>
                    </div>
                    <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                        <div className="h-10 w-10 rounded-full bg-violet-500 flex items-center justify-center text-white font-bold text-sm">PC</div>
                    </div>
                </div>
            </header>

            {/* BODY */}
            <div className="flex flex-1 overflow-hidden">
                {/* LEFT SIDEBAR */}
                <aside className="w-[260px] bg-white border-r border-gray-200 flex flex-col shrink-0 overflow-y-auto py-[32px] px-[24px]">
                    <nav className="flex-1 space-y-2">
                        <button className="w-full flex items-center px-4 py-2 text-[14px] font-medium rounded-lg sidebar-item-active">
                            <span className="material-symbols-outlined mr-3 text-[20px]">dashboard</span>Overview
                        </button>
                        <button className="w-full flex items-center px-4 py-2 text-[14px] font-medium rounded-lg text-[#6B7280] hover:bg-gray-50">
                            <span className="material-symbols-outlined mr-3 text-[20px]">analytics</span>Analytics
                        </button>
                        <button className="w-full flex items-center px-4 py-2 text-[14px] font-medium rounded-lg text-[#6B7280] hover:bg-gray-50">
                            <span className="material-symbols-outlined mr-3 text-[20px]">apartment</span>Companies
                        </button>
                        <button className="w-full flex items-center px-4 py-2 text-[14px] font-medium rounded-lg text-[#6B7280] hover:bg-gray-50">
                            <span className="material-symbols-outlined mr-3 text-[20px]">groups</span>Students
                        </button>
                    </nav>
                    <div className="mt-auto pt-6 border-t border-gray-100">
                        <p className="text-[13px] text-gray-500 mb-2">Current Batch</p>
                        <p className="text-[16px] font-bold text-gray-900">2025-26</p>
                        <p className="text-[12px] text-gray-400 mt-1">{totalStudentsCount.toLocaleString()} students enrolled</p>
                    </div>
                </aside>

                {/* MAIN */}
                <main className="flex-grow p-[32px] overflow-y-auto">
                    <div className="max-w-5xl mx-auto">
                        <div className="mb-6">
                            <h1 className="text-[28px] font-bold text-gray-900">College Placement Cell</h1>
                            <p className="text-[15px] text-gray-500 mt-1">Macro-level batch analytics and AI-powered company-student mapping</p>
                        </div>

                        <BatchAnalytics />

                        <div className="mt-8">
                            <PlacementCharts trendData={trendData} skillData={skillDistribution} />
                        </div>

                        <div className="mt-8">
                            <CompanyMapping visitingCompanies={companiesData} />
                        </div>
                    </div>
                </main>

                {/* RIGHT SIDEBAR */}
                <aside className="w-[300px] shrink-0 mt-[32px] mr-[24px] mb-[32px]">
                    <div className="bg-white rounded-[16px] p-[28px] h-full overflow-y-auto">
                        <h3 className="text-[15px] font-bold text-gray-900 mb-6">Quick Stats</h3>
                        <div className="space-y-5">
                            <div className="text-center">
                                <div className="relative w-[100px] h-[100px] mx-auto mb-3">
                                    <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                                        <path className="fill-none stroke-gray-100 stroke-[3.8]" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                                        <path className="fill-none stroke-green-500 stroke-[3.8] stroke-linecap-round" strokeDasharray={`${placementRate}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <span className="text-[20px] font-bold text-gray-900">{placementRate}%</span>
                                    </div>
                                </div>
                                <p className="text-[13px] font-medium text-gray-600">Placement Rate</p>
                            </div>
                            <div className="border-t border-gray-100 pt-4 space-y-3">
                                {[
                                    { label: 'Avg Package', value: `₹${Number(aggregateOffers._avg.packageLpa || 0).toFixed(1)} LPA`, color: 'text-blue-600' },
                                    { label: 'Highest Package', value: `₹${Number(aggregateOffers._max.packageLpa || 0).toFixed(1)} LPA`, color: 'text-green-600' },
                                    { label: 'Companies', value: jobs.length, color: 'text-purple-600' },
                                    { label: 'Ongoing Drives', value: '3', color: 'text-orange-600' },
                                ].map((stat) => (
                                    <div key={stat.label} className="flex justify-between items-center">
                                        <span className="text-[13px] text-gray-500">{stat.label}</span>
                                        <span className={`text-[14px] font-bold ${stat.color}`}>{stat.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}
