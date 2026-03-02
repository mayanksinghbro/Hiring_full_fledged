'use client';

import { useState, useEffect } from 'react';
import BatchAnalytics from '@/components/college/BatchAnalytics';
import CompanyMapping from '@/components/college/CompanyMapping';
import PlacementCharts from '@/components/college/PlacementCharts';
import { batchStats } from '@/data/mockCollegeData';

export default function CollegePortal() {
    const [activeTab, setActiveTab] = useState('overview');
    const [recentPlacements, setRecentPlacements] = useState([
        { id: 1, student: 'STU-2847', company: 'Google', role: 'SDE Intern', package: '₹18 LPA', date: '2026-02-28' },
        { id: 2, student: 'STU-1923', company: 'Amazon', role: 'SDE-1', package: '₹28 LPA', date: '2026-02-25' },
        { id: 3, student: 'STU-3461', company: 'Microsoft', role: 'Full Stack', package: '₹22 LPA', date: '2026-02-20' },
        { id: 4, student: 'STU-5102', company: 'Flipkart', role: 'Backend Eng', package: '₹16 LPA', date: '2026-02-18' },
    ]);

    // Check for cross-portal data (jobs posted by companies)
    const [companyJobs, setCompanyJobs] = useState([]);
    useEffect(() => {
        if (typeof window !== 'undefined' && window.__placifyJobs) {
            setCompanyJobs(window.__placifyJobs.getJobs());
        }
    }, [activeTab]);

    const tabs = [
        { id: 'overview', label: 'Overview', icon: 'dashboard' },
        { id: 'analytics', label: 'Analytics', icon: 'analytics' },
        { id: 'companies', label: 'Companies', icon: 'apartment' },
        { id: 'students', label: 'Students', icon: 'groups' },
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
                        <a href="/company" className="text-[14px] font-medium text-white/70 px-4 h-full flex items-center hover:text-white border-b-2 border-transparent transition-colors">Company</a>
                        <a href="/college" className="text-[14px] font-medium text-white px-4 h-full flex items-center border-b-2 border-white">College</a>
                    </nav>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/20 rounded-full border border-green-500/30">
                        <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                        <span className="text-[13px] font-medium text-green-400">AI Online</span>
                    </div>
                    <div className="flex items-center gap-3 pl-4 border-l border-white/20">
                        <div className="h-10 w-10 rounded-full bg-violet-500 flex items-center justify-center text-white font-bold text-sm border-2 border-white/20">PC</div>
                    </div>
                </div>
            </header>

            {/* BODY */}
            <div className="flex flex-1 overflow-hidden">
                {/* LEFT SIDEBAR */}
                <aside className="w-[260px] border-r border-white/30 flex flex-col shrink-0 overflow-y-auto py-[32px] px-[24px]" style={{ backgroundImage: 'linear-gradient(135deg, #fdfcfb 0%, #e2d1c3 100%)' }}>
                    <nav className="flex-1 space-y-2">
                        {tabs.map(tab => (
                            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`w-full flex items-center px-4 py-2 text-[14px] font-medium rounded-lg transition-colors ${activeTab === tab.id ? 'sidebar-item-active' : 'text-gray-700 hover:bg-white/30 hover:text-gray-900'}`}>
                                <span className="material-symbols-outlined mr-3 text-[20px]">{tab.icon}</span>{tab.label}
                            </button>
                        ))}
                    </nav>
                    <div className="mt-auto pt-6 border-t border-white/40">
                        <p className="text-[13px] text-gray-500 mb-2">Current Batch</p>
                        <p className="text-[16px] font-bold text-gray-900">2025-26</p>
                        <p className="text-[12px] text-gray-400 mt-1">{batchStats.totalStudents.toLocaleString()} students enrolled</p>
                    </div>
                </aside>

                {/* MAIN */}
                <main className="flex-grow p-[32px] overflow-y-auto">
                    <div className="max-w-5xl mx-auto">

                        {/* ===== OVERVIEW TAB ===== */}
                        {activeTab === 'overview' && (
                            <>
                                <div className="mb-6">
                                    <h1 className="text-[28px] font-bold text-gray-900">College Placement Cell</h1>
                                    <p className="text-[15px] text-gray-500 mt-1">Macro-level batch analytics and AI-powered company-student mapping</p>
                                </div>
                                <BatchAnalytics />
                                {/* Recent Placements from cross-portal */}
                                <div className="mt-8 rounded-[16px] p-6 shadow-sm" style={{ backgroundColor: '#DCD9D4', backgroundImage: 'linear-gradient(to bottom, rgba(255,255,255,0.50) 0%, rgba(0,0,0,0.50) 100%), radial-gradient(at 50% 0%, rgba(255,255,255,0.10) 0%, rgba(0,0,0,0.50) 50%)', backgroundBlendMode: 'soft-light, screen' }}>
                                    <h3 className="text-[16px] font-bold text-gray-900 mb-4">Recent Placements</h3>
                                    <div className="space-y-3">
                                        {recentPlacements.map(p => (
                                            <div key={p.id} className="flex items-center justify-between p-3 rounded-xl bg-white/20 border border-white/30">
                                                <div className="flex items-center gap-3">
                                                    <div className="bg-green-100 p-2 rounded-lg"><span className="material-symbols-outlined text-green-600 text-[18px]">how_to_reg</span></div>
                                                    <div><p className="text-[14px] font-medium text-gray-900">{p.student}</p><p className="text-[12px] text-gray-500">{p.company} • {p.role}</p></div>
                                                </div>
                                                <div className="text-right"><p className="text-[14px] font-bold text-green-600">{p.package}</p><p className="text-[12px] text-gray-400">{p.date}</p></div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}

                        {/* ===== ANALYTICS TAB ===== */}
                        {activeTab === 'analytics' && (
                            <>
                                <div className="mb-6">
                                    <h1 className="text-[28px] font-bold text-gray-900">Placement Analytics</h1>
                                    <p className="text-[15px] text-gray-500 mt-1">Trends, distributions, and batch-level insights</p>
                                </div>
                                <PlacementCharts />
                            </>
                        )}

                        {/* ===== COMPANIES TAB ===== */}
                        {activeTab === 'companies' && (
                            <>
                                <div className="mb-6">
                                    <h1 className="text-[28px] font-bold text-gray-900">Company-Student Mapping</h1>
                                    <p className="text-[15px] text-gray-500 mt-1">AI-matched students for visiting companies</p>
                                </div>
                                <CompanyMapping />
                                {companyJobs.length > 0 && (
                                    <div className="mt-8 rounded-[16px] p-6 shadow-sm" style={{ backgroundColor: '#DCD9D4', backgroundImage: 'linear-gradient(to bottom, rgba(255,255,255,0.50) 0%, rgba(0,0,0,0.50) 100%), radial-gradient(at 50% 0%, rgba(255,255,255,0.10) 0%, rgba(0,0,0,0.50) 50%)', backgroundBlendMode: 'soft-light, screen' }}>
                                        <h3 className="text-[16px] font-bold text-gray-900 mb-4">Jobs Posted via Company Portal</h3>
                                        <div className="space-y-3">
                                            {companyJobs.map(job => (
                                                <div key={job.id} className="flex items-center justify-between p-3 rounded-xl bg-white/20 border border-white/30">
                                                    <div className="flex items-center gap-3">
                                                        <div className="bg-blue-100 p-2 rounded-lg"><span className="material-symbols-outlined text-blue-600 text-[18px]">work</span></div>
                                                        <div><p className="text-[14px] font-medium text-gray-900">{job.title}</p><p className="text-[12px] text-gray-500">{job.resumeCount} resumes • {job.candidatesShortlisted} shortlisted</p></div>
                                                    </div>
                                                    <span className="px-2.5 py-0.5 rounded-full text-[12px] font-bold bg-green-100 text-green-700">{job.status}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </>
                        )}

                        {/* ===== STUDENTS TAB ===== */}
                        {activeTab === 'students' && (
                            <>
                                <div className="mb-6">
                                    <h1 className="text-[28px] font-bold text-gray-900">Student Directory</h1>
                                    <p className="text-[15px] text-gray-500 mt-1">All enrolled students and their placement status</p>
                                </div>
                                <div className="rounded-[16px] p-6 shadow-sm" style={{ backgroundColor: '#DCD9D4', backgroundImage: 'linear-gradient(to bottom, rgba(255,255,255,0.50) 0%, rgba(0,0,0,0.50) 100%), radial-gradient(at 50% 0%, rgba(255,255,255,0.10) 0%, rgba(0,0,0,0.50) 50%)', backgroundBlendMode: 'soft-light, screen' }}>
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="border-b border-white/30">
                                                    <th className="pb-3 text-left text-[12px] font-semibold uppercase tracking-wider text-gray-500">Student ID</th>
                                                    <th className="pb-3 text-left text-[12px] font-semibold uppercase tracking-wider text-gray-500">Branch</th>
                                                    <th className="pb-3 text-left text-[12px] font-semibold uppercase tracking-wider text-gray-500">CGPA</th>
                                                    <th className="pb-3 text-left text-[12px] font-semibold uppercase tracking-wider text-gray-500">Status</th>
                                                    <th className="pb-3 text-left text-[12px] font-semibold uppercase tracking-wider text-gray-500">Company</th>
                                                    <th className="pb-3 text-right text-[12px] font-semibold uppercase tracking-wider text-gray-500">Package</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-white/20">
                                                {[
                                                    { id: 'STU-2847', branch: 'CSE', cgpa: 8.9, status: 'placed', company: 'Google', pkg: '₹18 LPA' },
                                                    { id: 'STU-1923', branch: 'CSE', cgpa: 9.2, status: 'placed', company: 'Amazon', pkg: '₹28 LPA' },
                                                    { id: 'STU-3461', branch: 'IT', cgpa: 8.4, status: 'placed', company: 'Microsoft', pkg: '₹22 LPA' },
                                                    { id: 'STU-5102', branch: 'ECE', cgpa: 7.8, status: 'placed', company: 'Flipkart', pkg: '₹16 LPA' },
                                                    { id: 'STU-4291', branch: 'CSE', cgpa: 8.1, status: 'interviewing', company: 'Razorpay', pkg: '—' },
                                                    { id: 'STU-6738', branch: 'IT', cgpa: 7.5, status: 'applied', company: '—', pkg: '—' },
                                                    { id: 'STU-8204', branch: 'CSE', cgpa: 9.0, status: 'placed', company: 'Meta', pkg: '₹32 LPA' },
                                                    { id: 'STU-3917', branch: 'ECE', cgpa: 7.2, status: 'unplaced', company: '—', pkg: '—' },
                                                ].map(s => (
                                                    <tr key={s.id} className="hover:bg-white/10 transition-colors">
                                                        <td className="py-3.5 text-[14px] font-semibold text-gray-900">{s.id}</td>
                                                        <td className="py-3.5 text-[14px] text-gray-600">{s.branch}</td>
                                                        <td className="py-3.5 text-[14px] text-gray-600">{s.cgpa}</td>
                                                        <td className="py-3.5">
                                                            <span className={`px-2.5 py-0.5 rounded-full text-[12px] font-bold ${s.status === 'placed' ? 'bg-green-100 text-green-700' : s.status === 'interviewing' ? 'bg-purple-100 text-purple-700' : s.status === 'applied' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>{s.status}</span>
                                                        </td>
                                                        <td className="py-3.5 text-[14px] text-gray-600">{s.company}</td>
                                                        <td className="py-3.5 text-[14px] font-bold text-right text-gray-900">{s.pkg}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </main>

                {/* RIGHT SIDEBAR */}
                <aside className="w-[300px] shrink-0 mt-[32px] mr-[24px] mb-[32px]">
                    <div className="rounded-[16px] p-[28px] h-full overflow-y-auto border border-white/40 shadow-sm" style={{ backgroundImage: 'linear-gradient(135deg, #fdfcfb 0%, #e2d1c3 100%)' }}>
                        <h3 className="text-[15px] font-bold text-gray-900 mb-6">Quick Stats</h3>
                        <div className="space-y-5">
                            <div className="text-center">
                                <div className="relative w-[100px] h-[100px] mx-auto mb-3">
                                    <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                                        <path className="fill-none stroke-white/50 stroke-[3.8]" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                                        <path className="fill-none stroke-green-500 stroke-[3.8] stroke-linecap-round" strokeDasharray={`${batchStats.placementRate}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <span className="text-[20px] font-bold text-gray-900">{batchStats.placementRate}%</span>
                                    </div>
                                </div>
                                <p className="text-[13px] font-medium text-gray-600">Placement Rate</p>
                            </div>
                            <div className="border-t border-white/40 pt-4 space-y-3">
                                {[
                                    { label: 'Avg Package', value: batchStats.avgPackage, color: 'text-blue-600' },
                                    { label: 'Highest Package', value: batchStats.highestPackage, color: 'text-green-600' },
                                    { label: 'Companies', value: batchStats.companiesVisited, color: 'text-purple-600' },
                                    { label: 'Ongoing Drives', value: batchStats.ongoingDrives, color: 'text-orange-600' },
                                ].map((stat) => (
                                    <div key={stat.label} className="flex justify-between items-center">
                                        <span className="text-[13px] text-gray-500">{stat.label}</span>
                                        <span className={`text-[14px] font-bold ${stat.color}`}>{stat.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}
