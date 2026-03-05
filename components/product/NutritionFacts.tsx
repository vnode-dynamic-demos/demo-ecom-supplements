import type { NutritionFact } from '@/types';

interface NutritionFactsProps {
    servingSize: string;
    servingsPerContainer: number;
    facts: NutritionFact[];
}

export default function NutritionFacts({ servingSize, servingsPerContainer, facts }: NutritionFactsProps) {
    return (
        <div className="bg-zinc-900 border-2 border-zinc-700 rounded-2xl overflow-hidden font-mono">
            {/* Header */}
            <div className="bg-zinc-800 px-5 py-4 border-b-4 border-zinc-600">
                <h3 className="text-white font-black text-2xl">Nutrition Facts</h3>
                <p className="text-zinc-400 text-sm">{servingsPerContainer} servings per container</p>
                <div className="flex items-baseline justify-between mt-2">
                    <span className="text-white font-bold text-sm">Serving size</span>
                    <span className="text-white font-black text-lg">{servingSize}</span>
                </div>
            </div>

            {/* Calories */}
            <div className="px-5 py-3 border-b-8 border-zinc-600">
                <p className="text-zinc-400 text-xs font-bold">Amount per serving</p>
                <div className="flex items-baseline justify-between">
                    <span className="text-white font-black text-5xl">
                        {facts.find((f) => f.name === 'Calories')?.amount ?? 0}
                    </span>
                    <span className="text-white text-xl font-black">Calories</span>
                </div>
            </div>

            {/* % DV header */}
            <div className="px-5 py-1.5 border-b border-zinc-700 flex justify-end">
                <span className="text-zinc-400 text-xs font-bold">% Daily Value*</span>
            </div>

            {/* Nutrients */}
            {facts
                .filter((f) => f.name !== 'Calories')
                .map((fact, i) => (
                    <div
                        key={i}
                        className={`px-5 py-2 flex items-center justify-between border-b border-zinc-800 ${fact.bold ? 'border-b-4 border-zinc-700' : ''}`}
                    >
                        <span className={`text-white text-sm ${fact.bold ? 'font-black' : fact.indent ? 'pl-4 text-zinc-300 font-normal' : 'font-semibold'}`}>
                            {fact.name}{' '}
                            <span className="text-zinc-400 font-normal">{fact.amount}{fact.unit}</span>
                        </span>
                        {fact.dailyValuePct !== undefined && (
                            <span className="text-white font-black text-sm">{fact.dailyValuePct}%</span>
                        )}
                    </div>
                ))}

            {/* Footnote */}
            <div className="px-5 py-3">
                <p className="text-zinc-500 text-[10px] leading-relaxed">
                    * The % Daily Value (DV) tells you how much a nutrient in a serving of food contributes to a daily diet. 2,000 calories a day is used for general nutrition advice.
                </p>
            </div>
        </div>
    );
}
