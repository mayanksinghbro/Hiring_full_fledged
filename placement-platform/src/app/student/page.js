'use client';

import React, { useState, useRef, useEffect } from 'react';
import { mockGapAnalysis, defaultGapData } from '@/data/mockCareerData';

const roles = ['Frontend Dev', 'Backend Dev', 'Full Stack Dev', 'Data Scientist', 'ML Engineer', 'DevOps Engineer'];
const companies = ['Google', 'Microsoft', 'Amazon', 'Meta', 'Apple', 'Flipkart', 'Razorpay'];

export default function StudentPortal() {
    const [role, setRole] = useState('Full Stack Dev');
    const [company, setCompany] = useState('Google');
    const [resumeFile, setResumeFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [careerData, setCareerData] = useState(null);
    const [activeTab, setActiveTab] = useState('dashboard');
    const [searchQuery, setSearchQuery] = useState('');
    const [showNotifications, setShowNotifications] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const [editingRole, setEditingRole] = useState(false);
    const [editingCompany, setEditingCompany] = useState(false);
    const fileInputRef = useRef(null);

    // Load default career data on mount
    useEffect(() => {
        loadCareerData(role, company);
    }, []);

    const loadCareerData = (r, c) => {
        const roleData = mockGapAnalysis[r];
        if (roleData && roleData[c]) {
            setCareerData(roleData[c]);
        } else {
            setCareerData(defaultGapData);
        }
    };

    const handleGenerate = () => {
        setLoading(true);
        setTimeout(() => {
            loadCareerData(role, company);
            setLoading(false);
            setActiveTab('dashboard');
        }, 1500);
    };

    const handleRoleChange = (newRole) => {
        setRole(newRole);
        setEditingRole(false);
        loadCareerData(newRole, company);
    };

    const handleCompanyChange = (newCompany) => {
        setCompany(newCompany);
        setEditingCompany(false);
        loadCareerData(role, newCompany);
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file && file.type === 'application/pdf') {
            setResumeFile(file);
        } else if (file) {
            alert('Please upload a valid PDF file.');
        }
    };

    // Calculate match percentage from gaps
    const matchPercent = careerData ? Math.max(30, 100 - careerData.gaps.length * 12) : 72;

    // Skill percentages from gaps
    const getSkillPercent = (severity) => {
        if (severity === 'low') return 80;
        if (severity === 'medium') return 55;
        return 35;
    };

    const notifications = [
        { id: 1, text: 'New roadmap recommendation available', time: '2m ago', unread: true },
        { id: 2, text: 'System Design course completed by 200+ peers', time: '1h ago', unread: true },
        { id: 3, text: 'Google updated their hiring criteria', time: '3h ago', unread: false },
    ];

    return (
        <div className="min-h-screen bg-[#F0F2F5] min-w-[1280px] flex flex-col font-sans text-gray-900">
            {/* ===== HEADER ===== */}
            <header className="h-[64px] bg-white border-b border-gray-200 flex items-center justify-between px-10 shrink-0 z-20">
                <div className="flex items-center gap-8">
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-50 p-2 rounded-lg">
                            <span className="material-symbols-outlined text-[#2563EB] text-2xl">grid_view</span>
                        </div>
                        <span className="text-[20px] font-bold tracking-tight text-gray-900">Placify</span>
                    </div>
                    <nav className="flex items-center gap-2 h-[64px]">
                        <a href="/student" className="text-[14px] font-medium text-[#2563EB] px-4 h-full flex items-center border-b-2 border-[#2563EB]">Explore</a>
                        <a href="/company" className="text-[14px] font-medium text-[#6B7280] px-4 h-full flex items-center hover:text-[#2563EB] border-b-2 border-transparent">Company</a>
                        <a href="/college" className="text-[14px] font-medium text-[#6B7280] px-4 h-full flex items-center hover:text-[#2563EB] border-b-2 border-transparent">College</a>
                    </nav>
                </div>
                <div className="flex-1 flex justify-center">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <span className="material-symbols-outlined text-gray-400">search</span>
                        </div>
                        <input
                            className="block w-[400px] pl-[44px] pr-5 py-2.5 bg-[#F3F4F6] border-none rounded-[50px] text-[15px] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                            placeholder="Explore career paths..."
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <button onClick={() => { setShowNotifications(!showNotifications); setShowProfile(false); }} className="p-2 text-gray-500 hover:text-gray-700 relative">
                            <span className="material-symbols-outlined">notifications</span>
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                        </button>
                        {showNotifications && (
                            <div className="absolute right-0 top-12 w-[320px] bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden">
                                <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center">
                                    <span className="font-bold text-[14px]">Notifications</span>
                                    <span className="text-[12px] text-[#2563EB] font-medium cursor-pointer">Mark all read</span>
                                </div>
                                {notifications.map(n => (
                                    <div key={n.id} className={`px-4 py-3 hover:bg-gray-50 cursor-pointer flex gap-3 ${n.unread ? 'bg-blue-50/50' : ''}`}>
                                        <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${n.unread ? 'bg-[#2563EB]' : 'bg-transparent'}`}></div>
                                        <div>
                                            <p className="text-[13px] text-gray-800">{n.text}</p>
                                            <p className="text-[12px] text-gray-400 mt-0.5">{n.time}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="relative">
                        <div className="flex items-center gap-3 pl-4 border-l border-gray-200 cursor-pointer" onClick={() => { setShowProfile(!showProfile); setShowNotifications(false); }}>
                            <div className="relative">
                                <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-sm border-2 border-white shadow-sm">ST</div>
                                <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-white"></span>
                            </div>
                        </div>
                        {showProfile && (
                            <div className="absolute right-0 top-14 w-[200px] bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden">
                                <div className="px-4 py-3 border-b border-gray-100">
                                    <p className="font-bold text-[14px]">Alex Student</p>
                                    <p className="text-[12px] text-gray-400">alex@university.edu</p>
                                </div>
                                <a href="/student" className="block px-4 py-2.5 text-[13px] text-gray-700 hover:bg-gray-50">
                                    <span className="material-symbols-outlined text-[16px] mr-2 align-middle">person</span>My Profile
                                </a>
                                <a href="#" className="block px-4 py-2.5 text-[13px] text-gray-700 hover:bg-gray-50">
                                    <span className="material-symbols-outlined text-[16px] mr-2 align-middle">settings</span>Settings
                                </a>
                                <div className="border-t border-gray-100">
                                    <a href="/" className="block px-4 py-2.5 text-[13px] text-red-500 hover:bg-red-50">
                                        <span className="material-symbols-outlined text-[16px] mr-2 align-middle">logout</span>Sign Out
                                    </a>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* ===== BODY ===== */}
            <div className="flex flex-1 overflow-hidden">
                {/* LEFT SIDEBAR */}
                <aside className="w-[260px] bg-white border-r border-gray-200 flex flex-col shrink-0 overflow-y-auto py-[32px] px-[24px]">
                    <nav className="flex-1 space-y-2 mb-8">
                        <button onClick={() => setActiveTab('dashboard')} className={`w-full flex items-center px-4 py-2 text-[14px] font-medium rounded-lg ${activeTab === 'dashboard' ? 'sidebar-item-active' : 'text-[#6B7280] hover:bg-gray-50 hover:text-[#2563EB]'}`}>
                            <span className="material-symbols-outlined mr-3 text-[20px]">dashboard</span>Dashboard
                        </button>
                        <button onClick={() => setActiveTab('skills')} className={`w-full flex items-center px-4 py-2 text-[14px] font-medium rounded-lg ${activeTab === 'skills' ? 'sidebar-item-active' : 'text-[#6B7280] hover:bg-gray-50 hover:text-[#2563EB]'}`}>
                            <span className="material-symbols-outlined mr-3 text-[20px]">school</span>Skills Gap
                        </button>
                        <button onClick={() => setActiveTab('jobs')} className={`w-full flex items-center px-4 py-2 text-[14px] font-medium rounded-lg ${activeTab === 'jobs' ? 'sidebar-item-active' : 'text-[#6B7280] hover:bg-gray-50 hover:text-[#2563EB]'}`}>
                            <span className="material-symbols-outlined mr-3 text-[20px]">work</span>Jobs
                        </button>
                    </nav>
                    <div className="mt-auto">
                        <h3 className="text-[22px] font-bold text-gray-900 leading-[1.4] mb-4">
                            I want to be a{' '}
                            {editingRole ? (
                                <select className="text-[#2563EB] font-bold bg-blue-50 rounded px-1 border border-blue-200 text-[18px]" value={role} onChange={(e) => handleRoleChange(e.target.value)} onBlur={() => setEditingRole(false)} autoFocus>
                                    {roles.map(r => <option key={r} value={r}>{r}</option>)}
                                </select>
                            ) : (
                                <span className="text-[#2563EB] cursor-pointer hover:underline" onClick={() => setEditingRole(true)}>{role}</span>
                            )}
                            {' '}at{' '}
                            {editingCompany ? (
                                <select className="text-[#2563EB] font-bold bg-blue-50 rounded px-1 border border-blue-200 text-[18px] underline decoration-2 underline-offset-4" value={company} onChange={(e) => handleCompanyChange(e.target.value)} onBlur={() => setEditingCompany(false)} autoFocus>
                                    {companies.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            ) : (
                                <span className="text-[#2563EB] underline decoration-2 underline-offset-4 cursor-pointer hover:text-blue-700" onClick={() => setEditingCompany(true)}>{company}.</span>
                            )}
                        </h3>
                        <div
                            className="inline-flex items-center gap-[6px] px-[14px] py-[6px] rounded-[50px] text-[13px] font-medium bg-[#F3F4F6] text-gray-700 mb-5 cursor-pointer hover:bg-gray-200"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <span className="material-symbols-outlined text-[16px] text-gray-500">attach_file</span>
                            {resumeFile ? resumeFile.name : 'Upload Resume'}
                            <input type="file" accept=".pdf" ref={fileInputRef} className="hidden" onChange={handleFileUpload} />
                        </div>
                        <button
                            onClick={handleGenerate}
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-[8px] bg-[#2563EB] hover:bg-blue-700 text-white p-[14px] rounded-[12px] text-[16px] font-semibold mt-5 disabled:opacity-50 transition-all"
                        >
                            {loading ? (
                                <><span className="material-symbols-outlined text-[20px] animate-spin">progress_activity</span>Analyzing...</>
                            ) : (
                                <><span className="material-symbols-outlined text-[20px]">timeline</span>Plot My Route</>
                            )}
                        </button>
                    </div>
                </aside>

                {/* MAIN CONTENT */}
                <main className="flex-grow p-[32px] overflow-y-auto">
                    <div className="max-w-5xl mx-auto">

                        {/* ===== DASHBOARD TAB ===== */}
                        {activeTab === 'dashboard' && (
                            <>
                                <div className="mb-6">
                                    <h1 className="text-[28px] font-bold text-gray-900">Good morning, Alex! 👋</h1>
                                    <p className="text-[15px] text-gray-500 mt-1">You&apos;re making great progress towards your goal.</p>
                                </div>

                                {/* Readiness Dashboard */}
                                <div className="bg-white rounded-[16px] p-[28px] mb-[24px]">
                                    <div className="flex items-center justify-between mb-8">
                                        <h2 className="text-[20px] font-bold text-gray-900">Readiness Dashboard</h2>
                                        <button onClick={() => setActiveTab('skills')} className="text-[15px] text-[#2563EB] font-medium hover:underline">View details</button>
                                    </div>
                                    <div className="flex items-center gap-[40px]">
                                        <div className="relative w-[120px] h-[120px] shrink-0">
                                            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                                                <path className="fill-none stroke-gray-100 stroke-[3.8]" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                                                <path className="fill-none stroke-[#2563EB] stroke-[3.8] stroke-linecap-round" strokeDasharray={`${matchPercent}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                                            </svg>
                                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                                <span className="text-[24px] font-bold text-gray-900 leading-none">{matchPercent}%</span>
                                                <span className="text-[13px] text-gray-500 font-medium mt-1 uppercase">Match</span>
                                            </div>
                                        </div>
                                        <div className="flex-1 flex flex-col gap-[16px]">
                                            {careerData && careerData.gaps.slice(0, 3).map((gap, i) => (
                                                <div key={i} className="flex items-center gap-[16px]">
                                                    <span className="text-[15px] font-semibold text-gray-900 w-32 shrink-0 truncate">{gap.skill.split(' ').slice(0, 3).join(' ')}</span>
                                                    <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                                                        <div className={`h-full rounded-full ${gap.severity === 'high' ? 'bg-orange-500' : gap.severity === 'medium' ? 'bg-blue-400' : 'bg-green-500'}`} style={{ width: `${getSkillPercent(gap.severity)}%` }}></div>
                                                    </div>
                                                    <span className={`px-2.5 py-1 rounded-full text-[13px] font-bold shrink-0 ${gap.severity === 'high' ? 'bg-orange-100 text-orange-700' : gap.severity === 'medium' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                                                        {gap.severity === 'high' ? 'High Priority' : gap.severity === 'medium' ? 'In Progress' : 'Quick Win'}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Route Timeline */}
                                <div className="bg-white rounded-[16px] p-[28px]">
                                    <div className="flex items-center justify-between mb-6">
                                        <h2 className="text-[20px] font-bold text-gray-900">Your Route</h2>
                                        <span className="text-[15px] text-gray-500">Est. {careerData?.roadmap?.length || 3} phases</span>
                                    </div>
                                    <div className="relative pl-4">
                                        <div className="absolute left-[23px] top-8 bottom-8 w-0.5 bg-gray-200"></div>
                                        {careerData && careerData.roadmap.map((step, i) => (
                                            <div key={i} className="relative flex gap-[16px] py-[20px]">
                                                <div className={`relative z-10 w-4 h-4 mt-1 rounded-full ring-4 ring-white shrink-0 ${i === 0 ? 'bg-green-500' : i < careerData.roadmap.length - 1 ? 'bg-[#2563EB]' : 'bg-gray-300'}`}></div>
                                                <div className={`flex-1 ${i === careerData.roadmap.length - 1 ? 'opacity-60' : ''}`}>
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <h3 className="text-[16px] font-bold text-gray-900">Station {i + 1}: {step.title}</h3>
                                                        <span className={`px-2.5 py-0.5 rounded-full text-[13px] font-medium ${i === 0 ? 'bg-green-100 text-green-700' : i < careerData.roadmap.length - 1 ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>
                                                            {i === 0 ? 'Completed' : i < careerData.roadmap.length - 1 ? 'In Progress' : 'Locked'}
                                                        </span>
                                                    </div>
                                                    <p className="text-[15px] text-gray-500">{step.description}</p>
                                                    <p className="text-[13px] text-gray-400 mt-1">{step.phase}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}

                        {/* ===== SKILLS GAP TAB ===== */}
                        {activeTab === 'skills' && (
                            <>
                                <div className="mb-6">
                                    <h1 className="text-[28px] font-bold text-gray-900">Skills Gap Analysis</h1>
                                    <p className="text-[15px] text-gray-500 mt-1">For {role} at {company}</p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {careerData && careerData.gaps.map((gap, i) => (
                                        <div key={i} className="bg-white rounded-[16px] p-6 hover:shadow-md transition-shadow">
                                            <div className="flex items-start justify-between mb-3">
                                                <h3 className="text-[16px] font-bold text-gray-900">{gap.skill}</h3>
                                                <span className={`px-2.5 py-1 rounded-full text-[12px] font-bold ${gap.severity === 'high' ? 'bg-red-100 text-red-700' : gap.severity === 'medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                                                    {gap.severity}
                                                </span>
                                            </div>
                                            <p className="text-[14px] text-gray-500 leading-relaxed">{gap.description}</p>
                                            <div className="mt-4 h-2 bg-gray-100 rounded-full overflow-hidden">
                                                <div className={`h-full rounded-full score-bar ${gap.severity === 'high' ? 'bg-red-500' : gap.severity === 'medium' ? 'bg-yellow-500' : 'bg-green-500'}`} style={{ width: `${100 - getSkillPercent(gap.severity)}%`, animationDelay: `${i * 0.1}s` }}></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                {careerData && careerData.courses && (
                                    <div className="mt-8">
                                        <h2 className="text-[20px] font-bold text-gray-900 mb-4">Recommended Courses</h2>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {careerData.courses.map((course, i) => (
                                                <a key={i} href={course.url} target="_blank" rel="noopener noreferrer" className="bg-white rounded-[16px] p-5 hover:shadow-md transition-all border border-transparent hover:border-blue-200 block">
                                                    <div className="flex items-start gap-3">
                                                        <div className="bg-blue-100 p-2 rounded-lg text-[#2563EB] shrink-0">
                                                            <span className="material-symbols-outlined text-xl">play_circle</span>
                                                        </div>
                                                        <div className="flex-1">
                                                            <h4 className="font-bold text-[15px] text-gray-900 mb-1">{course.title}</h4>
                                                            <p className="text-[13px] text-gray-500">{course.platform} • {course.instructor}</p>
                                                            <div className="flex items-center gap-3 mt-2">
                                                                <span className="text-[13px] text-yellow-600 font-medium">★ {course.rating}</span>
                                                                <span className="text-[12px] text-gray-400">{course.duration}</span>
                                                                <span className="text-[12px] font-bold text-[#2563EB]">{course.price}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </>
                        )}

                        {/* ===== JOBS TAB ===== */}
                        {activeTab === 'jobs' && (
                            <>
                                <div className="mb-6">
                                    <h1 className="text-[28px] font-bold text-gray-900">Matching Jobs</h1>
                                    <p className="text-[15px] text-gray-500 mt-1">Opportunities matching your profile as a {role}</p>
                                </div>
                                {[
                                    { title: `${role} Intern`, co: company, pkg: '₹18 LPA', match: matchPercent, loc: 'Bangalore', type: 'Full-time' },
                                    { title: `Junior ${role}`, co: 'Microsoft', pkg: '₹22 LPA', match: matchPercent - 8, loc: 'Hyderabad', type: 'Full-time' },
                                    { title: `${role}`, co: 'Flipkart', pkg: '₹16 LPA', match: matchPercent - 15, loc: 'Bangalore', type: 'Full-time' },
                                    { title: `${role} (Contract)`, co: 'Razorpay', pkg: '₹14 LPA', match: matchPercent - 20, loc: 'Remote', type: 'Contract' },
                                ].map((job, i) => (
                                    <div key={i} className="bg-white rounded-[16px] p-6 mb-4 hover:shadow-md transition-shadow">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="bg-blue-50 w-12 h-12 rounded-xl flex items-center justify-center">
                                                    <span className="material-symbols-outlined text-[#2563EB]">work</span>
                                                </div>
                                                <div>
                                                    <h3 className="text-[16px] font-bold text-gray-900">{job.title}</h3>
                                                    <p className="text-[14px] text-gray-500">{job.co} • {job.loc} • {job.type}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className="text-right">
                                                    <p className="text-[16px] font-bold text-gray-900">{job.pkg}</p>
                                                    <p className="text-[13px] text-green-600 font-medium">{job.match}% match</p>
                                                </div>
                                                <button className="bg-[#2563EB] hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-[14px] font-semibold transition-colors">
                                                    Apply
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </>
                        )}

                    </div>
                </main>

                {/* RIGHT SIDEBAR */}
                <aside className="w-[300px] shrink-0 mt-[32px] mr-[24px] mb-[32px]">
                    <div className="bg-white rounded-[16px] p-[28px] h-full overflow-y-auto">
                        <h3 className="text-[15px] font-bold text-gray-900 mb-6">Suggested Next Steps</h3>
                        <div className="space-y-4">
                            {careerData && careerData.courses?.slice(0, 2).map((course, i) => (
                                <a key={i} href={course.url} target="_blank" rel="noopener noreferrer" className="bg-gray-50 hover:bg-gray-100 p-4 rounded-xl border border-gray-100 cursor-pointer block transition-colors">
                                    <div className="flex items-start gap-3 mb-3">
                                        <div className={`${i === 0 ? 'bg-orange-100 text-orange-600' : 'bg-purple-100 text-purple-600'} p-2 rounded-lg shrink-0`}>
                                            <span className="material-symbols-outlined text-xl">{i === 0 ? 'book' : 'code_blocks'}</span>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-[15px] text-gray-900 leading-tight mb-1">{course.title}</h4>
                                            <p className="text-[13px] text-gray-500">{course.platform} • {course.instructor}</p>
                                        </div>
                                    </div>
                                    <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                                        <div className={`${i === 0 ? 'bg-orange-500' : 'bg-purple-500'} h-full`} style={{ width: `${(i + 1) * 25}%` }}></div>
                                    </div>
                                </a>
                            ))}
                            {(!careerData || !careerData.courses) && (
                                <>
                                    <div className="bg-gray-50 hover:bg-gray-100 p-4 rounded-xl border border-gray-100 cursor-pointer">
                                        <div className="flex items-start gap-3 mb-3">
                                            <div className="bg-orange-100 p-2 rounded-lg text-orange-600 shrink-0">
                                                <span className="material-symbols-outlined text-xl">book</span>
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-[15px] text-gray-900 leading-tight mb-1">Read &quot;Designing Data-Intensive Apps&quot;</h4>
                                                <p className="text-[13px] text-gray-500">Chapter 4: Encoding</p>
                                            </div>
                                        </div>
                                        <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden"><div className="bg-orange-500 h-full w-1/4"></div></div>
                                    </div>
                                    <div className="bg-gray-50 hover:bg-gray-100 p-4 rounded-xl border border-gray-100 cursor-pointer">
                                        <div className="flex items-start gap-3 mb-3">
                                            <div className="bg-purple-100 p-2 rounded-lg text-purple-600 shrink-0">
                                                <span className="material-symbols-outlined text-xl">code_blocks</span>
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-[15px] text-gray-900 leading-tight mb-1">LeetCode Daily Challenge</h4>
                                                <p className="text-[13px] text-gray-500">Medium • Array</p>
                                            </div>
                                        </div>
                                        <div className="flex justify-end">
                                            <span className="text-[13px] font-bold text-[#2563EB] bg-blue-50 px-2.5 py-1 rounded-md">Start Now</span>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                        <div className="mt-8 pt-6 border-t border-gray-100">
                            <h3 className="text-[15px] font-bold text-gray-900 mb-4">Weekly Activity</h3>
                            <div className="grid grid-cols-7 gap-1.5">
                                {['bg-green-200', 'bg-green-400', 'bg-gray-100', 'bg-green-500', 'bg-green-300', 'bg-gray-100', 'bg-gray-100'].map((c, i) => (
                                    <div key={i} className={`h-10 w-full rounded ${c} hover:ring-2 hover:ring-blue-300 cursor-pointer transition-all`} title={['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}></div>
                                ))}
                            </div>
                            <div className="flex justify-between mt-2 text-[13px] text-gray-500">
                                <span>Mon</span><span>Sun</span>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}
