'use client';

import { useState } from 'react';
import ProfileInput from '@/components/student/ProfileInput';
import CareerDashboard from '@/components/student/CareerDashboard';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { mockGapAnalysis, defaultGapData } from '@/data/mockCareerData';

export default function StudentDashboard() {
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

        // Simulated AI Generation (will be replaced by AI Route later)
        setTimeout(() => {
            const roleData = mockGapAnalysis[role];
            const data = roleData?.[company] || defaultGapData;
            setCareerData(data);
            setLoading(false);
            setShowDashboard(true);
        }, 2000);
    };

    return (
        <>
            {/* Profile Input */}
            <ProfileInput onGenerate={handleGenerate} />

            {/* Loading */}
            {loading && (
                <div className="mt-8">
                    <LoadingSpinner text="Generating Your AI Career Roadmap" />
                </div>
            )}

            {/* Career Dashboard */}
            {showDashboard && !loading && careerData && (
                <div className="mt-8">
                    <CareerDashboard data={careerData} role={selectedRole} company={selectedCompany} />
                </div>
            )}
        </>
    );
}
