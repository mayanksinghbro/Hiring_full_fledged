import { Building2, BarChart3, Users } from 'lucide-react';
import HiringDashboard from '@/components/company/HiringDashboard';
import { db } from '@/lib/db';

export default async function CompanyPortal() {
    // 1. Fetch real stats from the database
    const activePostings = await db.jobPosting.count({ where: { status: 'active' } });
    const resumesAnalyzed = await db.resume.count();
    const candidatesShortlisted = await db.application.count({ where: { status: 'offered' } }); // Or 'shortlisted' if added to schema

    const stats = [
        { label: 'Active Postings', value: activePostings.toLocaleString(), icon: Building2, color: 'from-indigo-500 to-purple-500' },
        { label: 'Resumes Analyzed', value: resumesAnalyzed.toLocaleString(), icon: BarChart3, color: 'from-purple-500 to-pink-500' },
        { label: 'Candidates Shortlisted', value: candidatesShortlisted.toLocaleString(), icon: Users, color: 'from-emerald-500 to-teal-500' },
    ];

    return (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
            {/* Page Header */}
            <div className="mb-8 fade-in-up">
                <div className="flex items-center gap-3 mb-2">
                    <Building2 className="h-6 w-6 text-indigo-400" />
                    <h1 className="text-3xl font-bold gradient-text">Company Hiring Portal</h1>
                </div>
                <p className="text-slate-500 text-lg">AI-powered resume screening with blind hiring principles</p>
            </div>

            {/* Stats Bar - Now Live! */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                {stats.map((stat) => (
                    <div key={stat.label} className="stat-card flex items-center gap-4">
                        <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${stat.color} shadow-lg`}>
                            <stat.icon className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-100">{stat.value}</p>
                            <p className="text-sm text-slate-500">{stat.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Hiring Logic (Form + Leaderboard) */}
            <HiringDashboard />
        </div>
    );
}
