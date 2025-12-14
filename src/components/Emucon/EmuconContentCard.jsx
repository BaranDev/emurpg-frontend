import { LeafIcon } from "./EmuconIcons";

const CornerOrnament = ({ position, isGold }) => {
  const borderColor = isGold
    ? "border-gold/50 group-hover:border-gold/70"
    : "border-forest-light/35 group-hover:border-forest-light/50";
  const leafColor = isGold
    ? "text-gold/35 group-hover:text-gold/50"
    : "text-forest-light/25 group-hover:text-forest-light/40";

  const positionClasses = {
    "top-left": "top-0 left-0 border-t-2 border-l-2 rounded-tl-xl",
    "top-right": "top-0 right-0 border-t-2 border-r-2 rounded-tr-xl",
    "bottom-left": "bottom-0 left-0 border-b-2 border-l-2 rounded-bl-xl",
    "bottom-right": "bottom-0 right-0 border-b-2 border-r-2 rounded-br-xl",
  };

  const leafPositionClasses = {
    "top-left": "top-2 left-2 rotate-[225deg]",
    "top-right": "top-2 right-2 rotate-[-45deg]",
    "bottom-left": "bottom-2 left-2 rotate-[135deg]",
    "bottom-right": "bottom-2 right-2 rotate-[45deg]",
  };

  return (
    <>
      <div
        className={`absolute w-10 h-10 md:w-12 md:h-12 ${borderColor} ${positionClasses[position]} transition-colors duration-300`}
      />
      <div className={`absolute ${leafPositionClasses[position]}`}>
        <LeafIcon
          size={14}
          className={`${leafColor} transition-colors duration-300`}
        />
      </div>
    </>
  );
};

const EmuconContentCard = ({
  children,
  goldBorder = false,
  className = "",
}) => {
  const borderClass = goldBorder
    ? "border-gold/35 hover:border-gold/50"
    : "border-forest-medium/70 hover:border-forest-light/50";
  const innerBorderClass = goldBorder
    ? "border-gold/15"
    : "border-forest-light/10";

  return (
    <div
      className={`group relative rounded-xl p-2 md:p-6 lg:p-10 mb-2 md:mb-8 border ${borderClass} transition-all duration-300 overflow-hidden hover:shadow-[0_10px_40px_rgba(0,0,0,0.35)] ${className}`}
      style={{
        background:
          "linear-gradient(160deg, rgba(26, 46, 26, 0.8), rgba(13, 31, 13, 0.92))",
      }}
    >
      {/* Top edge highlight */}
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{
          background: goldBorder
            ? "linear-gradient(90deg, transparent, rgba(201,162,39,0.3), transparent)"
            : "linear-gradient(90deg, transparent, rgba(107,155,107,0.25), transparent)",
        }}
      />

      {/* Subtle gradient overlay on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: goldBorder
            ? "radial-gradient(ellipse at 50% 0%, rgba(201,162,39,0.06) 0%, transparent 50%)"
            : "radial-gradient(ellipse at 50% 0%, rgba(107,155,107,0.05) 0%, transparent 50%)",
        }}
      />

      {/* Inner border frame */}
      <div
        className={`absolute top-4 left-4 right-4 bottom-4 border ${innerBorderClass} rounded-lg pointer-events-none transition-colors duration-300`}
      />

      {/* Corner ornaments with leaves */}
      <CornerOrnament position="top-left" isGold={goldBorder} />
      <CornerOrnament position="top-right" isGold={goldBorder} />
      <CornerOrnament position="bottom-left" isGold={goldBorder} />
      <CornerOrnament position="bottom-right" isGold={goldBorder} />

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default EmuconContentCard;
