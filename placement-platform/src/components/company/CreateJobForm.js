'use client';

import { Briefcase, FileText, Upload, X, Zap, Tag, Search, Sparkles } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

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
    "Problem Solving", "Presentation Skills", "Power BI",
    "System Design", "REST API", "CI/CD", "Testing",
    "Data Structures", "Algorithms", "OOP", "Design Patterns"
];

const CHIP_COLORS = [
    { bg: 'bg-violet-500/15', text: 'text-violet-300', border: 'border-violet-500/25', hover: 'hover:bg-violet-500/25' },
    { bg: 'bg-cyan-500/15', text: 'text-cyan-300', border: 'border-cyan-500/25', hover: 'hover:bg-cyan-500/25' },
    { bg: 'bg-amber-500/15', text: 'text-amber-300', border: 'border-amber-500/25', hover: 'hover:bg-amber-500/25' },
    { bg: 'bg-emerald-500/15', text: 'text-emerald-300', border: 'border-emerald-500/25', hover: 'hover:bg-emerald-500/25' },
    { bg: 'bg-rose-500/15', text: 'text-rose-300', border: 'border-rose-500/25', hover: 'hover:bg-rose-500/25' },
    { bg: 'bg-blue-500/15', text: 'text-blue-300', border: 'border-blue-500/25', hover: 'hover:bg-blue-500/25' },
    { bg: 'bg-fuchsia-500/15', text: 'text-fuchsia-300', border: 'border-fuchsia-500/25', hover: 'hover:bg-fuchsia-500/25' },
    { bg: 'bg-teal-500/15', text: 'text-teal-300', border: 'border-teal-500/25', hover: 'hover:bg-teal-500/25' },
];

export default function CreateJobForm({ onAnalyze }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [competencyInput, setCompetencyInput] = useState('');
    const [competencies, setCompetencies] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const [files, setFiles] = useState([]);
    const [dragOver, setDragOver] = useState(false);
    const inputRef = useRef(null);
    const dropdownRef = useRef(null);

    // Filter skills based on input, exclude already selected
    const filteredSkills = competencyInput.trim()
        ? MOCK_SKILLS.filter(
            (skill) =>
                skill.toLowerCase().includes(competencyInput.toLowerCase()) &&
                !competencies.includes(skill)
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
        setCompetencies((prev) => [...prev, skill]);
        setCompetencyInput('');
        setShowDropdown(false);
        setHighlightedIndex(-1);
        inputRef.current?.focus();
    };

    const removeCompetency = (c) => {
        setCompetencies((prev) => prev.filter((item) => item !== c));
    };

    const handleKeyDown = (e) => {
        if (showDropdown && filteredSkills.length > 0) {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setHighlightedIndex((prev) => (prev < filteredSkills.length - 1 ? prev + 1 : 0));
                return;
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : filteredSkills.length - 1));
                return;
            } else if (e.key === 'Enter' && highlightedIndex >= 0) {
                e.preventDefault();
                handleSelectSkill(filteredSkills[highlightedIndex]);
                return;
            } else if (e.key === 'Escape') {
                setShowDropdown(false);
                setHighlightedIndex(-1);
                return;
            }
        }
        // Allow Enter to add custom competency if no dropdown selection
        if (e.key === 'Enter' && competencyInput.trim() && !competencies.includes(competencyInput.trim())) {
            e.preventDefault();
            setCompetencies((prev) => [...prev, competencyInput.trim()]);
            setCompetencyInput('');
        }
    };

    const handleFileDrop = (e) => {
        e.preventDefault();
        setDragOver(false);
        const newFiles = Array.from(e.dataTransfer?.files || e.target?.files || []);
        setFiles((prev) => [...prev, ...newFiles.map((f) => f.name || `resume_${Date.now()}.pdf`)]);
    };

    const simulateFileUpload = () => {
        const mockFiles = [
            'resume_ankit_sharma.pdf',
            'resume_priya_verma.pdf',
            'resume_rahul_gupta.pdf',
            'resume_sneha_reddy.pdf',
            'resume_vikram_singh.pdf',
            'resume_deepika_jain.pdf',
            'resume_arjun_nair.pdf',
            'resume_kavya_menon.pdf',
        ];
        setFiles(mockFiles);
    };

    const getChipColor = (index) => CHIP_COLORS[index % CHIP_COLORS.length];

    return (
        <div className="glass-card p-6 fade-in-up">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/20">
                    <Briefcase className="h-5 w-5 text-white" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-slate-100">Create Job Posting</h2>
                    <p className="text-sm text-slate-500">Define the role and upload candidate resumes</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left: Form */}
                <div className="space-y-5">
                    {/* Job Title */}
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1.5">Job Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g. Senior Frontend Developer"
                            className="input-field"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1.5">Job Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Describe the role, responsibilities, and requirements..."
                            className="input-field"
                            rows={4}
                        />
                    </div>

                    {/* Competencies with Autocomplete */}
                    <div>
                        <div className="flex items-center gap-2 mb-1.5">
                            <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
                            <label className="text-sm font-medium text-slate-400">Expected Competencies</label>
                            <span className="text-xs text-slate-600">— type to search</span>
                        </div>

                        <div className="relative">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 pointer-events-none" />
                                <input
                                    ref={inputRef}
                                    id="company-competency-input"
                                    type="text"
                                    value={competencyInput}
                                    onChange={(e) => setCompetencyInput(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    onFocus={() => {
                                        if (filteredSkills.length > 0) setShowDropdown(true);
                                    }}
                                    placeholder="e.g. React, TypeScript, System Design..."
                                    className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-slate-900/70 border border-slate-600/50 text-sm text-slate-200 placeholder-slate-500 outline-none focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/20 transition-all"
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
                                                    ? 'bg-indigo-500/20 text-indigo-200'
                                                    : 'text-slate-300 hover:bg-slate-700/70 hover:text-slate-100'
                                                } ${idx !== filteredSkills.length - 1 ? 'border-b border-slate-700/30' : ''}`}
                                        >
                                            <Tag className="h-3 w-3 opacity-50 flex-shrink-0" />
                                            <span>{skill}</span>
                                            {idx === highlightedIndex && (
                                                <span className="ml-auto text-xs text-indigo-400/70">↵ Enter</span>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Selected Competency Chips */}
                        {competencies.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-3">
                                {competencies.map((c, idx) => {
                                    const color = getChipColor(idx);
                                    return (
                                        <span
                                            key={c}
                                            className={`inline-flex items-center gap-1.5 rounded-full ${color.bg} ${color.text} ${color.border} border px-3 py-1 text-xs font-medium transition-all`}
                                        >
                                            {c}
                                            <button
                                                onClick={() => removeCompetency(c)}
                                                className={`ml-0.5 rounded-full p-0.5 ${color.hover} transition-colors`}
                                                aria-label={`Remove ${c}`}
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </span>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right: File Upload */}
                <div className="space-y-4">
                    <label className="block text-sm font-medium text-slate-400 mb-1.5">Upload Resumes (PDF)</label>
                    <div
                        className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer ${dragOver
                            ? 'border-indigo-500 bg-indigo-500/5'
                            : 'border-slate-700 hover:border-slate-600 hover:bg-slate-800/30'
                            }`}
                        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                        onDragLeave={() => setDragOver(false)}
                        onDrop={handleFileDrop}
                        onClick={simulateFileUpload}
                    >
                        <div className="flex flex-col items-center gap-3">
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/10 border border-indigo-500/20">
                                <Upload className="h-7 w-7 text-indigo-400" />
                            </div>
                            <div>
                                <p className="font-semibold text-slate-300">Drop PDF resumes here</p>
                                <p className="text-sm text-slate-500 mt-1">or click to upload (simulated)</p>
                            </div>
                        </div>
                    </div>

                    {/* File List */}
                    {files.length > 0 && (
                        <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                                {files.length} files uploaded
                            </p>
                            {files.map((file, i) => (
                                <div key={i} className="flex items-center gap-3 rounded-lg bg-slate-800/50 px-3 py-2 border border-slate-700/30">
                                    <FileText className="h-4 w-4 text-indigo-400 shrink-0" />
                                    <span className="text-sm text-slate-300 truncate flex-1">{file}</span>
                                    <button onClick={() => setFiles(files.filter((_, idx) => idx !== i))} className="text-slate-600 hover:text-red-400 transition-colors">
                                        <X className="h-3.5 w-3.5" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Analyze Button */}
            <div className="mt-8 flex justify-center">
                <button
                    onClick={() => onAnalyze({ title: title || 'Senior Frontend Developer', description, competencies, files })}
                    className="btn-primary flex items-center gap-2 text-base px-8 py-3"
                    disabled={files.length === 0}
                    style={{ opacity: files.length === 0 ? 0.5 : 1 }}
                >
                    <Zap className="h-5 w-5" />
                    Analyze Fit with AI
                </button>
            </div>
        </div>
    );
}
