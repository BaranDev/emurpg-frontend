import { LeafIcon, ShieldIcon } from "./EmuconIcons";

const EmuconDivider = ({ variant = "forest" }) => {
  const isGold = variant === "gold";
  const lineColor = isGold ? "#c9a227" : "#4a7c4a";
  const iconColor = isGold ? "text-gold" : "text-forest-light";

  return (
    <div className="w-full py-2 md:py-6 lg:py-8 flex items-center justify-center gap-2 md:gap-4 my-2 md:my-5 lg:my-6">
      {/* Left leaf */}
      <LeafIcon
        size={14}
        className={`${iconColor} opacity-40 transform -scale-x-100`}
      />

      {/* Left line */}
      <div
        className="flex-1 max-w-[150px] md:max-w-[200px] h-px"
        style={{
          background: `linear-gradient(90deg, transparent, ${lineColor}40, ${lineColor})`,
        }}
      />

      {/* Center ornament - shield */}
      <div className="relative">
        <ShieldIcon size={20} className={`${iconColor} opacity-60`} />
        {/* Inner glow */}
        <div
          className="absolute inset-0 blur-sm"
          style={{
            background: isGold
              ? "radial-gradient(circle, rgba(201,162,39,0.3) 0%, transparent 70%)"
              : "radial-gradient(circle, rgba(107,155,107,0.3) 0%, transparent 70%)",
          }}
        />
      </div>

      {/* Right line */}
      <div
        className="flex-1 max-w-[150px] md:max-w-[200px] h-px"
        style={{
          background: `linear-gradient(90deg, ${lineColor}, ${lineColor}40, transparent)`,
        }}
      />

      {/* Right leaf */}
      <LeafIcon size={14} className={`${iconColor} opacity-40`} />
    </div>
  );
};

export default EmuconDivider;
