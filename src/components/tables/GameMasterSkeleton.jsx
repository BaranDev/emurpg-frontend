import { FaScroll } from "react-icons/fa";

const QUOTES = [
  "The dice are gathering\u2026",
  "A quest is brewing\u2026",
  "Heroes assemble\u2026",
  "Scrolls are unfurling\u2026",
  "The tavern stirs\u2026",
  "Legends awaken\u2026",
];

const SkeletonCard = ({ quote }) => (
  <div className="relative bg-gradient-to-b from-gray-800 to-gray-900 rounded-lg overflow-hidden p-5 md:p-6">
    {/* Decorative corners — same as GameMasterCard */}
    <div className="absolute top-0 left-0 w-10 h-10 border-t-2 border-l-2 border-yellow-500/30 rounded-tl-lg" />
    <div className="absolute top-0 right-0 w-10 h-10 border-t-2 border-r-2 border-yellow-500/30 rounded-tr-lg" />
    <div className="absolute bottom-0 left-0 w-10 h-10 border-b-2 border-l-2 border-yellow-500/30 rounded-bl-lg" />
    <div className="absolute bottom-0 right-0 w-10 h-10 border-b-2 border-r-2 border-yellow-500/30 rounded-br-lg" />

    {/* animate-pulse on parent — children inherit the pulse */}
    <div className="animate-pulse relative z-10">
      {/* Photo placeholder */}
      <div className="relative w-28 h-28 md:w-32 md:h-32 mx-auto mb-5">
        <div className="absolute inset-2 rounded-full border-2 border-yellow-500/30 p-1">
          <div className="w-full h-full rounded-full bg-slate-700" />
        </div>
      </div>

      {/* Scroll divider */}
      <div className="flex items-center justify-center mb-2">
        <div className="h-px w-12 bg-gradient-to-r from-transparent via-yellow-500/30 to-transparent" />
        <FaScroll className="text-yellow-500/50 mx-2" />
        <div className="h-px w-12 bg-gradient-to-r from-transparent via-yellow-500/30 to-transparent" />
      </div>

      {/* Name bar */}
      <div className="flex justify-center mb-2">
        <div className="h-5 w-36 rounded bg-slate-700" />
      </div>

      {/* Title bar */}
      <div className="flex justify-center mb-4">
        <div className="h-4 w-24 rounded bg-slate-700" />
      </div>

      {/* Quote */}
      <div className="relative mt-4 pt-4 border-t border-yellow-500/20">
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-800 px-3">
          <div className="w-2 h-2 bg-yellow-500/30 rotate-45" />
        </div>
        <p className="text-yellow-500/40 italic text-sm text-center">{quote}</p>
      </div>
    </div>
  </div>
);

const GameMasterSkeleton = () => {
  // Pick 3 unique quotes
  const shuffled = [...QUOTES].sort(() => Math.random() - 0.5);
  const picked = shuffled.slice(0, 3);

  return (
    <>
      {picked.map((quote, i) => (
        <SkeletonCard key={i} quote={quote} />
      ))}
    </>
  );
};

export default GameMasterSkeleton;
