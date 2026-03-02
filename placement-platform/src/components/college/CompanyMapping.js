'use client';

import { useState, useRef, useEffect } from 'react';
import { Building2, Crown, Shield, Users, ChevronDown, Tag, Trophy, X, Search, Sparkles } from 'lucide-react';
import { visitingCompanies, topStudentsForCompany } from '@/data/mockCollegeData';

const MOCK_SKILLS = [
    "Python", "PostgreSQL", "PHP", "Product Management", "Project Management",
    "React", "React Native", "Redux", "Ruby", "Rust",
    "Java", "JavaScript", "Jenkins", "JWT",
    "Communication", "Critical Thinking", "C++", "C#", "CSS",
    "Node.js", "Next.js", "NumPy",
    "TypeScript", "TensorFlow", "Teamwork", "Time Management",
    "Docker", "Django", "Data Analysis", "DevOps",
    "AWS", "Azure", "Angular", "Agile",
    "Machine Learning", "MongoDB", "MySQL", "Microservices",
    "Git", "GraphQL", "Go", "Google Cloud",
    "Kubernetes", "Kafka",
    "Leadership", "Linux",
    "SQL", "Swift", "Scrum", "Spring Boot",
    "UI/UX Design", "Unity",
    "Vue.js", "Verbal Communication",
    "Figma", "Firebase", "Flutter",
    "HTML", "Hadoop",
    "Elasticsearch", "Express.js", "Empathy",
    "Problem Solving", "Presentation Skills", "Power BI"
];

export default function CompanyMapping() {
    const [selectedCompany, setSelectedCompany] = useState('');
    const [competencyInput, setCompetencyInput] = useState('');
    const [selectedCompetencies, setSelectedCompetencies] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const inputRef = useRef(null);
    const dropdownRef = useRef(null);

    const students = selectedCompany ? topStudentsForCompany[selectedCompany] || [] : [];
    const company = visitingCompanies.find((c) => c.id === selectedCompany);

    // Filter skills based on input, exclude already selected
    const filteredSkills = competencyInput.trim()
        ? MOCK_SKILLS.filter(
            (skill) =>
                skill.toLowerCase().includes(competencyInput.toLowerCase()) &&
                !selectedCompetencies.includes(skill)
        )
        : [];

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (
                inputRef.current && !inputRef.current.contains(e.target) &&
                dropdownRef.current && !dropdownRef.current.contains(e.target)
            ) {
                setShowDropdown(false);
                setHighlightedIndex(-1);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Show/hide dropdown based on filtered results
    useEffect(() => {
        setShowDropdown(filteredSkills.length > 0 && competencyInput.trim().length > 0);
        setHighlightedIndex(-1);
    }, [competencyInput]);

    const handleSelectSkill = (skill) => {
        setSelectedCompetencies((prev) => [...prev, skill]);
        setCompetencyInput('');
        setShowDropdown(false);
        setHighlightedIndex(-1);
        inputRef.current?.focus();
    };

    const handleRemoveSkill = (skill) => {
        setSelectedCompetencies((prev) => prev.filter((s) => s !== skill));
    };

    const handleKeyDown = (e) => {
        if (!showDropdown || filteredSkills.length === 0) return;

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setHighlightedIndex((prev) => (prev < filteredSkills.length - 1 ? prev + 1 : 0));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : filteredSkills.length - 1));
        } else if (e.key === 'Enter' && highlightedIndex >= 0) {
            e.preventDefault();
            handleSelectSkill(filteredSkills[highlightedIndex]);
        } else if (e.key === 'Escape') {
            setShowDropdown(false);
            setHighlightedIndex(-1);
        }
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

    // Color palette for chips
    const chipColors = [
        { bg: 'bg-violet-500/15', text: 'text-violet-300', border: 'border-violet-500/25', hover: 'hover:bg-violet-500/25' },
        { bg: 'bg-cyan-500/15', text: 'text-cyan-300', border: 'border-cyan-500/25', hover: 'hover:bg-cyan-500/25' },
        { bg: 'bg-amber-500/15', text: 'text-amber-300', border: 'border-amber-500/25', hover: 'hover:bg-amber-500/25' },
        { bg: 'bg-emerald-500/15', text: 'text-emerald-300', border: 'border-emerald-500/25', hover: 'hover:bg-emerald-500/25' },
        { bg: 'bg-rose-500/15', text: 'text-rose-300', border: 'border-rose-500/25', hover: 'hover:bg-rose-500/25' },
        { bg: 'bg-blue-500/15', text: 'text-blue-300', border: 'border-blue-500/25', hover: 'hover:bg-blue-500/25' },
        { bg: 'bg-fuchsia-500/15', text: 'text-fuchsia-300', border: 'border-fuchsia-500/25', hover: 'hover:bg-fuchsia-500/25' },
        { bg: 'bg-teal-500/15', text: 'text-teal-300', border: 'border-teal-500/25', hover: 'hover:bg-teal-500/25' },
    ];

    const getChipColor = (index) => chipColors[index % chipColors.length];

    return (
        <div className="glass-card p-6 fade-in-up">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-lg shadow-violet-500/20">
                    <Crown className="h-5 w-5 text-white" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-slate-100">Company-Student Mapping</h2>
                    <p className="text-sm text-slate-500">AI-matched top 10% students (overriding CGPA metrics)</p>
                </div>
            </div>

            {/* ── Competency Autocomplete ── */}
            <div className="mb-6 p-5 rounded-xl bg-gradient-to-br from-slate-800/60 to-slate-800/30 border border-slate-700/40">
                <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="h-4 w-4 text-violet-400" />
                    <label className="text-sm font-semibold text-slate-300">Add Competency</label>
                    <span className="text-xs text-slate-500 ml-1">— type to search skills</span>
                </div>

                {/* Input + Dropdown wrapper */}
                <div className="relative">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 pointer-events-none" />
                        <input
                            ref={inputRef}
                            id="competency-input"
                            type="text"
                            value={competencyInput}
                            onChange={(e) => setCompetencyInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            onFocus={() => {
                                if (filteredSkills.length > 0) setShowDropdown(true);
                            }}
                            placeholder="e.g. Python, React, Communication..."
                            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-slate-900/70 border border-slate-600/50 text-sm text-slate-200 placeholder-slate-500 outline-none focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/20 transition-all"
                            autoComplete="off"
                        />
                    </div>

                    {/* Floating Dropdown */}
                    {showDropdown && filteredSkills.length > 0 && (
                        <div
                            ref={dropdownRef}
                            className="absolute left-0 right-0 top-full mt-1 max-h-52 overflow-y-auto rounded-lg bg-slate-800 border border-slate-600/50 shadow-2xl shadow-black/40 z-50"
                        >
                            {filteredSkills.map((skill, idx) => (
                                <button
                                    key={skill}
                                    onClick={() => handleSelectSkill(skill)}
                                    onMouseEnter={() => setHighlightedIndex(idx)}
                                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center gap-2 ${idx === highlightedIndex
                                            ? 'bg-violet-500/20 text-violet-200'
                                            : 'text-slate-300 hover:bg-slate-700/70 hover:text-slate-100'
                                        } ${idx !== filteredSkills.length - 1 ? 'border-b border-slate-700/30' : ''}`}
                                >
                                    <Tag className="h-3 w-3 opacity-50 flex-shrink-0" />
                                    <span>{skill}</span>
                                    {idx === highlightedIndex && (
                                        <span className="ml-auto text-xs text-violet-400/70">↵ Enter</span>
                                    )}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Selected Competency Chips */}
                {selectedCompetencies.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                        {selectedCompetencies.map((skill, idx) => {
                            const color = getChipColor(idx);
                            return (
                                <span
                                    key={skill}
                                    className={`inline-flex items-center gap-1.5 rounded-full ${color.bg} ${color.text} ${color.border} border px-3 py-1 text-xs font-medium transition-all animate-in fade-in duration-200`}
                                >
                                    {skill}
                                    <button
                                        onClick={() => handleRemoveSkill(skill)}
                                        className={`ml-0.5 rounded-full p-0.5 ${color.hover} transition-colors`}
                                        aria-label={`Remove ${skill}`}
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </span>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Company Selector */}
            <div className="mb-6">
                <label className="block text-sm font-medium text-slate-400 mb-2">Select Visiting Company</label>
                <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                    {visitingCompanies.map((c) => (
                        <button
                            key={c.id}
                            onClick={() => setSelectedCompany(c.id)}
                            className={`rounded-xl p-4 text-left transition-all border ${selectedCompany === c.id
                                ? 'bg-indigo-500/10 border-indigo-500/30 ring-2 ring-indigo-500/20'
                                : 'bg-slate-800/30 border-slate-700/30 hover:border-slate-600/50 hover:bg-slate-800/50'
                                }`}
                        >
                            <p className={`font-bold text-sm ${selectedCompany === c.id ? 'text-indigo-300' : 'text-slate-300'}`}>
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

            {!selectedCompany && (
                <div className="text-center py-12 text-slate-600">
                    <Building2 className="h-12 w-12 mx-auto mb-3 opacity-30" />
                    <p className="font-medium">Select a company above to see matched students</p>
                </div>
            )}
        </div>
    );
}
