'use client';

import { BarChart3, PieChart as PieIcon } from 'lucide-react';
import {
    AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="rounded-xl bg-slate-800 px-4 py-3 border border-slate-700/50 shadow-xl">
                <p className="text-sm font-semibold text-slate-200 mb-1">{label}</p>
                {payload.map((entry, i) => (
                    <p key={i} className="text-xs" style={{ color: entry.color }}>
                        {entry.name}: <span className="font-bold">{entry.value}</span>
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

export default function PlacementCharts({ trendData = [], skillData = [] }) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Placement Trend */}
            <div className="glass-card p-6 fade-in-up">
                <div className="flex items-center gap-3 mb-5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                        <BarChart3 className="h-5 w-5 text-emerald-400" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-100">Placement Trend</h3>
                </div>
                <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={trendData}>
                            <defs>
                                <linearGradient id="placedGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="offersGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                            <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 12 }} />
                            <YAxis stroke="#64748b" tick={{ fontSize: 12 }} />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend
                                wrapperStyle={{ fontSize: '12px', color: '#94a3b8' }}
                            />
                            <Area
                                type="monotone"
                                dataKey="placed"
                                name="Students Placed"
                                stroke="#6366f1"
                                strokeWidth={2}
                                fill="url(#placedGrad)"
                            />
                            <Area
                                type="monotone"
                                dataKey="offers"
                                name="Offers Extended"
                                stroke="#8b5cf6"
                                strokeWidth={2}
                                fill="url(#offersGrad)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Skill Distribution */}
            <div className="glass-card p-6 fade-in-up">
                <div className="flex items-center gap-3 mb-5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/10 border border-purple-500/20">
                        <PieIcon className="h-5 w-5 text-purple-400" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-100">Skill Distribution</h3>
                </div>
                <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={skillData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={100}
                                paddingAngle={2}
                                dataKey="value"
                            >
                                {skillData.map((entry, i) => (
                                    <Cell key={`cell-${i}`} fill={entry.fill} />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                            <Legend
                                wrapperStyle={{ fontSize: '11px', color: '#94a3b8' }}
                                formatter={(value) => <span style={{ color: '#94a3b8' }}>{value}</span>}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
