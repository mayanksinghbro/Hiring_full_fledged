'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';

export default function VerifyPage() {
    const { uid } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [checkSteps, setCheckSteps] = useState([]);

    const runVerification = useCallback(async () => {
        const steps = [
            { label: 'Locating attestation on-chain...', status: 'running' },
            { label: 'Recovering signer from EIP-712 signature...', status: 'pending' },
            { label: 'Matching recovered address to issuer...', status: 'pending' },
            { label: 'Validating offer integrity...', status: 'pending' },
        ];
        setCheckSteps([...steps]);

        try {
            // Step 1: Fetch attestation
            await new Promise(r => setTimeout(r, 600));
            const res = await fetch(`/api/trustoffer/verify/${uid}`);
            const json = await res.json();

            steps[0].status = res.ok ? 'pass' : 'fail';
            setCheckSteps([...steps]);

            if (!res.ok) throw new Error(json.error || 'Attestation not found');

            // Step 2: Signature recovery (happened server-side, we display result)
            await new Promise(r => setTimeout(r, 400));
            steps[1].status = json.cryptography?.recoveredAddress ? 'pass' : 'fail';
            steps[1].detail = json.cryptography?.recoveredAddress
                ? `Recovered: ${json.cryptography.recoveredAddress.slice(0, 10)}...${json.cryptography.recoveredAddress.slice(-6)}`
                : 'Could not recover signer';
            setCheckSteps([...steps]);

            // Step 3: Address match
            await new Promise(r => setTimeout(r, 400));
            const addressMatch = json.cryptography?.signatureValid === true;
            steps[2].status = addressMatch ? 'pass' : 'fail';
            steps[2].detail = addressMatch
                ? `Signer ${json.cryptography.signerAddress.slice(0, 10)}... confirmed`
                : 'Address mismatch detected';
            setCheckSteps([...steps]);

            // Step 4: Overall integrity
            await new Promise(r => setTimeout(r, 300));
            steps[3].status = json.verified ? 'pass' : 'fail';
            steps[3].detail = json.verified
                ? 'All checks passed — offer is authentic'
                : 'Integrity check failed';
            setCheckSteps([...steps]);

            setData(json);
        } catch (err) {
            setError(err.message);
            // Mark remaining steps as failed
            steps.forEach(s => { if (s.status === 'pending' || s.status === 'running') s.status = 'fail'; });
            setCheckSteps([...steps]);
        } finally {
            setLoading(false);
        }
    }, [uid]);

    useEffect(() => {
        if (uid) runVerification();
    }, [uid, runVerification]);

    const allPassed = checkSteps.length > 0 && checkSteps.every(s => s.status === 'pass');

    const cardStyle = {
        backgroundColor: '#DCD9D4',
        backgroundImage: 'linear-gradient(to bottom, rgba(255,255,255,0.50) 0%, rgba(0,0,0,0.50) 100%), radial-gradient(at 50% 0%, rgba(255,255,255,0.10) 0%, rgba(0,0,0,0.50) 50%)',
        backgroundBlendMode: 'soft-light, screen',
    };

    return (
        <div className="min-h-screen flex flex-col font-sans text-gray-900" style={{
            backgroundImage: 'linear-gradient(to bottom, rgba(255,255,255,0.25), rgba(240,242,245,0.35)), url(/backgrounds/portal-bg.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
            backgroundRepeat: 'no-repeat',
        }}>
            {/* HEADER — matches site-wide header */}
            <header className="h-[64px] bg-[#1a1a1a] border-b border-white/10 flex items-center justify-between px-4 sm:px-10 shrink-0 z-20">
                <div className="flex items-center gap-4 sm:gap-8">
                    <div className="flex items-center gap-3">
                        <div className="bg-white/20 p-2 rounded-lg"><span className="material-symbols-outlined text-white text-2xl">grid_view</span></div>
                        <span className="text-[24px] font-bold tracking-tight text-white">Placify</span>
                    </div>
                    <nav className="flex items-center gap-2 h-[64px]">
                        <a href="/student" className="text-[14px] font-medium text-white/70 px-4 h-full flex items-center hover:text-white border-b-2 border-transparent transition-colors">Student</a>
                        <a href="/company" className="text-[14px] font-medium text-white/70 px-4 h-full flex items-center hover:text-white border-b-2 border-transparent transition-colors">Company</a>
                        <a href="/college" className="text-[14px] font-medium text-white/70 px-4 h-full flex items-center hover:text-white border-b-2 border-transparent transition-colors">College</a>
                    </nav>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-500/20 rounded-full border border-indigo-500/30">
                    <span className="material-symbols-outlined text-indigo-400 text-[14px]">verified</span>
                    <span className="text-[13px] font-medium text-indigo-300">TrustOffer Verification</span>
                </div>
            </header>

            {/* BODY */}
            <main className="flex-grow flex items-start justify-center p-6 sm:p-10 overflow-y-auto">
                <div className="w-full max-w-2xl">

                    {/* Page Title */}
                    <div className="mb-6">
                        <h1 className="text-[28px] font-bold text-gray-900">Offer Verification</h1>
                        <p className="text-[15px] text-gray-500 mt-1">Cryptographic proof that this offer is authentic and untampered</p>
                    </div>

                    {/* ── LIVE VERIFICATION CHECKS ── */}
                    <div className="rounded-[16px] p-6 shadow-sm mb-6" style={cardStyle}>
                        <div className="flex items-center gap-3 mb-5">
                            <div className="bg-indigo-100 p-2.5 rounded-xl">
                                <span className="material-symbols-outlined text-indigo-600 text-xl">fact_check</span>
                            </div>
                            <div>
                                <h2 className="text-[16px] font-bold text-gray-900">Verification Checks</h2>
                                <p className="text-[12px] text-gray-500">Real-time cryptographic validation</p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            {checkSteps.map((step, i) => (
                                <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/30 border border-white/40">
                                    {/* Status icon */}
                                    {step.status === 'running' && (
                                        <div className="h-5 w-5 rounded-full border-2 border-blue-500/30 border-t-blue-500 animate-spin shrink-0" />
                                    )}
                                    {step.status === 'pending' && (
                                        <div className="h-5 w-5 rounded-full bg-gray-200 shrink-0" />
                                    )}
                                    {step.status === 'pass' && (
                                        <span className="material-symbols-outlined text-green-600 text-[20px] shrink-0">check_circle</span>
                                    )}
                                    {step.status === 'fail' && (
                                        <span className="material-symbols-outlined text-red-500 text-[20px] shrink-0">cancel</span>
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <p className={`text-[13px] font-semibold ${step.status === 'pending' ? 'text-gray-400' : 'text-gray-800'}`}>
                                            {step.label}
                                        </p>
                                        {step.detail && (
                                            <p className="text-[11px] text-gray-500 font-mono mt-0.5 truncate">{step.detail}</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Overall Result */}
                        {!loading && checkSteps.length > 0 && (
                            <div className={`mt-4 p-4 rounded-xl flex items-center gap-3 ${allPassed
                                    ? 'bg-green-50 border border-green-200'
                                    : 'bg-red-50 border border-red-200'
                                }`}>
                                <span className={`material-symbols-outlined text-2xl ${allPassed ? 'text-green-600' : 'text-red-500'}`}>
                                    {allPassed ? 'verified' : 'gpp_bad'}
                                </span>
                                <div>
                                    <p className={`text-[15px] font-bold ${allPassed ? 'text-green-700' : 'text-red-700'}`}>
                                        {allPassed ? 'Cryptographically Verified' : 'Verification Failed'}
                                    </p>
                                    <p className={`text-[12px] ${allPassed ? 'text-green-600' : 'text-red-500'}`}>
                                        {allPassed
                                            ? 'This offer was authentically signed by the Placify platform and has not been tampered with.'
                                            : error || 'One or more verification checks did not pass.'}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* ── OFFER DETAILS ── */}
                    {data?.offer && (
                        <div className="rounded-[16px] p-6 shadow-sm mb-6" style={cardStyle}>
                            <div className="flex items-center gap-3 mb-5">
                                <div className="bg-blue-100 p-2.5 rounded-xl">
                                    <span className="material-symbols-outlined text-blue-600 text-xl">description</span>
                                </div>
                                <div>
                                    <h2 className="text-[16px] font-bold text-gray-900">Offer Details</h2>
                                    <p className="text-[12px] text-gray-500">Immutable record of the job offer terms</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                {[
                                    { label: 'Company', value: data.offer.companyName, icon: 'business' },
                                    { label: 'Candidate', value: data.offer.candidateName, icon: 'person' },
                                    { label: 'Role', value: data.offer.roleTitle, icon: 'work' },
                                    { label: 'Package', value: `₹${data.offer.packageLPA} LPA`, icon: 'payments', highlight: true },
                                    {
                                        label: 'Status', value: data.offer.status, icon: 'flag',
                                        color: data.offer.status === 'Accepted' ? 'text-green-700 bg-green-50 border-green-200'
                                            : data.offer.status === 'Rescinded' ? 'text-red-600 bg-red-50 border-red-200'
                                                : 'text-amber-700 bg-amber-50 border-amber-200'
                                    },
                                    { label: 'Issued', value: new Date(data.offer.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }), icon: 'calendar_today' },
                                ].map((row) => (
                                    <div key={row.label} className="flex items-center gap-3 p-3 rounded-xl bg-white/30 border border-white/40">
                                        <div className={`p-2 rounded-lg ${row.highlight ? 'bg-green-100' : 'bg-gray-100'}`}>
                                            <span className={`material-symbols-outlined text-[16px] ${row.highlight ? 'text-green-600' : 'text-gray-500'}`}>{row.icon}</span>
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-[11px] text-gray-400 uppercase tracking-wider font-semibold">{row.label}</p>
                                            {row.color ? (
                                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[12px] font-bold border ${row.color}`}>
                                                    {row.value}
                                                </span>
                                            ) : (
                                                <p className={`text-[14px] font-semibold text-gray-900 truncate ${row.highlight ? 'text-green-700' : ''}`}>{row.value}</p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Accepted / Rescinded timestamps */}
                            {(data.offer.acceptedAt || data.offer.rescindedAt) && (
                                <div className="mt-3 p-3 rounded-xl bg-white/30 border border-white/40">
                                    {data.offer.acceptedAt && (
                                        <p className="text-[12px] text-green-700 flex items-center gap-1.5">
                                            <span className="material-symbols-outlined text-[14px]">check_circle</span>
                                            Accepted on {new Date(data.offer.acceptedAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                                        </p>
                                    )}
                                    {data.offer.rescindedAt && (
                                        <p className="text-[12px] text-red-600 flex items-center gap-1.5">
                                            <span className="material-symbols-outlined text-[14px]">warning</span>
                                            Rescinded on {new Date(data.offer.rescindedAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {/* ── CRYPTOGRAPHIC PROOF ── */}
                    {data?.cryptography && (
                        <div className="rounded-[16px] p-6 shadow-sm mb-6" style={cardStyle}>
                            <div className="flex items-center gap-3 mb-5">
                                <div className="bg-purple-100 p-2.5 rounded-xl">
                                    <span className="material-symbols-outlined text-purple-600 text-xl">fingerprint</span>
                                </div>
                                <div>
                                    <h2 className="text-[16px] font-bold text-gray-900">Cryptographic Proof</h2>
                                    <p className="text-[12px] text-gray-500">EIP-712 typed data signature details</p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                {[
                                    { label: 'Attestation UID', value: data.cryptography.attestationUID },
                                    { label: 'Signer Address', value: data.cryptography.signerAddress },
                                    { label: 'Recovered Address', value: data.cryptography.recoveredAddress },
                                ].map((row) => (
                                    <div key={row.label} className="p-3 rounded-xl bg-white/30 border border-white/40">
                                        <p className="text-[11px] text-purple-600 uppercase tracking-wider font-bold mb-1">{row.label}</p>
                                        <p className="text-[12px] text-gray-700 font-mono break-all leading-relaxed">{row.value}</p>
                                    </div>
                                ))}

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="p-3 rounded-xl bg-white/30 border border-white/40">
                                        <p className="text-[11px] text-purple-600 uppercase tracking-wider font-bold mb-1">Protocol</p>
                                        <p className="text-[12px] text-gray-700">{data.cryptography.protocol}</p>
                                    </div>
                                    <div className="p-3 rounded-xl bg-white/30 border border-white/40">
                                        <p className="text-[11px] text-purple-600 uppercase tracking-wider font-bold mb-1">Network</p>
                                        <p className="text-[12px] text-gray-700">{data.cryptography.chainName} ({data.cryptography.chainId})</p>
                                    </div>
                                </div>

                                {/* Signature match result */}
                                <div className={`p-3 rounded-xl flex items-center gap-3 ${data.cryptography.signatureValid
                                        ? 'bg-green-50 border border-green-200'
                                        : 'bg-red-50 border border-red-200'
                                    }`}>
                                    <span className={`material-symbols-outlined text-[18px] ${data.cryptography.signatureValid ? 'text-green-600' : 'text-red-500'
                                        }`}>
                                        {data.cryptography.signatureValid ? 'check_circle' : 'cancel'}
                                    </span>
                                    <div>
                                        <p className={`text-[13px] font-bold ${data.cryptography.signatureValid ? 'text-green-700' : 'text-red-700'
                                            }`}>
                                            {data.cryptography.signatureValid ? 'Signature Verified' : 'Signature Mismatch'}
                                        </p>
                                        <p className="text-[11px] text-gray-500">
                                            {data.cryptography.signatureValid
                                                ? 'The recovered address matches the platform signer — offer terms have not been altered.'
                                                : 'WARNING: The recovered address does not match the expected signer.'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ── ERROR STATE (no data) ── */}
                    {!loading && error && !data && (
                        <div className="rounded-[16px] p-6 shadow-sm mb-6" style={cardStyle}>
                            <div className="text-center py-6">
                                <span className="material-symbols-outlined text-[48px] text-red-400 block mb-3">gpp_bad</span>
                                <h2 className="text-[18px] font-bold text-red-700">Attestation Not Found</h2>
                                <p className="text-[13px] text-gray-500 mt-2">{error}</p>
                                <p className="text-[11px] text-gray-400 font-mono mt-4 break-all">UID: {uid}</p>
                            </div>
                        </div>
                    )}

                    {/* Footer */}
                    <div className="text-center pb-6">
                        <p className="text-[12px] text-gray-400 flex items-center justify-center gap-1.5">
                            <span className="material-symbols-outlined text-[14px]">lock</span>
                            Verified by Placify TrustOffer Protocol • EIP-712 Typed Data
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}
