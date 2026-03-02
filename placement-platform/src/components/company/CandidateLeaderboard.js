'use client';

import { Trophy, Star, Mail, Shield, AlertTriangle, CheckCircle2, FileText } from 'lucide-react';
import { useState } from 'react';
import EmailModal from './EmailModal';
import ResumeViewerModal from './ResumeViewerModal';

export default function CandidateLeaderboard({ candidates, jobTitle, resumeTexts }) {
    const [emailCandidate, setEmailCandidate] = useState(null);
    const [viewCandidate, setViewCandidate] = useState(null);
    const [shortlisted, setShortlisted] = useState({});

    const handleShortlist = (candidate) => {
        setEmailCandidate(candidate);
        setShortlisted((prev) => ({ ...prev, [candidate.id]: true }));
    };

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

    const getRankBadge = (rank) => {
        if (rank === 1) return <Trophy className="h-5 w-5 text-amber-400" />;
        if (rank === 2) return <Trophy className="h-5 w-5 text-slate-300" />;
        if (rank === 3) return <Trophy className="h-5 w-5 text-amber-600" />;
        return <span className="text-sm font-bold text-slate-500">#{rank}</span>;
    };

    return (
        <>
            <div className="glass-card p-6 fade-in-up">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg shadow-amber-500/20">
                            <Trophy className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-100">AI Candidate Leaderboard</h2>
                            <p className="text-sm text-slate-500">Ranked by Gemini AI Match Score — Blind Hiring Mode</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 badge badge-purple">
                        <Shield className="h-3.5 w-3.5" />
                        Names Hidden
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-slate-700/50">
                                <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 w-14">Rank</th>
                                <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 w-28">Candidate</th>
                                <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 w-40">Match Score</th>
                                <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">AI Justification</th>
                                <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 w-48">Key Strengths</th>
                                <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 w-48">Missing Skills</th>
                                <th className="pb-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500 w-36">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700/30">
                            {candidates.map((candidate, index) => {
                                const rank = index + 1;
                                const strengths = candidate.keyStrengths || candidate.skills || [];
                                const missingSkills = candidate.criticalMissingSkills || [];
                                return (
                                    <tr
                                        key={candidate.id}
                                        className={`group hover:bg-slate-700/20 transition-colors fade-in-up stagger-${Math.min(index + 1, 5)}`}
                                    >
                                        {/* Rank */}
                                        <td className="py-4">
                                            <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-slate-800/50">
                                                {getRankBadge(rank)}
                                            </div>
                                        </td>

                                        {/* Candidate ID */}
                                        <td className="py-4">
                                            <div className="flex items-center gap-2">
                                                <div className={`flex h-9 w-9 items-center justify-center rounded-xl text-xs font-bold ${rank <= 3 ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'bg-slate-800/50 text-slate-400 border border-slate-700/50'
                                                    }`}>
                                                    {candidate.id.slice(-2)}
                                                </div>
                                                <span className="font-semibold text-slate-200 text-sm">{candidate.id}</span>
                                            </div>
                                        </td>

                                        {/* Match Score */}
                                        <td className="py-4">
                                            <div className="flex items-center gap-3">
                                                <span className={`text-lg font-bold tabular-nums ${getScoreColor(candidate.matchScore)}`}>
                                                    {candidate.matchScore}%
                                                </span>
                                                <div className="flex-1 h-2 rounded-full bg-slate-800/80 overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full bg-gradient-to-r ${getScoreBarColor(candidate.matchScore)} score-bar`}
                                                        style={{ width: `${candidate.matchScore}%`, animationDelay: `${index * 0.1}s` }}
                                                    />
                                                </div>
                                            </div>
                                        </td>

                                        {/* AI Justification */}
                                        <td className="py-4">
                                            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
                                                {candidate.justification}
                                            </p>
                                        </td>

                                        {/* Key Strengths */}
                                        <td className="py-4">
                                            <div className="flex flex-wrap gap-1">
                                                {strengths.slice(0, 3).map((skill) => (
                                                    <span key={skill} className="inline-flex items-center gap-1 text-xs px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/15">
                                                        <CheckCircle2 className="h-2.5 w-2.5" />
                                                        {skill}
                                                    </span>
                                                ))}
                                                {strengths.length > 3 && (
                                                    <span className="text-xs text-slate-600">+{strengths.length - 3}</span>
                                                )}
                                            </div>
                                        </td>

                                        {/* Missing Skills */}
                                        <td className="py-4">
                                            <div className="flex flex-wrap gap-1">
                                                {missingSkills.slice(0, 3).map((skill) => (
                                                    <span key={skill} className="inline-flex items-center gap-1 text-xs px-1.5 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/15">
                                                        <AlertTriangle className="h-2.5 w-2.5" />
                                                        {skill}
                                                    </span>
                                                ))}
                                                {missingSkills.length > 3 && (
                                                    <span className="text-xs text-slate-600">+{missingSkills.length - 3}</span>
                                                )}
                                            </div>
                                        </td>

                                        {/* Actions */}
                                        <td className="py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => setViewCandidate(candidate)}
                                                    className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition-all bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20"
                                                    title="View Resume"
                                                >
                                                    <FileText className="h-3.5 w-3.5" />
                                                    Resume
                                                </button>
                                                <button
                                                    onClick={() => handleShortlist(candidate)}
                                                    className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition-all ${shortlisted[candidate.id]
                                                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                                        : 'btn-primary text-xs'
                                                        }`}
                                                >
                                                    <Mail className="h-3.5 w-3.5" />
                                                    {shortlisted[candidate.id] ? 'Shortlisted ✓' : 'Shortlist & Email'}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Email Modal */}
            {emailCandidate && (
                <EmailModal
                    candidate={emailCandidate}
                    jobTitle={jobTitle}
                    onClose={() => setEmailCandidate(null)}
                />
            )}

            {/* Resume Viewer Modal */}
            {viewCandidate && (
                <ResumeViewerModal
                    candidate={viewCandidate}
                    resumeText={resumeTexts?.[viewCandidate.fileName] || ''}
                    onClose={() => setViewCandidate(null)}
                />
            )}
        </>
    );
}
