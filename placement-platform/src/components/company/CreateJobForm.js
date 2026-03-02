'use client';

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
            'resume_ankit_sharma.pdf', 'resume_priya_verma.pdf', 'resume_rahul_gupta.pdf',
            'resume_sneha_reddy.pdf', 'resume_vikram_singh.pdf', 'resume_deepika_jain.pdf',
            'resume_arjun_nair.pdf', 'resume_kavya_menon.pdf',
        ];
        setFiles(mockFiles);
    };

    return (
        <div className="bg-white rounded-[16px] p-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="bg-blue-100 p-2.5 rounded-xl">
                    <span className="material-symbols-outlined text-[#2563EB] text-xl">work</span>
                </div>
                <div>
                    <h2 className="text-[18px] font-bold text-gray-900">Create Job Posting</h2>
                    <p className="text-[13px] text-gray-500">Define the role and upload candidate resumes</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-5">
                    <div>
                        <label className="block text-[13px] font-medium text-gray-600 mb-1.5">Job Title</label>
                        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Senior Frontend Developer" className="input-field" />
                    </div>
                    <div>
                        <label className="block text-[13px] font-medium text-gray-600 mb-1.5">Job Description</label>
                        <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe the role, responsibilities, and requirements..." className="input-field" rows={4} />
                    </div>
                    <div>
                        <label className="block text-[13px] font-medium text-gray-600 mb-1.5">Expected Competencies</label>
                        <div className="flex gap-2">
                            <input type="text" value={competency} onChange={(e) => setCompetency(e.target.value)} onKeyDown={handleKeyDown} placeholder="e.g. React, TypeScript..." className="input-field flex-1" />
                            <button onClick={addCompetency} className="btn-secondary flex items-center gap-1">
                                <span className="material-symbols-outlined text-[16px]">add</span>Add
                            </button>
                        </div>
                        {competencies.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-3">
                                {competencies.map((c) => (
                                    <span key={c} className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-[13px] font-medium text-[#2563EB] border border-blue-200">
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
                    <label className="block text-[13px] font-medium text-gray-600 mb-1.5">Upload Resumes (PDF)</label>
                    <div
                        className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer ${dragOver ? 'border-[#2563EB] bg-blue-50' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'}`}
                        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                        onDragLeave={() => setDragOver(false)}
                        onDrop={handleFileDrop}
                        onClick={simulateFileUpload}
                    >
                        <div className="flex flex-col items-center gap-3">
                            <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
                                <span className="material-symbols-outlined text-[#2563EB] text-3xl">upload_file</span>
                            </div>
                            <div>
                                <p className="font-semibold text-gray-700">Drop PDF resumes here</p>
                                <p className="text-[13px] text-gray-400 mt-1">or click to upload (simulated)</p>
                            </div>
                        </div>
                    </div>

                    {files.length > 0 && (
                        <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                            <p className="text-[12px] font-medium text-gray-400 uppercase tracking-wider">{files.length} files uploaded</p>
                            {files.map((file, i) => (
                                <div key={i} className="flex items-center gap-3 rounded-lg bg-gray-50 px-3 py-2 border border-gray-100">
                                    <span className="material-symbols-outlined text-[#2563EB] text-[18px]">description</span>
                                    <span className="text-[13px] text-gray-700 truncate flex-1">{file}</span>
                                    <button onClick={() => setFiles(files.filter((_, idx) => idx !== i))} className="text-gray-400 hover:text-red-500 transition-colors">
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
                    onClick={() => onAnalyze({ title: title || 'Senior Frontend Developer', description, competencies, files })}
                    className="btn-primary flex items-center gap-2 text-[15px] px-8 py-3"
                    disabled={files.length === 0}
                    style={{ opacity: files.length === 0 ? 0.5 : 1 }}
                >
                    <span className="material-symbols-outlined text-[20px]">smart_toy</span>
                    Analyze Fit with AI
                </button>
            </div>
        </div>
    );
}
