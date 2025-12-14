import { ShieldIcon, StarIcon } from "./EmuconIcons";

const EmuconStatsRow = ({ stats, variant = "forest" }) => {
  const isGold = variant === "gold";
  const borderClass = isGold
    ? "border-gold/30 hover:border-gold/40"
    : "border-forest-medium/50 hover:border-forest-light/40";

  return (
    <div
      className={`relative flex justify-center gap-3 md:gap-6 lg:gap-12 flex-wrap my-6 md:my-10 lg:my-12 p-4 md:p-6 lg:p-10 rounded-xl border ${borderClass} overflow-hidden transition-all duration-300`}
      style={{
        background:
          "linear-gradient(160deg, rgba(26, 46, 26, 0.6), rgba(13, 31, 13, 0.8))",
      }}
    >
      {/* Top edge highlight */}
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{
          background: isGold
            ? "linear-gradient(90deg, transparent, rgba(201,162,39,0.25), transparent)"
            : "linear-gradient(90deg, transparent, rgba(107,155,107,0.25), transparent)",
        }}
      />

      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.04]">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <ShieldIcon size={180} className="text-forest-light" />
        </div>
      </div>

      {/* Corner decorations */}
      <div className="absolute top-0 left-0 w-10 h-10 border-t-2 border-l-2 border-forest-light/20 rounded-tl-xl" />
      <div className="absolute top-0 right-0 w-10 h-10 border-t-2 border-r-2 border-forest-light/20 rounded-tr-xl" />
      <div className="absolute bottom-0 left-0 w-10 h-10 border-b-2 border-l-2 border-forest-light/20 rounded-bl-xl" />
      <div className="absolute bottom-0 right-0 w-10 h-10 border-b-2 border-r-2 border-forest-light/20 rounded-br-xl" />

      {stats.map((stat, index) => (
        <div
          key={index}
          className="relative text-center px-4 md:px-6 lg:px-8 py-3 md:py-4 group"
        >
          {/* Stat card inner container */}
          <div
            className="relative px-4 md:px-6 lg:px-8 py-3 md:py-4 rounded-lg transition-all duration-300 group-hover:scale-[1.02]"
            style={{
              background:
                "linear-gradient(145deg, rgba(45, 74, 45, 0.3), rgba(26, 46, 26, 0.4))",
              border: "1px solid rgba(74, 124, 74, 0.2)",
            }}
          >
            {/* Star decoration */}
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
              <StarIcon
                size={16}
                className="text-gold/40 group-hover:text-gold/60 transition-colors"
              />
            </div>

            {/* Stat number with glow effect */}
            <div
              className="font-cinzel text-2xl md:text-3xl lg:text-5xl text-gold font-bold transition-all duration-300 group-hover:scale-105 mb-1 md:mb-2"
              style={{
                textShadow:
                  "0 0 25px rgba(201,162,39,0.35), 0 2px 10px rgba(0,0,0,0.3)",
              }}
            >
              {stat.number}
            </div>

            {/* Label */}
            <div className="text-emucon-text-secondary text-xs md:text-sm uppercase tracking-wider leading-relaxed">
              {stat.label}
            </div>

            {/* Inner glow on hover */}
            <div
              className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse at 50% 30%, rgba(201,162,39,0.08) 0%, transparent 70%)",
              }}
            />
          </div>

          {/* Decorative divider (not on last item) */}
          {index < stats.length - 1 && (
            <div className="hidden lg:block absolute right-0 top-1/2 transform translate-x-2 -translate-y-1/2 h-16 w-px bg-gradient-to-b from-transparent via-forest-light/25 to-transparent" />
          )}
        </div>
      ))}
    </div>
  );
};

export default EmuconStatsRow;
