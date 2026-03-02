'use client';

import { useState, useEffect } from 'react';
import CreateJobForm from '@/components/company/CreateJobForm';
import CandidateLeaderboard from '@/components/company/CandidateLeaderboard';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { mockResumeTexts } from '@/data/mockResumes';

// Shared job store (simulates DB — all portals read from this)
const sharedJobStore = {
    jobs: [],
    addJob(job) { this.jobs.unshift(job); },
    getJobs() { return this.jobs; },
};

// Expose globally so student/college portals can access
if (typeof window !== 'undefined') {
    window.__placifyJobs = sharedJobStore;
}

export default function CompanyPortal() {
    const [analyzing, setAnalyzing] = useState(false);
    const [showLeaderboard, setShowLeaderboard] = useState(false);
    const [candidates, setCandidates] = useState([]);
    const [jobTitle, setJobTitle] = useState('');
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('dashboard');
    const [postedJobs, setPostedJobs] = useState([]);
    const [hiredCandidates, setHiredCandidates] = useState([]);

    useEffect(() => {
        // Load any previously posted jobs
        if (typeof window !== 'undefined' && window.__placifyJobs) {
            setPostedJobs(window.__placifyJobs.getJobs());
        }
    }, [activeTab]);

    const handleAnalyze = async (formData) => {
        const { title, description, competencies, files } = formData;
        setJobTitle(title);
        setAnalyzing(true);
        setShowLeaderboard(false);
        setError('');

        const jobDescription = [
            `Job Title: ${title}`,
            description ? `\nJob Description:\n${description}` : '',
            competencies.length > 0 ? `\nRequired Competencies: ${competencies.join(', ')}` : '',
        ].join('');

        const resumes = files.map((fileName, index) => ({
            id: `CND-${String(Math.floor(Math.random() * 9000) + 1000)}`,
            fileName,
            text: mockResumeTexts[fileName] || `Resume for candidate ${index + 1}. Generic resume with basic skills.`,
        }));

        try {
            const response = await fetch('/api/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ jobDescription, resumes }),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Analysis failed');

            setCandidates(data.candidates);
            setShowLeaderboard(true);

            // Save to shared store (simulates DB write)
            const newJob = {
                id: `JOB-${Date.now()}`,
                title: title || 'Senior Frontend Developer',
                description,
                competencies,
                resumeCount: files.length,
                candidatesShortlisted: data.candidates.filter(c => c.overallScore >= 70).length,
                status: 'active',
                postedAt: new Date().toISOString(),
                candidates: data.candidates,
            };
            sharedJobStore.addJob(newJob);
            setPostedJobs(sharedJobStore.getJobs());

        } catch (err) {
            console.error('Analysis error:', err);
            setError(err.message);
        } finally {
            setAnalyzing(false);
        }
    };

    const handleHire = (candidate) => {
        setHiredCandidates(prev => [...prev, { ...candidate, hiredAt: new Date().toISOString(), jobTitle }]);
    };

    const stats = [
        { label: 'Active Postings', value: String(postedJobs.filter(j => j.status === 'active').length || 3), icon: 'work', color: 'bg-blue-100 text-blue-600' },
        { label: 'Resumes Analyzed', value: String(postedJobs.reduce((sum, j) => sum + j.resumeCount, 0) || 247), icon: 'description', color: 'bg-purple-100 text-purple-600' },
        { label: 'Shortlisted', value: String(postedJobs.reduce((sum, j) => sum + j.candidatesShortlisted, 0) || 34), icon: 'group', color: 'bg-green-100 text-green-600' },
    ];

    return (
        <div className="min-h-screen min-w-[1280px] flex flex-col font-sans text-gray-900" style={{ backgroundImage: 'linear-gradient(to top, #cfd9df 0%, #e2ebf0 100%)' }}>
            {/* HEADER */}
            <header className="h-[64px] bg-[#1a1a1a] border-b border-white/10 flex items-center justify-between px-10 shrink-0 z-20">
                <div className="flex items-center gap-8">
                    <div className="flex items-center gap-3">
                        <div className="bg-white/20 p-2 rounded-lg"><span className="material-symbols-outlined text-white text-2xl">grid_view</span></div>
                        <span className="text-[24px] font-bold tracking-tight text-white">Placify</span>
                    </div>
                    <nav className="flex items-center gap-2 h-[64px]">
                        <a href="/student" className="text-[14px] font-medium text-white/70 px-4 h-full flex items-center hover:text-white border-b-2 border-transparent transition-colors">Student</a>
                        <a href="/company" className="text-[14px] font-medium text-white px-4 h-full flex items-center border-b-2 border-white">Company</a>
                        <a href="/college" className="text-[14px] font-medium text-white/70 px-4 h-full flex items-center hover:text-white border-b-2 border-transparent transition-colors">College</a>
                    </nav>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/20 rounded-full border border-green-500/30">
                        <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                        <span className="text-[13px] font-medium text-green-400">AI Online</span>
                    </div>
                    <div className="flex items-center gap-3 pl-4 border-l border-white/20">
                        <div className="h-10 w-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold text-sm border-2 border-white/20">HR</div>
                    </div>
                </div>
            </header>

            {/* BODY */}
            <div className="flex flex-1 overflow-hidden">
                {/* LEFT SIDEBAR */}
                <aside className="w-[260px] border-r border-white/30 flex flex-col shrink-0 overflow-y-auto py-[32px] px-[24px]" style={{ backgroundImage: 'linear-gradient(135deg, #fdfcfb 0%, #e2d1c3 100%)' }}>
                    <nav className="flex-1 space-y-2">
                        {[
                            { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
                            { id: 'postings', label: 'Job Postings', icon: 'work' },
                            { id: 'analytics', label: 'Analytics', icon: 'analytics' },
                        ].map(tab => (
                            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`w-full flex items-center px-4 py-2 text-[14px] font-medium rounded-lg transition-colors ${activeTab === tab.id ? 'sidebar-item-active' : 'text-gray-700 hover:bg-white/30 hover:text-gray-900'}`}>
                                <span className="material-symbols-outlined mr-3 text-[20px]">{tab.icon}</span>{tab.label}
                            </button>
                        ))}
                    </nav>
                    <div className="mt-auto pt-6 border-t border-white/40">
                        <p className="text-[13px] text-gray-500 mb-2">Hiring powered by</p>
                        <p className="text-[16px] font-bold text-gray-900">Gemini AI</p>
                        <p className="text-[12px] text-gray-400 mt-1">Blind hiring • Bias-free screening</p>
                    </div>
                </aside>

                {/* MAIN */}
                <main className="flex-grow p-[32px] overflow-y-auto">
                    <div className="max-w-5xl mx-auto">

                        {/* ===== DASHBOARD TAB ===== */}
                        {activeTab === 'dashboard' && (
                            <>
                                <div className="mb-6">
                                    <h1 className="text-[28px] font-bold text-gray-900">Company Hiring Portal</h1>
                                    <p className="text-[15px] text-gray-500 mt-1">AI-powered resume screening with blind hiring principles</p>
                                </div>

                                <div className="grid grid-cols-3 gap-4 mb-8">
                                    {stats.map((stat) => (
                                        <div key={stat.label} className="rounded-[16px] p-5 flex items-center gap-4 shadow-sm" style={{ backgroundColor: '#DCD9D4', backgroundImage: 'linear-gradient(to bottom, rgba(255,255,255,0.50) 0%, rgba(0,0,0,0.50) 100%), radial-gradient(at 50% 0%, rgba(255,255,255,0.10) 0%, rgba(0,0,0,0.50) 50%)', backgroundBlendMode: 'soft-light, screen' }}>
                                            <div className={`${stat.color} p-3 rounded-xl`}><span className="material-symbols-outlined text-2xl">{stat.icon}</span></div>
                                            <div>
                                                <p className="text-[24px] font-bold text-gray-900">{stat.value}</p>
                                                <p className="text-[13px] text-gray-500">{stat.label}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <CreateJobForm onAnalyze={handleAnalyze} />

                                {error && (
                                    <div className="mt-6 rounded-[16px] p-5 bg-red-50 border border-red-200">
                                        <div className="flex items-center gap-3">
                                            <span className="material-symbols-outlined text-red-500">error</span>
                                            <div><p className="font-semibold text-red-700">Analysis Failed</p><p className="text-[14px] text-red-500 mt-1">{error}</p></div>
                                        </div>
                                    </div>
                                )}

                                {analyzing && <div className="mt-8"><LoadingSpinner text="Analyzing Resumes with Gemini AI" /></div>}

                                {showLeaderboard && !analyzing && candidates.length > 0 && (
                                    <div className="mt-8"><CandidateLeaderboard candidates={candidates} jobTitle={jobTitle} resumeTexts={mockResumeTexts} onHire={handleHire} /></div>
                                )}
                            </>
                        )}

                        {/* ===== JOB POSTINGS TAB ===== */}
                        {activeTab === 'postings' && (
                            <>
                                <div className="mb-6">
                                    <h1 className="text-[28px] font-bold text-gray-900">Job Postings</h1>
                                    <p className="text-[15px] text-gray-500 mt-1">All jobs posted through this portal</p>
                                </div>
                                {postedJobs.length === 0 ? (
                                    <div className="text-center py-16">
                                        <span className="material-symbols-outlined text-[56px] text-gray-300 block mb-4">work_off</span>
                                        <p className="text-[16px] font-medium text-gray-400 mb-2">No jobs posted yet</p>
                                        <button onClick={() => setActiveTab('dashboard')} className="text-blue-600 font-semibold text-[14px] hover:underline">Go to Dashboard to create one</button>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {postedJobs.map(job => (
                                            <div key={job.id} className="rounded-[16px] p-6 shadow-sm" style={{ backgroundColor: '#DCD9D4', backgroundImage: 'linear-gradient(to bottom, rgba(255,255,255,0.50) 0%, rgba(0,0,0,0.50) 100%), radial-gradient(at 50% 0%, rgba(255,255,255,0.10) 0%, rgba(0,0,0,0.50) 50%)', backgroundBlendMode: 'soft-light, screen' }}>
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-4">
                                                        <div className="bg-blue-100 p-3 rounded-xl"><span className="material-symbols-outlined text-blue-600">work</span></div>
                                                        <div>
                                                            <h3 className="text-[16px] font-bold text-gray-900">{job.title}</h3>
                                                            <p className="text-[13px] text-gray-500">{job.resumeCount} resumes • {job.candidatesShortlisted} shortlisted • {new Date(job.postedAt).toLocaleDateString()}</p>
                                                        </div>
                                                    </div>
                                                    <span className={`px-3 py-1 rounded-full text-[12px] font-bold ${job.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{job.status}</span>
                                                </div>
                                                {job.competencies?.length > 0 && (
                                                    <div className="flex flex-wrap gap-2 mt-3">
                                                        {job.competencies.map(c => <span key={c} className="px-2.5 py-0.5 bg-white/30 rounded-full text-[12px] text-gray-600 border border-white/40">{c}</span>)}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </>
                        )}

                        {/* ===== ANALYTICS TAB ===== */}
                        {activeTab === 'analytics' && (
                            <>
                                <div className="mb-6">
                                    <h1 className="text-[28px] font-bold text-gray-900">Hiring Analytics</h1>
                                    <p className="text-[15px] text-gray-500 mt-1">Performance metrics and hiring funnel</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4 mb-8">
                                    {[
                                        { label: 'Total Jobs Posted', value: String(postedJobs.length || 3), icon: 'work', color: 'bg-blue-100 text-blue-600' },
                                        { label: 'Total Candidates Screened', value: String(postedJobs.reduce((s, j) => s + j.resumeCount, 0) || 247), icon: 'people', color: 'bg-purple-100 text-purple-600' },
                                        { label: 'Total Shortlisted', value: String(postedJobs.reduce((s, j) => s + j.candidatesShortlisted, 0) || 34), icon: 'how_to_reg', color: 'bg-green-100 text-green-600' },
                                        { label: 'Hired', value: String(hiredCandidates.length), icon: 'handshake', color: 'bg-orange-100 text-orange-600' },
                                    ].map(stat => (
                                        <div key={stat.label} className="rounded-[16px] p-5 flex items-center gap-4 shadow-sm" style={{ backgroundColor: '#DCD9D4', backgroundImage: 'linear-gradient(to bottom, rgba(255,255,255,0.50) 0%, rgba(0,0,0,0.50) 100%), radial-gradient(at 50% 0%, rgba(255,255,255,0.10) 0%, rgba(0,0,0,0.50) 50%)', backgroundBlendMode: 'soft-light, screen' }}>
                                            <div className={`${stat.color} p-3 rounded-xl`}><span className="material-symbols-outlined text-2xl">{stat.icon}</span></div>
                                            <div><p className="text-[24px] font-bold text-gray-900">{stat.value}</p><p className="text-[13px] text-gray-500">{stat.label}</p></div>
                                        </div>
                                    ))}
                                </div>

                                {/* Hiring Funnel */}
                                <div className="rounded-[16px] p-6 shadow-sm" style={{ backgroundColor: '#DCD9D4', backgroundImage: 'linear-gradient(to bottom, rgba(255,255,255,0.50) 0%, rgba(0,0,0,0.50) 100%), radial-gradient(at 50% 0%, rgba(255,255,255,0.10) 0%, rgba(0,0,0,0.50) 50%)', backgroundBlendMode: 'soft-light, screen' }}>
                                    <h3 className="text-[16px] font-bold text-gray-900 mb-4">Hiring Funnel</h3>
                                    {[
                                        { stage: 'Resumes Received', count: postedJobs.reduce((s, j) => s + j.resumeCount, 0) || 247, pct: 100 },
                                        { stage: 'AI Screened', count: postedJobs.reduce((s, j) => s + j.resumeCount, 0) || 247, pct: 100 },
                                        { stage: 'Shortlisted', count: postedJobs.reduce((s, j) => s + j.candidatesShortlisted, 0) || 34, pct: 14 },
                                        { stage: 'Interviewed', count: 12, pct: 5 },
                                        { stage: 'Hired', count: hiredCandidates.length || 5, pct: 2 },
                                    ].map((step, i) => (
                                        <div key={step.stage} className="flex items-center gap-4 mb-3">
                                            <span className="text-[14px] font-medium text-gray-700 w-40 shrink-0">{step.stage}</span>
                                            <div className="flex-1 h-3 bg-white/40 rounded-full overflow-hidden"><div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${step.pct}%` }}></div></div>
                                            <span className="text-[14px] font-bold text-gray-900 w-12 text-right">{step.count}</span>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </main>

                {/* RIGHT SIDEBAR */}
                <aside className="w-[300px] shrink-0 mt-[32px] mr-[24px] mb-[32px]">
                    <div className="rounded-[16px] p-[28px] h-full overflow-y-auto border border-white/40 shadow-sm" style={{ backgroundImage: 'linear-gradient(135deg, #fdfcfb 0%, #e2d1c3 100%)' }}>
                        <h3 className="text-[15px] font-bold text-gray-900 mb-6">Recent Activity</h3>
                        <div className="space-y-4">
                            {(hiredCandidates.length > 0 ? hiredCandidates.slice(0, 2).map((c, i) => ({ text: `${c.id} hired for ${c.jobTitle}`, time: 'Just now', icon: 'handshake', color: 'bg-green-100 text-green-600' })) : []).concat([
                                { text: 'Resume batch uploaded', time: '2 min ago', icon: 'upload_file', color: 'bg-blue-100 text-blue-600' },
                                { text: 'AI analysis completed', time: '15 min ago', icon: 'smart_toy', color: 'bg-purple-100 text-purple-600' },
                                { text: '3 candidates shortlisted', time: '1 hour ago', icon: 'how_to_reg', color: 'bg-green-100 text-green-600' },
                            ]).slice(0, 4).map((item, i) => (
                                <div key={i} className="flex items-start gap-3">
                                    <div className={`${item.color} p-2 rounded-lg shrink-0`}><span className="material-symbols-outlined text-[18px]">{item.icon}</span></div>
                                    <div><p className="text-[14px] text-gray-800 font-medium">{item.text}</p><p className="text-[12px] text-gray-400">{item.time}</p></div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-8 pt-6 border-t border-white/40">
                            <h3 className="text-[15px] font-bold text-gray-900 mb-3">Quick Stats</h3>
                            <div className="space-y-3">
                                <div><div className="flex justify-between text-[13px] mb-1"><span className="text-gray-600">Avg Match Score</span><span className="font-bold text-gray-900">84%</span></div><div className="h-2 bg-black/10 rounded-full overflow-hidden"><div className="h-full bg-blue-500 rounded-full" style={{ width: '84%' }}></div></div></div>
                                <div><div className="flex justify-between text-[13px] mb-1"><span className="text-gray-600">Response Rate</span><span className="font-bold text-gray-900">92%</span></div><div className="h-2 bg-black/10 rounded-full overflow-hidden"><div className="h-full bg-green-500 rounded-full" style={{ width: '92%' }}></div></div></div>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}
