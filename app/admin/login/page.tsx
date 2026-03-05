'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Dumbbell, Lock, Eye, EyeOff, ShieldCheck } from 'lucide-react';

const DEMO_CREDENTIALS = { username: 'admin', password: 'vnode@admin' };

export default function AdminLoginPage() {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPw, setShowPw] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        await new Promise(r => setTimeout(r, 700));
        if (username === DEMO_CREDENTIALS.username && password === DEMO_CREDENTIALS.password) {
            localStorage.setItem('vnode-admin-session', JSON.stringify({ loggedIn: true, at: Date.now() }));
            router.push('/admin');
        } else {
            setError('Invalid username or password. Try: admin / vnode@admin');
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-[#f0f4ff] flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-[#1a237e] rounded-2xl mb-4 shadow-lg">
                        <Dumbbell className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-2xl font-black text-gray-900">V-Node Nutra</h1>
                    <p className="text-gray-500 text-sm mt-1">Admin & Content Management Portal</p>
                </div>

                {/* Card */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-xl p-8">
                    <div className="flex items-center gap-2 mb-6">
                        <Lock className="w-4 h-4 text-[#1a237e]" />
                        <h2 className="font-bold text-gray-800">Sign in to Admin Panel</h2>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Username</label>
                            <input
                                type="text"
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                                placeholder="admin"
                                required
                                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-800 text-sm focus:outline-none focus:border-[#1a237e] transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Password</label>
                            <div className="relative">
                                <input
                                    type={showPw ? 'text' : 'password'}
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    className="w-full border border-gray-200 rounded-xl px-4 py-3 pr-11 text-gray-800 text-sm focus:outline-none focus:border-[#1a237e] transition-all"
                                />
                                <button type="button" onClick={() => setShowPw(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl font-medium">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#1a237e] hover:bg-[#0d1459] disabled:opacity-60 text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 text-sm mt-2"
                        >
                            {loading ? <>Signing in...</> : <><ShieldCheck className="w-4 h-4" /> Sign In</>}
                        </button>
                    </form>

                    <div className="mt-6 pt-5 border-t border-gray-100 bg-gray-50 rounded-xl p-4">
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Demo Credentials</p>
                        <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                            <div className="bg-white border border-gray-200 rounded-lg p-2">
                                <p className="text-gray-400 font-sans font-semibold text-[10px] mb-0.5">USERNAME</p>
                                <p className="text-gray-800 font-bold">admin</p>
                            </div>
                            <div className="bg-white border border-gray-200 rounded-lg p-2">
                                <p className="text-gray-400 font-sans font-semibold text-[10px] mb-0.5">PASSWORD</p>
                                <p className="text-gray-800 font-bold">vnode@admin</p>
                            </div>
                        </div>
                    </div>
                </div>

                <p className="text-center text-xs text-gray-400 mt-4">
                    This portal is restricted to authorized personnel only.<br />
                    Not a customer? <a href="/" className="text-[#1a237e] font-semibold hover:underline">Visit the store →</a>
                </p>
            </div>
        </div>
    );
}
