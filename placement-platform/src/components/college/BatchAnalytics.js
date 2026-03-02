'use client';

import { Users, TrendingUp, Award, BarChart3, Briefcase, Star, BookOpen } from 'lucide-react';
import { batchStats, topSkills, skillGaps } from '@/data/mockCollegeData';

export default function BatchAnalytics() {
    const stats = [
        { label: 'Total Students', value: batchStats.totalStudents.toLocaleString(), icon: Users, color: 'from-indigo-500 to-purple-500', change: '+12%' },
        { label: 'Placement Rate', value: `${batchStats.placementRate}%`, icon: TrendingUp, color: 'from-emerald-500 to-teal-500', change: '+8.2%' },
        { label: 'Avg Package', value: batchStats.avgPackage, icon: Award, color: 'from-amber-500 to-orange-500', change: '+15%' },
        { label: 'Companies Visited', value: batchStats.companiesVisited, icon: Briefcase, color: 'from-pink-500 to-rose-500', change: '+23%' },
        { label: 'Highest Package', value: batchStats.highestPackage, icon: Star, color: 'from-violet-500 to-purple-500', change: '' },
        { label: 'Ongoing Drives', value: batchStats.ongoingDrives, icon: BookOpen, color: 'from-cyan-500 to-blue-500', change: 'Active' },
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
                        {topSkills.map((skill, i) => (
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

                {/* Skill Gaps */}
                <div className="glass-card p-6 fade-in-up">
                    <div className="flex items-center gap-3 mb-5">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-500/10 border border-red-500/20">
                            <TrendingUp className="h-5 w-5 text-red-400" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-100">Skill Gaps in Batch</h3>
                    </div>
                    <div className="space-y-3">
                        {skillGaps.map((item, i) => (
                            <div key={item.skill} className="rounded-xl bg-slate-800/40 p-4 border border-slate-700/30 hover:border-red-500/20 transition-colors">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-semibold text-slate-200 text-sm">{item.skill}</span>
                                    <span className="badge badge-danger text-xs">{item.gap}% gap</span>
                                </div>
                                <p className="text-xs text-slate-500">{item.description}</p>
                                <div className="h-1.5 rounded-full bg-slate-800/80 overflow-hidden mt-2">
                                    <div
                                        className="h-full rounded-full bg-gradient-to-r from-red-500 to-orange-500 score-bar"
                                        style={{ width: `${item.gap}%`, animationDelay: `${i * 0.1}s` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
