'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowRight, CheckCircle, ArrowLeft } from 'lucide-react';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) { setError('Please enter your email address.'); return; }
        setError('');
        setLoading(true);
        // Replace with: await supabase.auth.resetPasswordForEmail(email, { redirectTo: 'https://vnodenutra.com/reset-password' })
        await new Promise(r => setTimeout(r, 1200));
        setSent(true);
        setLoading(false);
    };

    return (
        <main className="min-h-screen bg-[#f5f5f5] flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <Link href="/"><span className="text-2xl font-black text-[#1a237e]">V-Node<span className="text-[#ff6b35]">Nutra</span></span></Link>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
                    {!sent ? (
                        <>
                            <div className="w-14 h-14 bg-[#eef2ff] rounded-2xl flex items-center justify-center mx-auto mb-5">
                                <Mail className="w-7 h-7 text-[#1a237e]" />
                            </div>
                            <h1 className="text-gray-900 font-black text-xl text-center mb-1">Forgot Password?</h1>
                            <p className="text-gray-400 text-sm text-center mb-6">Enter your email and we'll send you a reset link.</p>

                            {error && <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-4 text-red-600 text-sm">{error}</div>}

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-gray-600 text-xs font-bold uppercase tracking-wider mb-1.5">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type="email" value={email} onChange={e => setEmail(e.target.value)}
                                            placeholder="you@email.com"
                                            className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-gray-800 text-sm focus:outline-none focus:border-[#1a237e] transition-all"
                                        />
                                    </div>
                                </div>
                                <button type="submit" disabled={loading}
                                    className="w-full bg-[#1a237e] hover:bg-[#0d1459] disabled:opacity-60 text-white font-black py-3.5 rounded-xl transition-all flex items-center justify-center gap-2">
                                    {loading ? <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" /> : <ArrowRight className="w-4 h-4" />}
                                    {loading ? 'Sending...' : 'Send Reset Link'}
                                </button>
                            </form>
                        </>
                    ) : (
                        <div className="text-center">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
                                <CheckCircle className="w-8 h-8 text-green-600" />
                            </div>
                            <h2 className="text-gray-900 font-black text-xl mb-2">Check Your Inbox!</h2>
                            <p className="text-gray-400 text-sm mb-6">
                                We've sent a password reset link to <strong className="text-gray-700">{email}</strong>. The link expires in 15 minutes.
                            </p>
                            <p className="text-gray-400 text-xs mb-6">Didn't receive it? Check spam or <button onClick={() => setSent(false)} className="text-[#1a237e] font-bold hover:underline">try again</button>.</p>
                        </div>
                    )}
                </div>

                <div className="text-center mt-5">
                    <Link href="/login" className="text-gray-400 text-sm flex items-center justify-center gap-1 hover:text-[#1a237e]">
                        <ArrowLeft className="w-3.5 h-3.5" /> Back to Login
                    </Link>
                </div>
            </div>
        </main>
    );
}
