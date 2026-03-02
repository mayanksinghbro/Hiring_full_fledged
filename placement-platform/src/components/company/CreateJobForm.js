'use client';

import { useState, useRef } from 'react';

export default function CreateJobForm({ onAnalyze }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [competency, setCompetency] = useState('');
    const [competencies, setCompetencies] = useState([]);
    const [files, setFiles] = useState([]);
    const [dragOver, setDragOver] = useState(false);
    const fileInputRef = useRef(null);

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

    const processFiles = (fileList) => {
        const pdfFiles = Array.from(fileList).filter(f => f.type === 'application/pdf' || f.name.endsWith('.pdf'));
        if (pdfFiles.length === 0) {
            alert('Please upload PDF files only.');
            return;
        }
        setFiles(prev => [...prev, ...pdfFiles]);
    };

    const handleFileDrop = (e) => {
        e.preventDefault();
        setDragOver(false);
        if (e.dataTransfer?.files?.length) {
            processFiles(e.dataTransfer.files);
        }
    };

    const handleFileSelect = (e) => {
        if (e.target.files?.length) {
            processFiles(e.target.files);
            e.target.value = '';
        }
    };

    const simulateFileUpload = () => {
        // Create mock File objects for demo purposes
        const mockNames = [
            'resume_ankit_sharma.pdf', 'resume_priya_verma.pdf', 'resume_rahul_gupta.pdf',
            'resume_sneha_reddy.pdf', 'resume_vikram_singh.pdf', 'resume_deepika_jain.pdf',
            'resume_arjun_nair.pdf', 'resume_kavya_menon.pdf',
        ];
        const mockFiles = mockNames.map(name => new File([''], name, { type: 'application/pdf' }));
        setFiles(mockFiles);
    };

    const removeFile = (index) => {
        setFiles(files.filter((_, i) => i !== index));
    };

    return (
        <div className="rounded-[16px] p-6 shadow-sm" style={{ backgroundColor: '#DCD9D4', backgroundImage: 'linear-gradient(to bottom, rgba(255,255,255,0.50) 0%, rgba(0,0,0,0.50) 100%), radial-gradient(at 50% 0%, rgba(255,255,255,0.10) 0%, rgba(0,0,0,0.50) 50%)', backgroundBlendMode: 'soft-light, screen' }}>
            <div className="flex items-center gap-3 mb-6">
                <div className="bg-blue-100 p-2.5 rounded-xl">
                    <span className="material-symbols-outlined text-blue-600 text-xl">work</span>
                </div>
                <div>
                    <h2 className="text-[18px] font-bold text-gray-900">Create Job Posting</h2>
                    <p className="text-[13px] text-gray-500">Define the role and upload candidate resumes</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-5">
                    <div>
                        <label className="block text-[13px] font-medium text-gray-700 mb-1.5">Job Title</label>
                        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Senior Frontend Developer" className="w-full px-4 py-3 bg-white/50 border border-white/60 rounded-xl text-[15px] focus:outline-none focus:ring-2 focus:ring-blue-500/50 placeholder-gray-400" />
                    </div>
                    <div>
                        <label className="block text-[13px] font-medium text-gray-700 mb-1.5">Job Description</label>
                        <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe the role, responsibilities, and requirements..." className="w-full px-4 py-3 bg-white/50 border border-white/60 rounded-xl text-[15px] focus:outline-none focus:ring-2 focus:ring-blue-500/50 placeholder-gray-400" rows={4} />
                    </div>
                    <div>
                        <label className="block text-[13px] font-medium text-gray-700 mb-1.5">Expected Competencies</label>
                        <div className="flex gap-2">
                            <input type="text" value={competency} onChange={(e) => setCompetency(e.target.value)} onKeyDown={handleKeyDown} placeholder="e.g. React, TypeScript..." className="flex-1 px-4 py-3 bg-white/50 border border-white/60 rounded-xl text-[15px] focus:outline-none focus:ring-2 focus:ring-blue-500/50 placeholder-gray-400" />
                            <button onClick={addCompetency} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-[14px] font-semibold transition-colors flex items-center gap-1">
                                <span className="material-symbols-outlined text-[16px]">add</span>Add
                            </button>
                        </div>
                        {competencies.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-3">
                                {competencies.map((c) => (
                                    <span key={c} className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-3 py-1 text-[13px] font-medium text-blue-700 border border-blue-200">
                                        {c}
                                        <button onClick={() => removeCompetency(c)} className="ml-1 hover:text-red-500 transition-colors">
                                            <span className="material-symbols-outlined text-[14px]">close</span>
                                        </button>
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="space-y-4">
                    <label className="block text-[13px] font-medium text-gray-700 mb-1.5">Upload Resumes (PDF)</label>

                    {/* Hidden real file input */}
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept=".pdf,application/pdf"
                        multiple
                        onChange={handleFileSelect}
                    />

                    <div
                        className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer ${dragOver ? 'border-blue-500 bg-blue-50/50' : 'border-white/60 hover:border-white/80 bg-white/20'}`}
                        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                        onDragLeave={() => setDragOver(false)}
                        onDrop={handleFileDrop}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <div className="flex flex-col items-center gap-3">
                            <div className="bg-blue-100 p-4 rounded-2xl border border-blue-200">
                                <span className="material-symbols-outlined text-blue-600 text-3xl">upload_file</span>
                            </div>
                            <div>
                                <p className="font-semibold text-gray-800">Drop PDF resumes here or click to browse</p>
                                <p className="text-[13px] text-gray-500 mt-1">Only .pdf files accepted • Multiple files supported</p>
                            </div>
                        </div>
                    </div>

                    {/* Quick demo button */}
                    <button onClick={(e) => { e.stopPropagation(); simulateFileUpload(); }} className="text-[13px] text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px]">science</span>
                        Load sample resumes (demo)
                    </button>

                    {files.length > 0 && (
                        <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                            <p className="text-[12px] font-medium text-gray-500 uppercase tracking-wider">{files.length} files uploaded</p>
                            {files.map((file, i) => (
                                <div key={i} className="flex items-center gap-3 rounded-lg bg-white/30 px-3 py-2 border border-white/40">
                                    <span className="material-symbols-outlined text-blue-600 text-[18px]">description</span>
                                    <div className="flex-1 min-w-0">
                                        <span className="text-[13px] text-gray-800 truncate block">{file.name || file}</span>
                                        {file.size > 0 && <span className="text-[11px] text-gray-400">{(file.size / 1024).toFixed(1)} KB</span>}
                                    </div>
                                    <button onClick={(e) => { e.stopPropagation(); removeFile(i); }} className="text-gray-400 hover:text-red-500 transition-colors">
                                        <span className="material-symbols-outlined text-[16px]">close</span>
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-8 flex justify-center">
                <button
                    onClick={() => onAnalyze({ title: title || 'Senior Frontend Developer', description, competencies, files: files.map(f => f.name || f) })}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl text-[15px] font-semibold transition-colors shadow-lg shadow-blue-900/20 flex items-center gap-2 disabled:opacity-50"
                    disabled={files.length === 0}
                >
                    <span className="material-symbols-outlined text-[20px]">smart_toy</span>
                    Analyze Fit with AI
                </button>
            </div>
        </div>
    );
}
