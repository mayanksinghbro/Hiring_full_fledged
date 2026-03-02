'use client';

import { X, Send, Mail, User } from 'lucide-react';

export default function EmailModal({ candidate, jobTitle, onClose }) {
    const strengths = candidate.keyStrengths || candidate.skills || [];
    const missingSkills = candidate.criticalMissingSkills || [];

    const emailTemplate = {
        to: `candidate_${candidate.id.toLowerCase()}@university.ac.in`,
        subject: `Interview Invitation — ${jobTitle || 'Open Position'}`,
        body: `Dear Candidate ${candidate.id},

We are pleased to inform you that after a thorough AI-powered evaluation of your resume, you have been shortlisted for the "${jobTitle || 'Open Position'}" position.

Your Profile Highlights:
• Match Score: ${candidate.matchScore}%
• Key Strengths: ${strengths.join(', ') || 'N/A'}

AI Assessment Summary:
"${candidate.justification}"
${missingSkills.length > 0 ? `
Areas for Growth:
${missingSkills.map(s => `• ${s}`).join('\n')}
` : ''}
Next Steps:
1. Technical Interview — Round 1 (Online Coding Assessment)
2. Technical Interview — Round 2 (System Design & Problem Solving)
3. HR Interview & Cultural Fit Assessment

Please confirm your availability for the first round by replying to this email within 48 hours.

We look forward to speaking with you!

Best regards,
Hiring Team
Powered by Placify AI`,
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '640px' }}>
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600">
                            <Mail className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-slate-100">Shortlist & Send Email</h3>
                            <p className="text-sm text-slate-500">Candidate {candidate.id}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-700/50 transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Candidate Badge */}
                <div className="flex items-center gap-4 mb-6 p-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                        <User className="h-6 w-6 text-indigo-400" />
                    </div>
                    <div className="flex-1">
                        <p className="font-semibold text-slate-200">{candidate.id}</p>
                        <p className="text-sm text-slate-500">Blind Hiring — Identity Protected</p>
                    </div>
                    <div className={`px-3 py-1.5 rounded-lg font-bold text-sm ${candidate.matchScore >= 90 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                            candidate.matchScore >= 80 ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                                candidate.matchScore >= 70 ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                                    'bg-slate-500/10 text-slate-400 border border-slate-500/20'
                        }`}>
                        {candidate.matchScore}% Match
                    </div>
                </div>

                {/* Email Form */}
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1.5">To</label>
                        <input type="email" defaultValue={emailTemplate.to} className="input-field" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1.5">Subject</label>
                        <input type="text" defaultValue={emailTemplate.subject} className="input-field" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1.5">Message Body</label>
                        <textarea
                            className="input-field font-mono text-xs leading-relaxed"
                            rows={14}
                            defaultValue={emailTemplate.body}
                        />
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-slate-700/50">
                    <button onClick={onClose} className="btn-secondary">Cancel</button>
                    <button
                        onClick={() => { alert('✅ Email sent successfully! (Simulated)'); onClose(); }}
                        className="btn-primary flex items-center gap-2"
                    >
                        <Send className="h-4 w-4" />
                        Send Email
                    </button>
                </div>
            </div>
        </div>
    );
}
