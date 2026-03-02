'use client';

import { X, FileText, Download, User, MapPin, Mail, Phone, Briefcase, GraduationCap, Code, Award } from 'lucide-react';

function parseResumeSection(text) {
    const lines = text.trim().split('\n');
    const sections = [];
    let currentSection = { title: 'Header', lines: [] };

    const sectionHeaders = [
        'EDUCATION', 'EXPERIENCE', 'PROJECTS', 'SKILLS', 'ACHIEVEMENTS',
        'CERTIFICATIONS', 'WORK EXPERIENCE', 'TECHNICAL SKILLS', 'SUMMARY',
    ];

    for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) continue;

        if (sectionHeaders.some((h) => trimmed.toUpperCase() === h)) {
            if (currentSection.lines.length > 0) {
                sections.push(currentSection);
            }
            currentSection = { title: trimmed, lines: [] };
        } else {
            currentSection.lines.push(trimmed);
        }
    }
    if (currentSection.lines.length > 0) {
        sections.push(currentSection);
    }

    return sections;
}

function getSectionIcon(title) {
    const t = title.toUpperCase();
    if (t.includes('EDUCATION')) return <GraduationCap className="h-4 w-4" />;
    if (t.includes('EXPERIENCE')) return <Briefcase className="h-4 w-4" />;
    if (t.includes('PROJECT')) return <Code className="h-4 w-4" />;
    if (t.includes('SKILL')) return <Code className="h-4 w-4" />;
    if (t.includes('ACHIEVEMENT') || t.includes('CERTIFICATION')) return <Award className="h-4 w-4" />;
    return <FileText className="h-4 w-4" />;
}

export default function ResumeViewerModal({ candidate, resumeText, onClose }) {
    const sections = parseResumeSection(resumeText || '');
    const headerSection = sections.length > 0 && sections[0].title === 'Header' ? sections[0] : null;
    const bodySections = headerSection ? sections.slice(1) : sections;

    // Extract name from first line of header
    const candidateName = headerSection?.lines[0] || candidate.id;
    const contactLines = headerSection?.lines.slice(1) || [];

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div
                className="modal-content"
                onClick={(e) => e.stopPropagation()}
                style={{ maxWidth: '720px', maxHeight: '85vh', display: 'flex', flexDirection: 'column' }}
            >
                {/* Header Bar */}
                <div className="flex items-center justify-between mb-4 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600">
                            <FileText className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-slate-100">Resume Viewer</h3>
                            <p className="text-sm text-slate-500">{candidate.fileName || 'resume.pdf'}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className={`px-3 py-1.5 rounded-lg font-bold text-sm ${candidate.matchScore >= 80 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                                candidate.matchScore >= 60 ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                                    'bg-slate-500/10 text-slate-400 border border-slate-500/20'
                            }`}>
                            {candidate.matchScore}% Match
                        </div>
                        <button
                            onClick={onClose}
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-700/50 transition-colors"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                {/* Resume Content — scrollable */}
                <div className="overflow-y-auto flex-1 pr-2 custom-scrollbar">
                    {/* PDF-like document */}
                    <div className="rounded-xl border border-slate-600/30 bg-slate-900/80 shadow-2xl">
                        {/* Name & Contact Header */}
                        <div className="px-8 py-6 border-b border-slate-700/50 bg-gradient-to-r from-slate-800/50 to-slate-800/30">
                            <h2 className="text-2xl font-bold text-slate-100 mb-2">{candidateName}</h2>
                            <div className="flex flex-wrap gap-x-4 gap-y-1">
                                {contactLines.map((line, i) => {
                                    const parts = line.split('|').map((p) => p.trim());
                                    return parts.map((part, j) => (
                                        <span key={`${i}-${j}`} className="text-sm text-slate-400 flex items-center gap-1.5">
                                            {part.includes('@') ? <Mail className="h-3 w-3 text-indigo-400" /> :
                                                part.includes('+91') || part.includes('Phone') ? <Phone className="h-3 w-3 text-emerald-400" /> :
                                                    part.includes('linkedin') || part.includes('github') || part.includes('http') ? <Code className="h-3 w-3 text-purple-400" /> :
                                                        part.includes('Portfolio') ? <User className="h-3 w-3 text-cyan-400" /> :
                                                            null}
                                            {part}
                                        </span>
                                    ));
                                })}
                            </div>
                        </div>

                        {/* Resume Body Sections */}
                        <div className="px-8 py-5 space-y-5">
                            {bodySections.map((section, si) => (
                                <div key={si}>
                                    {/* Section Header */}
                                    <div className="flex items-center gap-2 mb-3 pb-1.5 border-b border-indigo-500/20">
                                        <span className="text-indigo-400">{getSectionIcon(section.title)}</span>
                                        <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-400">
                                            {section.title}
                                        </h3>
                                    </div>
                                    {/* Section Content */}
                                    <div className="space-y-1">
                                        {section.lines.map((line, li) => {
                                            const isBullet = line.startsWith('•') || line.startsWith('-');
                                            const isBold = /^[A-Z].*—|^\w+.*\(.*\)$/.test(line) && !isBullet;
                                            const isSkillLine = section.title.toUpperCase().includes('SKILL') && line.includes(':');

                                            if (isSkillLine) {
                                                const [label, values] = line.split(':');
                                                return (
                                                    <div key={li} className="flex flex-wrap gap-1 mb-2">
                                                        <span className="text-xs font-semibold text-slate-300 mr-2 min-w-[80px]">{label.trim()}:</span>
                                                        {values?.split(',').map((v, vi) => (
                                                            <span key={vi} className="inline-block px-2 py-0.5 text-xs rounded-md bg-indigo-500/10 text-indigo-300 border border-indigo-500/15">
                                                                {v.trim()}
                                                            </span>
                                                        ))}
                                                    </div>
                                                );
                                            }

                                            return (
                                                <p
                                                    key={li}
                                                    className={`text-sm leading-relaxed ${isBullet ? 'text-slate-400 pl-2' :
                                                            isBold ? 'text-slate-200 font-semibold mt-2' :
                                                                'text-slate-300'
                                                        }`}
                                                >
                                                    {line}
                                                </p>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-700/50 shrink-0">
                    <p className="text-xs text-slate-600">Candidate ID: {candidate.id} • Blind Hiring Mode Active</p>
                    <button onClick={onClose} className="btn-secondary">Close</button>
                </div>
            </div>
        </div>
    );
}
