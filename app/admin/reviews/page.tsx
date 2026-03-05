'use client';
import { useState } from 'react';
import { Star, ThumbsUp, CheckCircle, XCircle, Search } from 'lucide-react';

// TODO: Replace with real Supabase query:
// const { data } = await supabase.from('reviews').select('*, products(name)').order('created_at', { ascending: false });

const MOCK_REVIEWS = [
    { id: '1', product: 'HyperWhey Pro 2kg', author: 'Rahul M.', rating: 5, title: 'Amazing protein!', body: 'Best whey I\'ve ever tried. Mixes perfectly and tastes great.', verified: true, helpful: 24, date: '2026-02-28', approved: true },
    { id: '2', product: 'NitroBlast Pre-Workout', author: 'Priya K.', rating: 4, title: 'Good pump, strong taste', body: 'Great energy boost but the flavor is a bit strong for me.', verified: true, helpful: 11, date: '2026-02-25', approved: true },
    { id: '3', product: 'PureCre Monohydrate', author: 'Arjun S.', rating: 2, title: 'Clumps a lot', body: 'The creatine clumps in water. Expected better for this price.', verified: false, helpful: 3, date: '2026-02-20', approved: false },
    { id: '4', product: 'HyperWhey Pro 1kg', author: 'Sneha R.', rating: 5, title: 'Chocolate flavor is insane', body: 'Totally hooked on the chocolate fudge variant. Reordering!', verified: true, helpful: 18, date: '2026-02-18', approved: true },
];

function Stars({ rating }: { rating: number }) {
    return (
        <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map(i => (
                <Star key={i} className={`w-3.5 h-3.5 ${i <= rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`} />
            ))}
        </div>
    );
}

export default function AdminReviewsPage() {
    const [reviews, setReviews] = useState(MOCK_REVIEWS);
    const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('all');
    const [search, setSearch] = useState('');

    const filtered = reviews
        .filter(r => filter === 'all' ? true : filter === 'approved' ? r.approved : !r.approved)
        .filter(r => !search || r.product.toLowerCase().includes(search.toLowerCase()) || r.author.toLowerCase().includes(search.toLowerCase()));

    const toggle = (id: string) =>
        setReviews(prev => prev.map(r => r.id === id ? { ...r, approved: !r.approved } : r));

    const remove = (id: string) => setReviews(prev => prev.filter(r => r.id !== id));

    return (
        <div className="p-6 space-y-5">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-black text-gray-900">Reviews</h1>
                <p className="text-gray-400 text-sm mt-0.5">Moderate customer product reviews</p>
            </div>

            {/* Controls */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by product or customer..."
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1a237e]" />
                </div>
                <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
                    {(['all', 'approved', 'pending'] as const).map(f => (
                        <button key={f} onClick={() => setFilter(f)}
                            className={`px-4 py-1.5 rounded-lg text-sm font-bold capitalize transition-all ${filter === f ? 'bg-white text-[#1a237e] shadow-sm' : 'text-gray-500'}`}>
                            {f} {f === 'pending' && <span className="ml-1 bg-red-100 text-red-600 text-xs font-black px-1.5 py-0.5 rounded-full">{reviews.filter(r => !r.approved).length}</span>}
                        </button>
                    ))}
                </div>
            </div>

            {/* Reviews list */}
            <div className="space-y-3">
                {filtered.length === 0 && (
                    <div className="text-center py-12 text-gray-400">No reviews found.</div>
                )}
                {filtered.map(review => (
                    <div key={review.id} className={`bg-white rounded-2xl border p-5 shadow-sm ${!review.approved ? 'border-amber-200 bg-amber-50/30' : 'border-gray-100'}`}>
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                                <div className="flex flex-wrap items-center gap-2 mb-1">
                                    <Stars rating={review.rating} />
                                    {review.verified && (
                                        <span className="text-xs bg-green-100 text-green-700 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                                            <CheckCircle className="w-3 h-3" /> Verified
                                        </span>
                                    )}
                                    {!review.approved && (
                                        <span className="text-xs bg-amber-100 text-amber-700 font-bold px-2 py-0.5 rounded-full">Pending</span>
                                    )}
                                </div>
                                <p className="font-bold text-gray-900">{review.title}</p>
                                <p className="text-gray-500 text-sm mt-1 leading-relaxed">{review.body}</p>
                                <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-gray-400">
                                    <span>by <strong className="text-gray-600">{review.author}</strong></span>
                                    <span>on <strong className="text-gray-600">{review.product}</strong></span>
                                    <span>{review.date}</span>
                                    <div className="flex items-center gap-1"><ThumbsUp className="w-3 h-3" /> {review.helpful} helpful</div>
                                </div>
                            </div>
                            <div className="flex flex-col gap-2 flex-shrink-0">
                                <button onClick={() => toggle(review.id)}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${review.approved ? 'bg-amber-100 text-amber-700 hover:bg-amber-200' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}>
                                    {review.approved ? <><XCircle className="w-3.5 h-3.5" /> Hide</> : <><CheckCircle className="w-3.5 h-3.5" /> Approve</>}
                                </button>
                                <button onClick={() => remove(review.id)}
                                    className="px-3 py-1.5 rounded-lg text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 transition-all">
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
