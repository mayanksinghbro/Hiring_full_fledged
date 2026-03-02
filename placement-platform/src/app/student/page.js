import { GraduationCap, FileCheck, Target, Lightbulb } from 'lucide-react';
import StudentDashboard from '@/components/student/StudentDashboard';
import { db } from '@/lib/db';

export default async function StudentPortal() {
    // 1. Fetch real stats from the database for the whole platform
    const skillsAnalyzed = await db.studentSkill.count();
    const successStories = await db.placementOffer.count({ where: { status: 'accepted' } });
    const studentsActive = await db.student.count();

    const stats = [
        { label: 'Active Students', value: studentsActive.toLocaleString(), icon: Target, color: 'from-purple-500 to-pink-500' },
        { label: 'Skills Analyzed', value: skillsAnalyzed.toLocaleString(), icon: Lightbulb, color: 'from-pink-500 to-rose-500' },
        { label: 'Success Stories', value: successStories.toLocaleString(), icon: FileCheck, color: 'from-emerald-500 to-teal-500' },
    ];

    return (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
            {/* Page Header */}
            <div className="mb-8 fade-in-up">
                <div className="flex items-center gap-3 mb-2">
                    <GraduationCap className="h-6 w-6 text-purple-400" />
                    <h1 className="text-3xl font-bold gradient-text">Student Career Portal</h1>
                </div>
                <p className="text-slate-500 text-lg">AI-powered career roadmap tailored to your dream company</p>
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

            {/* Interactive Student Dashboard (Client side) */}
            <StudentDashboard />
        </div>
    );
}
