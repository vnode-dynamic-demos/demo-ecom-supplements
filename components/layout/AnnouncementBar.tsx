'use client';

const MESSAGES = [
    '🎉 PAYDAY SALE IS LIVE! Up to 60% Off on Top Protein Brands',
    '✅ 100% Authentic Products — Sourced Directly from Brands',
    '🚚 Free Delivery on Orders Above ₹999',
    '🏷️ Use code VNODE10 for extra 10% off | WELCOME20 for first order',
    '⭐ 2 Lakh+ Happy Customers Across India',
    '🔬 FSSAI & NSF Certified Products | Lab Tested Every Batch',
    '💳 No-Cost EMI Available | Pay via UPI, Cards, Wallets',
];

export default function AnnouncementBar() {
    const doubled = [...MESSAGES, ...MESSAGES];

    return (
        <div className="fixed top-0 left-0 right-0 bg-[#1a237e] text-white text-xs font-semibold py-2 overflow-hidden z-50 h-8">
            <div className="animate-marquee whitespace-nowrap flex items-center">
                {doubled.map((msg, i) => (
                    <span key={i} className="flex items-center gap-3 flex-shrink-0">
                        <span>{msg}</span>
                        <span className="text-blue-300 opacity-60 mx-2">|</span>
                    </span>
                ))}
            </div>
        </div>
    );
}
