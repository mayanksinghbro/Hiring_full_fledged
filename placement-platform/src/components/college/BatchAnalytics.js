import { Users, TrendingUp, Award, BarChart3, Briefcase, Star, BookOpen } from 'lucide-react';
import { db } from '@/lib/db';

export default async function BatchAnalytics() {
    // 1. Fetch real stats from the database
    const totalStudents = await db.student.count();
    const placedStudents = await db.student.count({ where: { isPlaced: true } });
    const companiesVisited = await db.company.count();
    const ongoingDrives = await db.placementDrive.count({ where: { status: 'ongoing' } });

    // Calculate placement rate
    const placementRate = totalStudents > 0
        ? Math.round((placedStudents / totalStudents) * 100)
        : 0;

    // Fetch Avg & Highest Package
    const aggregateOffers = await db.placementOffer.aggregate({
        _avg: { packageLpa: true },
        _max: { packageLpa: true },
        where: { status: 'accepted' }
    });

    const avgPackage = aggregateOffers._avg.packageLpa
        ? `₹${Number(aggregateOffers._avg.packageLpa).toFixed(1)} LPA`
        : '₹0 LPA';

    const highestPackage = aggregateOffers._max.packageLpa
        ? `₹${Number(aggregateOffers._max.packageLpa).toFixed(1)} LPA`
        : '₹0 LPA';

    // Fetch top skills (by student count)
    const skillCounts = await db.studentSkill.groupBy({
        by: ['skillId'],
        _count: { studentId: true },
        orderBy: { _count: { studentId: 'desc' } },
        take: 5
    });

    const topSkillsData = await Promise.all(skillCounts.map(async (sc) => {
        const skill = await db.skill.findUnique({ where: { id: sc.skillId } });
        return {
            skill: skill.name,
            count: sc._count.studentId,
            percentage: totalStudents > 0 ? Math.round((sc._count.studentId / totalStudents) * 100) : 0
        };
    }));

    const stats = [
        { label: 'Total Students', value: totalStudents.toLocaleString(), icon: Users, color: 'from-indigo-500 to-purple-500', change: '+12%' },
        { label: 'Placement Rate', value: `${placementRate}%`, icon: TrendingUp, color: 'from-emerald-500 to-teal-500', change: '+8.2%' },
        { label: 'Avg Package', value: avgPackage, icon: Award, color: 'from-amber-500 to-orange-500', change: '+15%' },
        { label: 'Companies Visited', value: companiesVisited, icon: Briefcase, color: 'from-pink-500 to-rose-500', change: '+23%' },
        { label: 'Highest Package', value: highestPackage, icon: Star, color: 'from-violet-500 to-purple-500', change: '' },
        { label: 'Ongoing Drives', value: ongoingDrives, icon: BookOpen, color: 'from-cyan-500 to-blue-500', change: 'Active' },
    ];

    return (
        <div className="space-y-8">
            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {stats.map((stat, i) => {
                    const Icon = stat.icon;
                    return (
                        <div key={stat.label} className={`stat-card flex items-center gap-4 fade-in-up stagger-${Math.min(i + 1, 5)}`}>
                            <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${stat.color} shadow-lg`}>
                                <Icon className="h-6 w-6 text-white" />
                            </div>
                            <div className="flex-1">
                                <p className="text-2xl font-bold text-slate-100">{stat.value}</p>
                                <p className="text-sm text-slate-500">{stat.label}</p>
                            </div>
                            {stat.change && (
                                <span className={`text-xs font-semibold px-2 py-1 rounded-lg ${stat.change.startsWith('+') ? 'bg-emerald-500/10 text-emerald-400' : 'bg-indigo-500/10 text-indigo-400'
                                    }`}>
                                    {stat.change}
                                </span>
                            )}
                        </div>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Skills */}
                <div className="glass-card p-6 fade-in-up">
                    <div className="flex items-center gap-3 mb-5">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                            <BarChart3 className="h-5 w-5 text-indigo-400" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-100">Top Skills in Batch</h3>
                    </div>
                    <div className="space-y-3">
                        {topSkillsData.map((skill, i) => (
                            <div key={skill.skill} className="group">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-sm font-medium text-slate-300">{skill.skill}</span>
                                    <span className="text-xs text-slate-500">{skill.count} students ({skill.percentage}%)</span>
                                </div>
                                <div className="h-2 rounded-full bg-slate-800/80 overflow-hidden">
                                    <div
                                        className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 score-bar"
                                        style={{ width: `${skill.percentage}%`, animationDelay: `${i * 0.1}s` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Skill Gaps - Placeholder for now as it requires complex AI mapping logic */}
                <div className="glass-card p-6 fade-in-up">
                    <div className="flex items-center gap-3 mb-5">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-500/10 border border-red-500/20">
                            <TrendingUp className="h-5 w-5 text-red-400" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-100">Batch Skill Gaps</h3>
                    </div>
                    <div className="flex flex-col items-center justify-center h-48 text-center px-4">
                        <p className="text-slate-400 text-sm mb-2">AI Gap Analysis is running on live data...</p>
                        <p className="text-slate-600 text-xs">Connect your Gemini API key in settings to visualize batch-level roadmap gaps.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
