'use client';

import { Briefcase, FileText, Plus, Upload, X, Zap, Tag } from 'lucide-react';
import { useState } from 'react';

export default function CreateJobForm({ onAnalyze }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [competency, setCompetency] = useState('');
    const [competencies, setCompetencies] = useState([]);
    const [files, setFiles] = useState([]);
    const [dragOver, setDragOver] = useState(false);

    const addCompetency = () => {
        if (competency.trim() && !competencies.includes(competency.trim())) {
            setCompetencies([...competencies, competency.trim()]);
            setCompetency('');
        }
    };

    const removeCompetency = (c) => {
        setCompetencies(competencies.filter((item) => item !== c));
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addCompetency();
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

                    {/* Competencies */}
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1.5">Expected Competencies</label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={competency}
                                onChange={(e) => setCompetency(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="e.g. React, TypeScript, System Design..."
                                className="input-field flex-1"
                            />
                            <button onClick={addCompetency} className="btn-secondary flex items-center gap-1">
                                <Plus className="h-4 w-4" />
                                Add
                            </button>
                        </div>
                        {competencies.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-3">
                                {competencies.map((c) => (
                                    <span key={c} className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/10 px-3 py-1 text-sm font-medium text-indigo-300 border border-indigo-500/20">
                                        <Tag className="h-3 w-3" />
                                        {c}
                                        <button onClick={() => removeCompetency(c)} className="ml-1 hover:text-red-400 transition-colors">
                                            <X className="h-3 w-3" />
                                        </button>
                                    </span>
                                ))}
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
