'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Eye, EyeOff, Mail, Lock, User, Phone, ArrowRight, CheckCircle } from 'lucide-react';
import { getSupabaseClient } from '@/lib/supabase';

export default function SignupPage() {
    const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' });
    const [showPw, setShowPw] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const update = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
        setForm(f => ({ ...f, [k]: e.target.value }));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!form.name || !form.email || !form.password) { setError('Please fill in all required fields.'); return; }
        if (form.password !== form.confirm) { setError('Passwords do not match.'); return; }
        if (form.password.length < 8) { setError('Password must be at least 8 characters.'); return; }
        setLoading(true);

        const supabase = getSupabaseClient();
        if (!supabase) {
            // Demo mode fallback
            await new Promise(r => setTimeout(r, 1000));
            setSuccess(true);
            setLoading(false);
            return;
        }

        const { error: authError } = await supabase.auth.signUp({
            email: form.email,
            password: form.password,
            options: {
                data: { full_name: form.name, phone: form.phone },
            },
        });

        if (authError) {
            setError(authError.message);
        } else {
            setSuccess(true);
        }
        setLoading(false);
    };

    if (success) {
        return (
            <main className="min-h-screen bg-[#f5f5f5] flex items-center justify-center px-4">
                <div className="text-center max-w-sm">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5 border-4 border-green-200">
                        <CheckCircle className="w-10 h-10 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-black text-gray-900 mb-2">Account Created! 🎉</h2>
                    <p className="text-gray-400 text-sm mb-6">We've sent a verification email to <strong className="text-gray-700">{form.email}</strong>. Please verify to start shopping.</p>
                    <Link href="/login" className="bg-[#1a237e] text-white font-black px-8 py-3.5 rounded-xl inline-flex items-center gap-2 hover:bg-[#0d1459] transition-all">
                        Go to Login <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#f5f5f5] flex items-center justify-center px-4 py-10">
            <div className="w-full max-w-md">
                <div className="text-center mb-6">
                    <Link href="/"><span className="text-2xl font-black text-[#1a237e]">V-Node<span className="text-[#ff6b35]">Nutra</span></span></Link>
                    <h1 className="text-gray-900 font-black text-xl mt-3">Create your account</h1>
                    <p className="text-gray-400 text-sm">Join 2 lakh+ happy customers</p>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
                    {error && <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-4 text-red-600 text-sm">{error}</div>}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {[
                            { key: 'name', label: 'Full Name *', icon: User, type: 'text', placeholder: 'Rohan Sharma' },
                            { key: 'email', label: 'Email Address *', icon: Mail, type: 'email', placeholder: 'you@email.com' },
                            { key: 'phone', label: 'Mobile Number', icon: Phone, type: 'tel', placeholder: '+91 98XXXX1234' },
                        ].map(({ key, label, icon: Icon, type, placeholder }) => (
                            <div key={key}>
                                <label className="block text-gray-600 text-xs font-bold uppercase tracking-wider mb-1.5">{label}</label>
                                <div className="relative">
                                    <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type={type}
                                        value={form[key as keyof typeof form]}
                                        onChange={update(key as keyof typeof form)}
                                        placeholder={placeholder}
                                        className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-gray-800 text-sm focus:outline-none focus:border-[#1a237e] transition-all"
                                    />
                                </div>
                            </div>
                        ))}

                        <div>
                            <label className="block text-gray-600 text-xs font-bold uppercase tracking-wider mb-1.5">Password *</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input type={showPw ? 'text' : 'password'} value={form.password} onChange={update('password')} placeholder="Min. 8 characters"
                                    className="w-full border border-gray-200 rounded-xl pl-10 pr-11 py-3 text-sm focus:outline-none focus:border-[#1a237e] transition-all" />
                                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-gray-600 text-xs font-bold uppercase tracking-wider mb-1.5">Confirm Password *</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input type="password" value={form.confirm} onChange={update('confirm')} placeholder="Repeat password"
                                    className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-[#1a237e] transition-all" />
                            </div>
                        </div>

                        <p className="text-gray-400 text-xs">By creating an account, you agree to our <a href="#" className="text-[#1a237e] hover:underline">Terms</a> and <a href="#" className="text-[#1a237e] hover:underline">Privacy Policy</a>.</p>

                        <button type="submit" disabled={loading}
                            className="w-full bg-[#1a237e] hover:bg-[#0d1459] disabled:opacity-60 text-white font-black py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-md shadow-blue-900/20">
                            {loading ? <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" /> : <ArrowRight className="w-4 h-4" />}
                            {loading ? 'Creating Account...' : 'Create Account'}
                        </button>
                    </form>
                </div>

                <p className="text-center mt-5 text-gray-400 text-sm">
                    Already have an account? <Link href="/login" className="text-[#1a237e] font-bold hover:underline">Sign In</Link>
                </p>
            </div>
        </main>
    );
}
