'use client';

import { useState } from 'react';
import { Building2, BarChart3, Users, AlertCircle } from 'lucide-react';
import CreateJobForm from '@/components/company/CreateJobForm';
import CandidateLeaderboard from '@/components/company/CandidateLeaderboard';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { mockResumeTexts } from '@/data/mockResumes';

export default function CompanyPortal() {
    const [analyzing, setAnalyzing] = useState(false);
    const [showLeaderboard, setShowLeaderboard] = useState(false);
    const [candidates, setCandidates] = useState([]);
    const [jobTitle, setJobTitle] = useState('');
    const [error, setError] = useState('');

    const handleAnalyze = async (formData) => {
        const { title, description, competencies, files } = formData;
        setJobTitle(title);
        setAnalyzing(true);
        setShowLeaderboard(false);
        setError('');

        // Build the job description string from form data
        const jobDescription = [
            `Job Title: ${title}`,
            description ? `\nJob Description:\n${description}` : '',
            competencies.length > 0 ? `\nRequired Competencies: ${competencies.join(', ')}` : '',
        ].join('');

        // Map filenames to mock resume texts
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

            if (!response.ok) {
                throw new Error(data.error || 'Analysis failed');
            }

            setCandidates(data.candidates);
            setShowLeaderboard(true);
        } catch (err) {
            console.error('Analysis error:', err);
            setError(err.message);
        } finally {
            setAnalyzing(false);
        }
    };

    return (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
            {/* Page Header */}
            <div className="mb-8 fade-in-up">
                <div className="flex items-center gap-3 mb-2">
                    <Building2 className="h-6 w-6 text-indigo-400" />
                    <h1 className="text-3xl font-bold gradient-text">Company Hiring Portal</h1>
                </div>
                <p className="text-slate-500 text-lg">AI-powered resume screening with blind hiring principles</p>
            </div>

            {/* Stats Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                {[
                    { label: 'Active Postings', value: '3', icon: Building2, color: 'from-indigo-500 to-purple-500' },
                    { label: 'Resumes Analyzed', value: '247', icon: BarChart3, color: 'from-purple-500 to-pink-500' },
                    { label: 'Candidates Shortlisted', value: '34', icon: Users, color: 'from-emerald-500 to-teal-500' },
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

            {/* Create Job Form */}
            <CreateJobForm onAnalyze={handleAnalyze} />

            {/* Error State */}
            {error && (
                <div className="mt-8 glass-card p-6 border-red-500/30 fade-in-up">
                    <div className="flex items-center gap-3">
                        <AlertCircle className="h-6 w-6 text-red-400 shrink-0" />
                        <div>
                            <p className="font-semibold text-red-300">Analysis Failed</p>
                            <p className="text-sm text-slate-400 mt-1">{error}</p>
                            {error.includes('API key') && (
                                <p className="text-xs text-slate-500 mt-2">
                                    Add your Gemini API key to <code className="text-indigo-400">.env.local</code> and restart the dev server.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Loading State */}
            {analyzing && (
                <div className="mt-8">
                    <LoadingSpinner text="Analyzing Resumes with Gemini AI" />
                </div>
            )}

            {/* Leaderboard */}
            {showLeaderboard && !analyzing && candidates.length > 0 && (
                <div className="mt-8">
                    <CandidateLeaderboard candidates={candidates} jobTitle={jobTitle} resumeTexts={mockResumeTexts} />
                </div>
            )}
        </div>
    );
}
