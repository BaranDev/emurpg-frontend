const EmuconFeatureCard = ({
  icon: Icon,
  title,
  description,
  descriptionTr,
}) => {
  return (
    <div
      className="group relative p-2 md:p-6 lg:p-8 rounded-xl text-center transition-all duration-300 border border-forest-medium/70 hover:border-forest-light/70 hover:-translate-y-1.5 hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden"
      style={{
        background:
          "linear-gradient(160deg, rgba(26, 46, 26, 0.75), rgba(13, 31, 13, 0.9))",
      }}
    >
      {/* Top gradient highlight */}
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(107,155,107,0.4), transparent)",
        }}
      />

      {/* Decorative corner flourishes */}
      <div className="absolute top-0 left-0 w-10 h-10 border-t-2 border-l-2 border-forest-light/25 rounded-tl-xl transition-colors duration-300 group-hover:border-gold/30" />
      <div className="absolute top-0 right-0 w-10 h-10 border-t-2 border-r-2 border-forest-light/25 rounded-tr-xl transition-colors duration-300 group-hover:border-gold/30" />
      <div className="absolute bottom-0 left-0 w-10 h-10 border-b-2 border-l-2 border-forest-light/25 rounded-bl-xl transition-colors duration-300 group-hover:border-gold/30" />
      <div className="absolute bottom-0 right-0 w-10 h-10 border-b-2 border-r-2 border-forest-light/25 rounded-br-xl transition-colors duration-300 group-hover:border-gold/30" />

      {/* Icon container */}
      <div className="relative mb-3 md:mb-5 lg:mb-6">
        {/* Icon ring glow */}
        <div
          className="absolute inset-0 m-auto w-20 h-20 md:w-24 md:h-24 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background:
              "radial-gradient(circle, rgba(201,162,39,0.2) 0%, transparent 70%)",
          }}
        />

        {/* Icon circle */}
        <div
          className="relative w-16 h-16 md:w-[72px] md:h-[72px] mx-auto rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110"
          style={{
            background: "linear-gradient(145deg, #3a5c3a, #4a7c4a)",
            boxShadow:
              "inset 0 2px 4px rgba(255,255,255,0.15), inset 0 -2px 4px rgba(0,0,0,0.2), 0 6px 16px rgba(0,0,0,0.35)",
            border: "1px solid rgba(107,155,107,0.3)",
          }}
        >
          {/* Inner highlight */}
          <div className="absolute inset-1 rounded-full bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />

          {typeof Icon === "function" ? (
            <Icon size={28} className="text-gold-light drop-shadow-sm" />
          ) : (
            <span className="text-2xl">{Icon}</span>
          )}
        </div>
      </div>

      {/* Title */}
      <h4 className="font-cinzel text-base md:text-xl text-cream mb-2 md:mb-3 transition-colors duration-300 group-hover:text-gold-light">
        {title}
      </h4>

      {/* English description */}
      <p className="text-emucon-text-secondary text-xs md:text-base leading-relaxed mb-1">
        {description}
      </p>

      {/* Turkish translation */}
      {descriptionTr && (
        <div className="mt-2 md:mt-4 pt-2 md:pt-4 border-t border-forest-medium/40">
          <p className="text-emucon-text-muted text-xs md:text-sm italic leading-relaxed">
            {descriptionTr}
          </p>
        </div>
      )}

      {/* Ambient glow on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-xl"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(107,155,107,0.08) 0%, transparent 60%)",
        }}
      />
    </div>
  );
};

export default EmuconFeatureCard;
