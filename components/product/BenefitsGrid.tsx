import type { ProductBenefit } from '@/types';

interface BenefitsGridProps {
    benefits: ProductBenefit[];
}

export default function BenefitsGrid({ benefits }: BenefitsGridProps) {
    if (!benefits || benefits.length === 0) return null;

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {benefits.map((benefit, i) => (
                <div
                    key={i}
                    className="flex gap-4 bg-zinc-900 border border-zinc-800 hover:border-orange-500/30 rounded-2xl p-4 transition-all group"
                >
                    <div className="text-3xl flex-shrink-0 mt-0.5">{benefit.icon}</div>
                    <div>
                        <h4 className="text-white font-bold text-sm mb-1 group-hover:text-orange-400 transition-colors">
                            {benefit.title}
                        </h4>
                        <p className="text-zinc-400 text-xs leading-relaxed">{benefit.description}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}
