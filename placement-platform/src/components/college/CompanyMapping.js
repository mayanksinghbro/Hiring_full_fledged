'use client';

import { useState } from 'react';
import { Building2, Crown, Shield, Users, ChevronDown, Tag, Trophy } from 'lucide-react';

export default function CompanyMapping({ visitingCompanies = [] }) {
    const [selectedCompanyId, setSelectedCompanyId] = useState('');

    const company = visitingCompanies.find((c) => c.id === selectedCompanyId);
    const students = company?.topStudents || [];

    const getScoreColor = (score) => {
        if (score >= 90) return 'text-emerald-400';
        if (score >= 80) return 'text-blue-400';
        if (score >= 70) return 'text-amber-400';
        return 'text-slate-400';
    };

    const getScoreBarColor = (score) => {
        if (score >= 90) return 'from-emerald-500 to-emerald-400';
        if (score >= 80) return 'from-blue-500 to-blue-400';
        if (score >= 70) return 'from-amber-500 to-amber-400';
        return 'from-slate-500 to-slate-400';
    };

    return (
        <div className="glass-card p-6 fade-in-up">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-lg shadow-violet-500/20">
                    <Crown className="h-5 w-5 text-white" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-slate-100">Company-Student Mapping</h2>
                    <p className="text-sm text-slate-500">AI-matched top students (overriding CGPA metrics)</p>
                </div>
            </div>

            {/* Company Selector */}
            <div className="mb-6">
                <label className="block text-sm font-medium text-slate-400 mb-2">Select Visiting Company</label>
                <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                    {visitingCompanies.map((c) => (
                        <button
                            key={c.id}
                            onClick={() => setSelectedCompanyId(c.id)}
                            className={`rounded-xl p-4 text-left transition-all border ${selectedCompanyId === c.id
                                ? 'bg-indigo-500/10 border-indigo-500/30 ring-2 ring-indigo-500/20'
                                : 'bg-slate-800/30 border-slate-700/30 hover:border-slate-600/50 hover:bg-slate-800/50'
                                }`}
                        >
                            <p className={`font-bold text-sm ${selectedCompanyId === c.id ? 'text-indigo-300' : 'text-slate-300'}`}>
                                {c.name}
                            </p>
                            <p className="text-xs text-slate-500 mt-0.5">{c.role}</p>
                            <p className="text-xs font-semibold text-emerald-400 mt-1">{c.package}</p>
                        </button>
                    ))}
                </div>
            </div>

            {/* Company Requirements */}
            {company && (
                <div className="mb-6 p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/10 fade-in-up">
                    <p className="text-xs font-semibold uppercase tracking-wider text-indigo-400 mb-2">Required Competencies</p>
                    <div className="flex flex-wrap gap-2">
                        {company.requirements.map((req) => (
                            <span key={req} className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-300 border border-indigo-500/20">
                                <Tag className="h-3 w-3" />
                                {req}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Student Table */}
            {students.length > 0 && (
                <div className="overflow-x-auto fade-in-up">
                    <div className="flex items-center gap-2 mb-4">
                        <Shield className="h-4 w-4 text-violet-400" />
                        <p className="text-sm font-semibold text-slate-300">
                            Top {students.length} AI-Matched Students for {company?.name}
                        </p>
                        <span className="badge badge-purple text-xs ml-2">CGPA Overridden</span>
                    </div>
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-slate-700/50">
                                <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 w-16">Rank</th>
                                <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Student ID</th>
                                <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 w-44">AI Match Score</th>
                                <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Key Strengths</th>
                                <th className="pb-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500 w-24">CGPA</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700/30">
                            {students.map((student, i) => (
                                <tr key={student.id} className={`hover:bg-slate-700/20 transition-colors fade-in-up stagger-${Math.min(i + 1, 5)}`}>
                                    <td className="py-3.5">
                                        <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-slate-800/50">
                                            {student.rank <= 3 ? (
                                                <Trophy className={`h-4 w-4 ${student.rank === 1 ? 'text-amber-400' : student.rank === 2 ? 'text-slate-300' : 'text-amber-600'}`} />
                                            ) : (
                                                <span className="text-xs font-bold text-slate-500">#{student.rank}</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="py-3.5">
                                        <span className="font-semibold text-slate-200 text-sm">{student.id}</span>
                                    </td>
                                    <td className="py-3.5">
                                        <div className="flex items-center gap-3">
                                            <span className={`text-sm font-bold tabular-nums ${getScoreColor(student.matchScore)}`}>
                                                {student.matchScore}%
                                            </span>
                                            <div className="flex-1 h-1.5 rounded-full bg-slate-800/80 overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full bg-gradient-to-r ${getScoreBarColor(student.matchScore)} score-bar`}
                                                    style={{ width: `${student.matchScore}%`, animationDelay: `${i * 0.08}s` }}
                                                />
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-3.5">
                                        <p className="text-xs text-slate-400">{student.strengths}</p>
                                    </td>
                                    <td className="py-3.5 text-right">
                                        <span className="text-sm text-slate-500 tabular-nums">{student.cgpa}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {!selectedCompanyId && (
                <div className="text-center py-12 text-slate-600">
                    <Building2 className="h-12 w-12 mx-auto mb-3 opacity-30" />
                    <p className="font-medium">Select a company above to see matched students</p>
                </div>
            )}
        </div>
    );
}
