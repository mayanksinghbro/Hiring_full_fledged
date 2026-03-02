'use client';

import { useState } from 'react';
import { GraduationCap, FileCheck, Target, Lightbulb } from 'lucide-react';
import ProfileInput from '@/components/student/ProfileInput';
import CareerDashboard from '@/components/student/CareerDashboard';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { mockGapAnalysis, defaultGapData } from '@/data/mockCareerData';

export default function StudentPortal() {
    const [loading, setLoading] = useState(false);
    const [showDashboard, setShowDashboard] = useState(false);
    const [careerData, setCareerData] = useState(null);
    const [selectedRole, setSelectedRole] = useState('');
    const [selectedCompany, setSelectedCompany] = useState('');

    const handleGenerate = (role, company) => {
        setSelectedRole(role);
        setSelectedCompany(company);
        setLoading(true);
        setShowDashboard(false);

        setTimeout(() => {
            // Look up mock data, fall back to default
            const roleData = mockGapAnalysis[role];
            const data = roleData?.[company] || defaultGapData;
            setCareerData(data);
            setLoading(false);
            setShowDashboard(true);
        }, 2500);
    };

    return (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
            {/* Page Header */}
            <div className="mb-8 fade-in-up">
                <div className="flex items-center gap-3 mb-2">
                    <GraduationCap className="h-6 w-6 text-purple-400" />
                    <h1 className="text-3xl font-bold gradient-text">Student Career Portal</h1>
                </div>
                <p className="text-slate-500 text-lg">AI-powered career roadmap tailored to your dream company</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                {[
                    { label: 'Roadmaps Generated', value: '1,842', icon: Target, color: 'from-purple-500 to-pink-500' },
                    { label: 'Skills Analyzed', value: '12,467', icon: Lightbulb, color: 'from-pink-500 to-rose-500' },
                    { label: 'Success Stories', value: '623', icon: FileCheck, color: 'from-emerald-500 to-teal-500' },
                ].map((stat) => (
                    <div key={stat.label} className="stat-card flex items-center gap-4">
                        <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${stat.color} shadow-lg`}>
                            <stat.icon className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-100">{stat.value}</p>
                            <p className="text-sm text-slate-500">{stat.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Profile Input */}
            <ProfileInput onGenerate={handleGenerate} />

            {/* Loading */}
            {loading && (
                <div className="mt-8">
                    <LoadingSpinner text="Generating Your Career Roadmap" />
                </div>
            )}

            {/* Career Dashboard */}
            {showDashboard && !loading && careerData && (
                <div className="mt-8">
                    <CareerDashboard data={careerData} role={selectedRole} company={selectedCompany} />
                </div>
            )}
        </div>
    );
}
