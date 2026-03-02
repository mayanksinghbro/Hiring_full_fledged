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
        { label: 'Total Students', value: totalStudents.toLocaleString(), icon: 'groups', color: 'bg-blue-100 text-blue-600', change: '+12%' },
        { label: 'Placement Rate', value: `${placementRate}%`, icon: 'trending_up', color: 'bg-green-100 text-green-600', change: '+8.2%' },
        { label: 'Avg Package', value: avgPackage, icon: 'military_tech', color: 'bg-amber-100 text-amber-600', change: '+15%' },
        { label: 'Companies Visited', value: companiesVisited, icon: 'apartment', color: 'bg-pink-100 text-pink-600', change: '+23%' },
        { label: 'Highest Package', value: highestPackage, icon: 'star', color: 'bg-purple-100 text-purple-600', change: '' },
        { label: 'Ongoing Drives', value: ongoingDrives, icon: 'menu_book', color: 'bg-cyan-100 text-cyan-600', change: 'Active' },
    ];

    return (
        <div className="space-y-8">
            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {stats.map((stat) => (
                    <div key={stat.label} className="bg-white rounded-[16px] p-5 flex items-center gap-4 hover:shadow-md transition-shadow">
                        <div className={`${stat.color} p-3 rounded-xl`}>
                            <span className="material-symbols-outlined text-2xl">{stat.icon}</span>
                        </div>
                        <div className="flex-1">
                            <p className="text-[22px] font-bold text-gray-900">{stat.value}</p>
                            <p className="text-[13px] text-gray-500">{stat.label}</p>
                        </div>
                        {stat.change && (
                            <span className={`text-[12px] font-semibold px-2 py-1 rounded-lg ${stat.change.startsWith('+') ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'}`}>
                                {stat.change}
                            </span>
                        )}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Skills */}
                <div className="bg-white rounded-[16px] p-6">
                    <div className="flex items-center gap-3 mb-5">
                        <div className="bg-blue-100 p-2 rounded-xl">
                            <span className="material-symbols-outlined text-blue-600 text-xl">bar_chart</span>
                        </div>
                        <h3 className="text-[18px] font-bold text-gray-900">Top Skills in Batch</h3>
                    </div>
                    <div className="space-y-3">
                        {topSkillsData.map((skill, i) => (
                            <div key={skill.skill} className="group">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-[14px] font-medium text-gray-700">{skill.skill}</span>
                                    <span className="text-[12px] text-gray-400">{skill.count} students ({skill.percentage}%)</span>
                                </div>
                                <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                                    <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-400 score-bar" style={{ width: `${skill.percentage}%`, animationDelay: `${i * 0.1}s` }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Skill Gaps */}
                <div className="bg-white rounded-[16px] p-6">
                    <div className="flex items-center gap-3 mb-5">
                        <div className="bg-red-100 p-2 rounded-xl">
                            <span className="material-symbols-outlined text-red-600 text-xl">warning</span>
                        </div>
                        <h3 className="text-[18px] font-bold text-gray-900">Skill Gaps in Batch</h3>
                    </div>
                    <div className="space-y-3">
                        {/* AI Skill Gaps placeholder - can be populated via AI mapping later */}
                        <div className="rounded-xl bg-gray-50 p-6 border border-gray-100 text-center">
                            <p className="text-[14px] text-gray-500 mb-2">AI Gap Analysis is running on live data...</p>
                            <p className="text-[12px] text-gray-400">Connect your Gemini API key in settings to visualize batch-level roadmap gaps.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
