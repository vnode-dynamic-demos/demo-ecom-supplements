'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
    LayoutDashboard, Package, Tag, Megaphone, Gift, Zap, ShoppingCart,
    BarChart3, LogOut, Star, Users, Settings, Image as ImageIcon
} from 'lucide-react';

const NAV = [
    { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/admin/products', icon: Package, label: 'Products' },
    { href: '/admin/orders', icon: ShoppingCart, label: 'Orders' },
    { href: '/admin/customers', icon: Users, label: 'Customers' },
    { href: '/admin/hero-banners', icon: ImageIcon, label: 'Hero Banners' },
    { href: '/admin/banners', icon: Megaphone, label: 'Promo Banners' },
    { href: '/admin/coupons', icon: Tag, label: 'Coupons' },
    { href: '/admin/offers', icon: Gift, label: 'Offers & GWP' },
    { href: '/admin/analytics', icon: BarChart3, label: 'Analytics' },
    { href: '/admin/reviews', icon: Star, label: 'Reviews' },
    { href: '/admin/products/new', icon: Zap, label: 'Add Product' },
    { href: '/admin/settings', icon: Settings, label: 'Settings' },
];


export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const [authed, setAuthed] = useState<boolean | null>(null);

    useEffect(() => {
        if (pathname === '/admin/login') { setAuthed(true); return; }
        const session = localStorage.getItem('vnode-admin-session');
        if (session) {
            try {
                const { loggedIn } = JSON.parse(session);
                setAuthed(!!loggedIn);
                if (!loggedIn) router.replace('/admin/login');
            } catch { router.replace('/admin/login'); }
        } else {
            router.replace('/admin/login');
        }
    }, [pathname, router]);

    const handleLogout = () => {
        localStorage.removeItem('vnode-admin-session');
        router.push('/admin/login');
    };

    if (authed === null) return null; // Loading
    if (pathname === '/admin/login') return <>{children}</>;

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <aside className="w-56 bg-[#1a237e] flex flex-col flex-shrink-0 shadow-xl">
                <div className="px-5 py-4 border-b border-white/10">
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-[#ff6b35] rounded-lg">
                            <Zap className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-black text-white text-sm">V-Node <span className="text-[#ff6b35]">Admin</span></span>
                    </div>
                    <div className="mt-2.5 bg-white/10 rounded-lg px-3 py-1.5">
                        <p className="text-blue-200 text-[10px] font-bold uppercase tracking-wider">Demo Mode</p>
                        <p className="text-blue-300/60 text-[10px]">Data in localStorage</p>
                    </div>
                </div>

                <nav className="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto">
                    {NAV.map(({ href, icon: Icon, label }) => {
                        const active = pathname === href || (href !== '/admin' && pathname.startsWith(href));
                        return (
                            <Link
                                key={href}
                                href={href}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${active
                                    ? 'bg-white text-[#1a237e] shadow-md'
                                    : 'text-blue-200 hover:text-white hover:bg-white/10'
                                    }`}
                            >
                                <Icon className="w-4 h-4 flex-shrink-0" />
                                {label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-3 border-t border-white/10 space-y-1">
                    <Link href="/" className="flex items-center gap-2 px-3 py-2 text-blue-200 hover:text-white text-xs font-semibold rounded-lg hover:bg-white/10 transition-all">
                        ← Back to Store
                    </Link>
                    <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2 text-blue-200 hover:text-red-300 text-xs font-semibold rounded-lg hover:bg-white/10 transition-all">
                        <LogOut className="w-3.5 h-3.5" /> Log Out
                    </button>
                </div>
            </aside>

            {/* Main */}
            <main className="flex-1 overflow-auto">
                {children}
            </main>
        </div>
    );
}
