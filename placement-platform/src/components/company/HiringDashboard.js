'use client';

import { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import CreateJobForm from '@/components/company/CreateJobForm';
import CandidateLeaderboard from '@/components/company/CandidateLeaderboard';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { mockResumeTexts } from '@/data/mockResumes';

export default function HiringDashboard() {
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
        <>
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
        </>
    );
}
