'use client';

import { useState } from 'react';
import { Star, ThumbsUp, BadgeCheck, Camera, X } from 'lucide-react';

export interface Review {
    id: string;
    authorName: string;
    rating: number;
    title: string;
    body: string;
    date: string;
    verified: boolean;
    helpful: number;
    images?: string[];
}

interface Props {
    productId: string;
    reviews: Review[];
    onAddReview?: (review: Omit<Review, 'id' | 'date' | 'helpful' | 'verified'>) => void;
}

function StarPicker({ value, onChange }: { value: number; onChange: (n: number) => void }) {
    const [hover, setHover] = useState(0);
    return (
        <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map(i => (
                <button
                    key={i}
                    type="button"
                    onMouseEnter={() => setHover(i)}
                    onMouseLeave={() => setHover(0)}
                    onClick={() => onChange(i)}
                    className="p-0.5 transition-transform hover:scale-125"
                >
                    <Star className={`w-7 h-7 transition-colors ${i <= (hover || value) ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`} />
                </button>
            ))}
            <span className="text-gray-500 text-sm ml-2">{['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][hover || value] || ''}</span>
        </div>
    );
}

function RatingBar({ label, pct }: { label: string; pct: number }) {
    return (
        <div className="flex items-center gap-2 text-xs">
            <span className="text-amber-500 font-bold w-6">{label}★</span>
            <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                <div className="h-full bg-amber-400 rounded-full" style={{ width: `${pct}%` }} />
            </div>
            <span className="text-gray-400 w-8 text-right">{pct}%</span>
        </div>
    );
}

function ReviewCard({ review }: { review: Review }) {
    const [helpful, setHelpful] = useState(review.helpful);
    return (
        <div className="border-b border-gray-100 pb-5">
            <div className="flex items-start justify-between mb-2">
                <div>
                    <p className="font-bold text-gray-800 text-sm">{review.authorName}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                        <div className="flex items-center gap-0.5">
                            {[1, 2, 3, 4, 5].map(i => (
                                <Star key={i} className={`w-3.5 h-3.5 ${i <= review.rating ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200'}`} />
                            ))}
                        </div>
                        {review.verified && (
                            <span className="flex items-center gap-1 text-[11px] text-green-700 font-semibold">
                                <BadgeCheck className="w-3 h-3" /> Verified Purchase
                            </span>
                        )}
                    </div>
                </div>
                <span className="text-gray-400 text-xs">{review.date}</span>
            </div>
            {review.title && <p className="font-bold text-gray-800 text-sm mb-1">{review.title}</p>}
            <p className="text-gray-600 text-sm leading-relaxed">{review.body}</p>
            {review.images && review.images.length > 0 && (
                <div className="flex gap-2 mt-3">
                    {review.images.map((img, i) => (
                        <img key={i} src={img} alt="" className="w-16 h-16 rounded-lg object-cover border border-gray-200" />
                    ))}
                </div>
            )}
            <button
                onClick={() => setHelpful(h => h + 1)}
                className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-[#1a237e] mt-3 transition-colors"
            >
                <ThumbsUp className="w-3.5 h-3.5" /> Helpful ({helpful})
            </button>
        </div>
    );
}

const MOCK_REVIEWS: Review[] = [
    { id: 'r1', authorName: 'Arjun M.', rating: 5, title: 'Best protein I\'ve ever had!', body: 'Incredible taste, mixes perfectly with just a shaker. Saw noticeable muscle gain in 4 weeks. Will definitely buy again.', date: '15 Feb 2026', verified: true, helpful: 43 },
    { id: 'r2', authorName: 'Priya K.', rating: 4, title: 'Great quality, slightly sweet', body: 'The chocolate flavour is rich and not artificial. 27g protein is accurate per label. Slight sweetness might not suit everyone.', date: '10 Feb 2026', verified: true, helpful: 28 },
    { id: 'r3', authorName: 'Rohan S.', rating: 5, title: 'Excellent – worth every rupee', body: 'I compared this with ON Gold Standard and this is equally good at half the price for Indian customers. Digestion is smooth.', date: '5 Feb 2026', verified: false, helpful: 17 },
    { id: 'r4', authorName: 'Sneha P.', rating: 3, title: 'Good but delivery was slow', body: 'Product itself is great. But delivery took 5 days when promised 2. V-Node team was helpful when I reached out.', date: '28 Jan 2026', verified: true, helpful: 9 },
];

const RATING_BREAKDOWN = [
    { label: '5', pct: 62 }, { label: '4', pct: 21 }, { label: '3', pct: 10 }, { label: '2', pct: 4 }, { label: '1', pct: 3 },
];

export default function ReviewSection({ productId, reviews: initialReviews, onAddReview }: Props) {
    const [reviews, setReviews] = useState<Review[]>(initialReviews.length > 0 ? initialReviews : MOCK_REVIEWS);
    const [showForm, setShowForm] = useState(false);
    const [rating, setRating] = useState(0);
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [submitting, setSubmit] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const avgRating = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!rating || !body) return;
        setSubmit(true);
        await new Promise(r => setTimeout(r, 600));
        const newReview: Review = {
            id: `r${Date.now()}`, authorName: 'You', rating, title, body,
            date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
            verified: false, helpful: 0,
        };
        setReviews(rv => [newReview, ...rv]);
        setSubmitted(true);
        setShowForm(false);
        setRating(0); setTitle(''); setBody('');
        setSubmit(false);
    };

    return (
        <div className="mt-10 bg-white rounded-xl border border-gray-100 p-6">
            <h2 className="font-black text-gray-900 text-lg mb-6">Customer Reviews</h2>

            <div className="grid md:grid-cols-[200px,1fr] gap-8 mb-8">
                {/* Overall rating */}
                <div className="text-center bg-gray-50 rounded-xl p-5">
                    <p className="text-5xl font-black text-gray-900">{avgRating.toFixed(1)}</p>
                    <div className="flex justify-center gap-0.5 my-2">
                        {[1, 2, 3, 4, 5].map(i => (
                            <Star key={i} className={`w-4 h-4 ${i <= Math.round(avgRating) ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200'}`} />
                        ))}
                    </div>
                    <p className="text-gray-500 text-xs">Based on {reviews.length} reviews</p>
                </div>

                {/* Rating breakdown */}
                <div className="space-y-2">
                    {RATING_BREAKDOWN.map(({ label, pct }) => <RatingBar key={label} label={label} pct={pct} />)}
                </div>
            </div>

            {/* Write review button */}
            {submitted && (
                <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-xl mb-4 font-semibold">
                    ✅ Thank you! Your review has been submitted.
                </div>
            )}
            <button
                onClick={() => setShowForm(s => !s)}
                className="mb-6 flex items-center gap-2 px-5 py-2.5 border-2 border-[#1a237e] text-[#1a237e] font-bold text-sm rounded-xl hover:bg-[#f0f4ff] transition-all"
            >
                <Star className="w-4 h-4" /> Write a Review
            </button>

            {/* Write review form */}
            {showForm && (
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-gray-800">Your Review</h3>
                        <button onClick={() => setShowForm(false)}><X className="w-4 h-4 text-gray-400" /></button>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Overall Rating *</label>
                            <StarPicker value={rating} onChange={setRating} />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Review Title</label>
                            <input
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                placeholder="Summarize your experience"
                                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 bg-white focus:outline-none focus:border-[#1a237e]"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Your Review *</label>
                            <textarea
                                value={body}
                                onChange={e => setBody(e.target.value)}
                                rows={4}
                                placeholder="What did you like or dislike? How was the taste, mixability, results..."
                                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 bg-white focus:outline-none focus:border-[#1a237e] resize-none"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={!rating || !body || submitting}
                            className="px-6 py-2.5 bg-[#1a237e] hover:bg-[#0d1459] disabled:opacity-50 text-white font-bold text-sm rounded-xl transition-all"
                        >
                            {submitting ? 'Submitting...' : 'Submit Review'}
                        </button>
                    </form>
                </div>
            )}

            {/* Review list */}
            <div className="space-y-5">
                {reviews.map(review => <ReviewCard key={review.id} review={review} />)}
            </div>
        </div>
    );
}
