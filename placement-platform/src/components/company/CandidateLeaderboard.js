'use client';

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
        if (score >= 90) return 'text-green-600';
        if (score >= 80) return 'text-blue-600';
        if (score >= 70) return 'text-amber-600';
        return 'text-gray-500';
    };

    const getScoreBarColor = (score) => {
        if (score >= 90) return 'bg-green-500';
        if (score >= 80) return 'bg-blue-500';
        if (score >= 70) return 'bg-amber-500';
        return 'bg-gray-400';
    };

    return (
        <>
            <div className="bg-white rounded-[16px] p-6">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="bg-amber-100 p-2.5 rounded-xl">
                            <span className="material-symbols-outlined text-amber-600 text-xl">emoji_events</span>
                        </div>
                        <div>
                            <h2 className="text-[18px] font-bold text-gray-900">AI Candidate Leaderboard</h2>
                            <p className="text-[13px] text-gray-500">Ranked by Gemini AI Match Score — Blind Hiring Mode</p>
                        </div>
                    </div>
                    <span className="badge badge-purple"><span className="material-symbols-outlined text-[14px]">shield</span>Names Hidden</span>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-100">
                                <th className="pb-3 text-left text-[12px] font-semibold uppercase tracking-wider text-gray-400 w-14">Rank</th>
                                <th className="pb-3 text-left text-[12px] font-semibold uppercase tracking-wider text-gray-400 w-28">Candidate</th>
                                <th className="pb-3 text-left text-[12px] font-semibold uppercase tracking-wider text-gray-400 w-40">Match Score</th>
                                <th className="pb-3 text-left text-[12px] font-semibold uppercase tracking-wider text-gray-400">AI Justification</th>
                                <th className="pb-3 text-left text-[12px] font-semibold uppercase tracking-wider text-gray-400 w-48">Key Strengths</th>
                                <th className="pb-3 text-left text-[12px] font-semibold uppercase tracking-wider text-gray-400 w-48">Missing Skills</th>
                                <th className="pb-3 text-right text-[12px] font-semibold uppercase tracking-wider text-gray-400 w-36">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {candidates.map((candidate, index) => {
                                const rank = index + 1;
                                const strengths = candidate.keyStrengths || candidate.skills || [];
                                const missingSkills = candidate.criticalMissingSkills || [];
                                return (
                                    <tr key={candidate.id} className="group hover:bg-gray-50 transition-colors">
                                        <td className="py-4">
                                            <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-gray-50">
                                                {rank <= 3 ? (
                                                    <span className={`material-symbols-outlined text-[18px] ${rank === 1 ? 'text-amber-500' : rank === 2 ? 'text-gray-400' : 'text-amber-700'}`}>emoji_events</span>
                                                ) : (
                                                    <span className="text-[13px] font-bold text-gray-400">#{rank}</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="py-4">
                                            <div className="flex items-center gap-2">
                                                <div className={`flex h-9 w-9 items-center justify-center rounded-xl text-[12px] font-bold ${rank <= 3 ? 'bg-blue-50 text-[#2563EB] border border-blue-200' : 'bg-gray-50 text-gray-500 border border-gray-200'}`}>
                                                    {candidate.id.slice(-2)}
                                                </div>
                                                <span className="font-semibold text-gray-800 text-[13px]">{candidate.id}</span>
                                            </div>
                                        </td>
                                        <td className="py-4">
                                            <div className="flex items-center gap-3">
                                                <span className={`text-[16px] font-bold tabular-nums ${getScoreColor(candidate.matchScore)}`}>{candidate.matchScore}%</span>
                                                <div className="flex-1 h-2 rounded-full bg-gray-100 overflow-hidden">
                                                    <div className={`h-full rounded-full ${getScoreBarColor(candidate.matchScore)} score-bar`} style={{ width: `${candidate.matchScore}%`, animationDelay: `${index * 0.1}s` }} />
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4">
                                            <p className="text-[12px] text-gray-500 leading-relaxed max-w-sm">{candidate.justification}</p>
                                        </td>
                                        <td className="py-4">
                                            <div className="flex flex-wrap gap-1">
                                                {strengths.slice(0, 3).map((skill) => (
                                                    <span key={skill} className="inline-flex items-center gap-1 text-[11px] px-1.5 py-0.5 rounded bg-green-50 text-green-700 border border-green-100">
                                                        <span className="material-symbols-outlined text-[12px]">check_circle</span>{skill}
                                                    </span>
                                                ))}
                                                {strengths.length > 3 && <span className="text-[11px] text-gray-400">+{strengths.length - 3}</span>}
                                            </div>
                                        </td>
                                        <td className="py-4">
                                            <div className="flex flex-wrap gap-1">
                                                {missingSkills.slice(0, 3).map((skill) => (
                                                    <span key={skill} className="inline-flex items-center gap-1 text-[11px] px-1.5 py-0.5 rounded bg-red-50 text-red-600 border border-red-100">
                                                        <span className="material-symbols-outlined text-[12px]">warning</span>{skill}
                                                    </span>
                                                ))}
                                                {missingSkills.length > 3 && <span className="text-[11px] text-gray-400">+{missingSkills.length - 3}</span>}
                                            </div>
                                        </td>
                                        <td className="py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button onClick={() => setViewCandidate(candidate)} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-[12px] font-semibold bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100 transition-colors">
                                                    <span className="material-symbols-outlined text-[14px]">description</span>Resume
                                                </button>
                                                <button
                                                    onClick={() => handleShortlist(candidate)}
                                                    className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-[12px] font-semibold transition-all ${shortlisted[candidate.id] ? 'bg-green-50 text-green-700 border border-green-200' : 'btn-primary text-[12px]'}`}
                                                >
                                                    <span className="material-symbols-outlined text-[14px]">mail</span>
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

            {emailCandidate && <EmailModal candidate={emailCandidate} jobTitle={jobTitle} onClose={() => setEmailCandidate(null)} />}
            {viewCandidate && <ResumeViewerModal candidate={viewCandidate} resumeText={resumeTexts?.[viewCandidate.fileName] || ''} onClose={() => setViewCandidate(null)} />}
        </>
    );
}
