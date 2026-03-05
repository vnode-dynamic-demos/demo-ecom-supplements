'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Eye, EyeOff, Mail, Lock, ArrowRight, ShieldCheck } from 'lucide-react';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPw, setShowPw] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!email || !password) { setError('Please fill in all fields.'); return; }
        setLoading(true);
        // Simulate auth — replace with Supabase: const { error } = await supabase.auth.signInWithPassword({ email, password })
        await new Promise(r => setTimeout(r, 1200));
        if (email === 'demo@vnodenutra.com' && password === 'Demo@1234') {
            localStorage.setItem('vnode-customer-session', JSON.stringify({ email, name: 'Demo User', loggedIn: true }));
            setSuccess(true);
            setTimeout(() => window.location.href = '/account', 800);
        } else {
            setError('Invalid email or password. Try demo@vnodenutra.com / Demo@1234');
        }
        setLoading(false);
    };

    return (
        <main className="min-h-screen bg-[#f5f5f5] flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <Link href="/" className="inline-block">
                        <span className="text-2xl font-black text-[#1a237e]">V-Node<span className="text-[#ff6b35]">Nutra</span></span>
                    </Link>
                    <h1 className="text-gray-900 font-black text-xl mt-3">Welcome back!</h1>
                    <p className="text-gray-400 text-sm">Sign in to your account</p>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
                    {success && (
                        <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 mb-5 text-green-700 text-sm font-semibold flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4" /> Logged in! Redirecting...
                        </div>
                    )}
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-5 text-red-600 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-gray-600 text-xs font-bold uppercase tracking-wider mb-1.5">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    placeholder="you@email.com"
                                    className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-gray-800 text-sm focus:outline-none focus:border-[#1a237e] transition-all"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-gray-600 text-xs font-bold uppercase tracking-wider mb-1.5">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type={showPw ? 'text' : 'password'}
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full border border-gray-200 rounded-xl pl-10 pr-11 py-3 text-gray-800 text-sm focus:outline-none focus:border-[#1a237e] transition-all"
                                />
                                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                            <div className="flex justify-end mt-1">
                                <Link href="/forgot-password" className="text-xs text-[#1a237e] hover:underline font-semibold">Forgot password?</Link>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading || success}
                            className="w-full bg-[#1a237e] hover:bg-[#0d1459] disabled:opacity-60 text-white font-black py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 mt-2 shadow-md shadow-blue-900/20"
                        >
                            {loading ? <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" /> : <ArrowRight className="w-4 h-4" />}
                            {loading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>

                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100" /></div>
                        <div className="relative flex justify-center"><span className="bg-white px-3 text-gray-400 text-xs">or continue with</span></div>
                    </div>

                    <button className="w-full border border-gray-200 rounded-xl py-3 flex items-center justify-center gap-3 text-gray-700 font-semibold text-sm hover:bg-gray-50 transition-all">
                        <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
                        Sign in with Google
                    </button>
                </div>

                <p className="text-center mt-5 text-gray-400 text-sm">
                    New to V-Node Nutra? <Link href="/signup" className="text-[#1a237e] font-bold hover:underline">Create Account</Link>
                </p>

                {/* Demo credentials */}
                <div className="mt-4 bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 text-xs text-center">
                    <p className="text-[#1a237e] font-bold">Demo Credentials</p>
                    <p className="text-gray-500 mt-0.5">Email: <span className="font-mono text-gray-700">demo@vnodenutra.com</span> · Password: <span className="font-mono text-gray-700">Demo@1234</span></p>
                </div>
            </div>
        </main>
    );
}
