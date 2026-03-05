'use client';
import { usePathname } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import CartSlideout from '@/components/cart/CartSlideout';
import AnnouncementBar from '@/components/layout/AnnouncementBar';

// Wraps children: admin pages skip the customer navbar/cart completely
export default function ConditionalLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAdmin = pathname.startsWith('/admin');

    if (isAdmin) {
        // Admin pages render with zero customer chrome
        return <>{children}</>;
    }

    return (
        <>
            <AnnouncementBar />
            <Navbar />
            <CartSlideout />
            <div className="pt-[140px]">{children}</div>
        </>
    );
}
