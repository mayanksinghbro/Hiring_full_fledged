'use client';

import { useState } from 'react';

/**
 * CreateOfferModal — The dramatic "Sign & Issue" modal with 3 states:
 *   idle → signing (wow animation) → success (attestation UID)
 */
export default function CreateOfferModal({ isOpen, onClose, candidate, jobTitle, companyName, onSuccess }) {
    const [packageLPA, setPackageLPA] = useState('');
    const [phase, setPhase] = useState('idle'); // idle | signing | success
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');
    const [signingText, setSigningText] = useState('Initializing cryptographic signer...');

    if (!isOpen || !candidate) return null;

    const signingMessages = [
        'Initializing cryptographic signer...',
        'Encoding offer terms with EIP-712...',
        'Generating typed data hash...',
        'Signing with server wallet...',
        'Anchoring attestation...',
        'Verifying signature integrity...',
    ];

    const handleSign = async () => {
        if (!packageLPA || parseFloat(packageLPA) <= 0) {
            setError('Please enter a valid package amount');
            return;
        }

        setError('');
        setPhase('signing');

        // Cycle through signing messages for the "wow" effect
        let msgIndex = 0;
        const msgInterval = setInterval(() => {
            msgIndex = (msgIndex + 1) % signingMessages.length;
            setSigningText(signingMessages[msgIndex]);
        }, 600);

        try {
            const res = await fetch('/api/trustoffer', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    companyName: companyName || 'Acme Corp',
                    candidateName: candidate.id, // Using blind ID
                    roleTitle: jobTitle || 'Software Engineer',
                    packageLPA: parseFloat(packageLPA),
                }),
            });

            clearInterval(msgInterval);

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to create offer');
            }

            const data = await res.json();

            // Small delay to let the user see the final signing message
            await new Promise(r => setTimeout(r, 800));

            setResult(data.offer);
            setPhase('success');
            if (onSuccess) onSuccess(data.offer);
        } catch (err) {
            clearInterval(msgInterval);
            setError(err.message);
            setPhase('idle');
        }
    };

    const handleClose = () => {
        setPhase('idle');
        setPackageLPA('');
        setResult(null);
        setError('');
        setSigningText(signingMessages[0]);
        onClose();
    };

    const copyUID = () => {
        navigator.clipboard.writeText(result?.attestationUID || '');
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={phase !== 'signing' ? handleClose : undefined} />

            {/* Modal */}
            <div className="relative w-full max-w-lg mx-4 rounded-2xl overflow-hidden shadow-2xl"
                style={{
                    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
                    border: '1px solid rgba(99, 102, 241, 0.3)',
                }}>

                {/* ═══════ IDLE: Form State ═══════ */}
                {phase === 'idle' && (
                    <div className="p-8">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 rounded-xl bg-indigo-500/20 border border-indigo-500/30">
                                    <span className="material-symbols-outlined text-indigo-400 text-xl">verified</span>
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-white">Issue Verified Offer</h2>
                                    <p className="text-sm text-white/50">Cryptographically signed • Tamper-proof</p>
                                </div>
                            </div>
                            <button onClick={handleClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                                <span className="material-symbols-outlined text-white/60">close</span>
                            </button>
                        </div>

                        {/* Offer Details (read-only) */}
                        <div className="space-y-3 mb-6">
                            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                                <span className="material-symbols-outlined text-white/40 text-lg">person</span>
                                <div>
                                    <p className="text-xs text-white/40 uppercase tracking-wider">Candidate</p>
                                    <p className="text-sm font-semibold text-white">{candidate.id}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                                <span className="material-symbols-outlined text-white/40 text-lg">work</span>
                                <div>
                                    <p className="text-xs text-white/40 uppercase tracking-wider">Role</p>
                                    <p className="text-sm font-semibold text-white">{jobTitle || 'Software Engineer'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                                <span className="material-symbols-outlined text-white/40 text-lg">business</span>
                                <div>
                                    <p className="text-xs text-white/40 uppercase tracking-wider">Company</p>
                                    <p className="text-sm font-semibold text-white">{companyName || 'Acme Corp'}</p>
                                </div>
                            </div>
                        </div>

                        {/* Package Input */}
                        <div className="mb-6">
                            <label className="block text-xs text-white/40 uppercase tracking-wider mb-2 font-semibold">
                                Annual Package (LPA)
                            </label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 font-bold">₹</span>
                                <input
                                    type="number"
                                    value={packageLPA}
                                    onChange={(e) => setPackageLPA(e.target.value)}
                                    placeholder="e.g. 12.5"
                                    min="0"
                                    step="0.1"
                                    className="w-full pl-10 pr-16 py-3.5 rounded-xl bg-white/5 border border-white/15 text-white font-semibold text-lg
                                               placeholder:text-white/20 focus:outline-none focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/20
                                               transition-all"
                                />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 text-sm font-medium">LPA</span>
                            </div>
                        </div>

                        {error && (
                            <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2">
                                <span className="material-symbols-outlined text-base">error</span>
                                {error}
                            </div>
                        )}

                        {/* Sign Button */}
                        <button
                            onClick={handleSign}
                            className="w-full py-4 rounded-xl font-bold text-white text-base
                                       bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500
                                       border border-indigo-500/30 shadow-lg shadow-indigo-900/30
                                       transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]
                                       flex items-center justify-center gap-3"
                        >
                            <span className="material-symbols-outlined text-xl">edit_square</span>
                            Sign & Issue Verified Offer
                        </button>

                        <p className="text-center text-xs text-white/30 mt-3">
                            This offer will be cryptographically signed using EIP-712 and stored permanently.
                        </p>
                    </div>
                )}

                {/* ═══════ SIGNING: Wow Animation ═══════ */}
                {phase === 'signing' && (
                    <div className="p-10 flex flex-col items-center text-center">
                        {/* Spinning Ring */}
                        <div className="relative mb-8">
                            <div className="w-24 h-24 rounded-full border-4 border-indigo-500/20 border-t-indigo-400 animate-spin" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="material-symbols-outlined text-indigo-400 text-3xl animate-pulse">lock</span>
                            </div>
                        </div>

                        <h3 className="text-lg font-bold text-white mb-2">Securing Offer on Chain</h3>
                        <p className="text-sm text-indigo-300/80 mb-6 font-mono transition-all duration-300">
                            {signingText}
                        </p>

                        {/* Fake hash animation */}
                        <div className="w-full max-w-sm p-3 rounded-lg bg-black/30 border border-white/5 overflow-hidden">
                            <p className="text-xs text-white/20 font-mono truncate animate-pulse">
                                0x{Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}
                            </p>
                        </div>

                        <div className="flex items-center gap-2 mt-6">
                            <div className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                            <div className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                            <div className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                    </div>
                )}

                {/* ═══════ SUCCESS: Attestation Proof ═══════ */}
                {phase === 'success' && result && (
                    <div className="p-8">
                        {/* Success Header */}
                        <div className="text-center mb-6">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500/40 mb-4">
                                <span className="material-symbols-outlined text-emerald-400 text-3xl">check_circle</span>
                            </div>
                            <h3 className="text-xl font-bold text-white">Offer Verified & Sealed</h3>
                            <p className="text-sm text-white/50 mt-1">Cryptographic attestation created successfully</p>
                        </div>

                        {/* Offer Summary */}
                        <div className="space-y-2 mb-6">
                            <div className="flex justify-between items-center py-2 border-b border-white/5">
                                <span className="text-sm text-white/40">Candidate</span>
                                <span className="text-sm font-semibold text-white">{result.candidateName}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-white/5">
                                <span className="text-sm text-white/40">Role</span>
                                <span className="text-sm font-semibold text-white">{result.roleTitle}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-white/5">
                                <span className="text-sm text-white/40">Package</span>
                                <span className="text-sm font-bold text-emerald-400">₹{result.packageLPA} LPA</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-white/5">
                                <span className="text-sm text-white/40">Status</span>
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold border border-amber-500/30">
                                    <span className="material-symbols-outlined text-xs">schedule</span>
                                    {result.status}
                                </span>
                            </div>
                        </div>

                        {/* Attestation UID */}
                        <div className="mb-6 p-4 rounded-xl bg-black/30 border border-indigo-500/20">
                            <p className="text-xs text-indigo-400 uppercase tracking-wider font-bold mb-2 flex items-center gap-1.5">
                                <span className="material-symbols-outlined text-sm">fingerprint</span>
                                Attestation UID
                            </p>
                            <div className="flex items-center gap-2">
                                <code className="flex-1 text-xs text-white/60 font-mono break-all leading-relaxed">
                                    {result.attestationUID}
                                </code>
                                <button onClick={copyUID}
                                    className="shrink-0 p-2 rounded-lg hover:bg-white/10 transition-colors"
                                    title="Copy UID">
                                    <span className="material-symbols-outlined text-white/40 text-base">content_copy</span>
                                </button>
                            </div>
                        </div>

                        {/* Signer Info */}
                        <div className="mb-6 p-3 rounded-xl bg-white/5 border border-white/10">
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-white/30 text-base">key</span>
                                <div>
                                    <p className="text-xs text-white/30">Signed by</p>
                                    <p className="text-xs text-white/50 font-mono">{result.signerAddress}</p>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3">
                            <button
                                onClick={() => window.open(`/verify/${result.attestationUID}`, '_blank')}
                                className="flex-1 py-3 rounded-xl font-semibold text-sm text-indigo-300
                                           bg-indigo-500/10 border border-indigo-500/20 hover:bg-indigo-500/20
                                           transition-all flex items-center justify-center gap-2"
                            >
                                <span className="material-symbols-outlined text-base">open_in_new</span>
                                View Proof
                            </button>
                            <button
                                onClick={handleClose}
                                className="flex-1 py-3 rounded-xl font-semibold text-sm text-white
                                           bg-white/10 border border-white/10 hover:bg-white/15
                                           transition-all flex items-center justify-center gap-2"
                            >
                                Done
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
