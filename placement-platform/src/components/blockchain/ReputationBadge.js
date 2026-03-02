'use client';

import { useState, useEffect } from 'react';

/**
 * ReputationBadge — Displays a company's live trust score
 * Fetches from /api/trustoffer/reputation and shows a pulsing pill badge.
 */
export default function ReputationBadge({ companyName = 'Acme Corp', refreshKey = 0 }) {
    const [reputation, setReputation] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchReputation() {
            try {
                const res = await fetch(`/api/trustoffer/reputation?company=${encodeURIComponent(companyName)}`);
                if (res.ok) {
                    const data = await res.json();
                    setReputation(data.reputation);
                }
            } catch (err) {
                console.error('Reputation fetch error:', err);
            } finally {
                setLoading(false);
            }
        }
        fetchReputation();
        // Refresh every 30s
        const interval = setInterval(fetchReputation, 30000);
        return () => clearInterval(interval);
    }, [companyName, refreshKey]);

    if (loading) {
        return (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-full border border-white/20 animate-pulse">
                <div className="h-2 w-2 rounded-full bg-gray-400"></div>
                <span className="text-[13px] font-medium text-white/50">Loading...</span>
            </div>
        );
    }

    if (!reputation) return null;

    const colorMap = {
        green: {
            bg: 'bg-emerald-500/20',
            border: 'border-emerald-500/40',
            text: 'text-emerald-400',
            dot: 'bg-emerald-500',
        },
        yellow: {
            bg: 'bg-amber-500/20',
            border: 'border-amber-500/40',
            text: 'text-amber-400',
            dot: 'bg-amber-500',
        },
        red: {
            bg: 'bg-red-500/20',
            border: 'border-red-500/40',
            text: 'text-red-400',
            dot: 'bg-red-500',
        },
        gray: {
            bg: 'bg-white/10',
            border: 'border-white/20',
            text: 'text-white/60',
            dot: 'bg-gray-400',
        },
    };

    const colors = colorMap[reputation.color] || colorMap.gray;

    return (
        <div className={`flex items-center gap-2 px-3 py-1.5 ${colors.bg} rounded-full border ${colors.border} cursor-default`}
            title={`Trust Score: ${reputation.score}/100 — ${reputation.grade}`}>
            <div className={`h-2 w-2 rounded-full ${colors.dot} animate-pulse`}></div>
            <span className="material-symbols-outlined text-[14px]" style={{ color: 'inherit' }}>
                verified
            </span>
            <span className={`text-[13px] font-semibold ${colors.text}`}>
                Trust: {reputation.score}
            </span>
            <span className={`text-[11px] font-medium ${colors.text} opacity-70`}>
                {reputation.grade}
            </span>
        </div>
    );
}
