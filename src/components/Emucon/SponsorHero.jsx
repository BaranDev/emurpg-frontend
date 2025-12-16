import { CrownIcon } from "./EmuconIcons";

const SponsorHero = () => {
  return (
    <section className="min-h-[80vh] relative flex flex-col items-center justify-center text-center px-5 py-20 overflow-hidden bg-transparent">
      {/* Gold magical overlay for sponsor page */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 100% 60% at 50% 0%, rgba(201, 162, 39, 0.2) 0%, transparent 50%),
            radial-gradient(ellipse 80% 40% at 30% 20%, rgba(232, 212, 139, 0.15) 0%, transparent 40%),
            radial-gradient(ellipse 60% 30% at 70% 30%, rgba(201, 162, 39, 0.12) 0%, transparent 35%)
          `,
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-[900px]">
        {/* Badge */}
        <div
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full mb-6 md:mb-8 text-forest-dark font-semibold text-xs md:text-sm uppercase tracking-[0.15em]"
          style={{
            background: "linear-gradient(135deg, #c9a227, #8a6d1a)",
          }}
        >
          <CrownIcon className="w-4 h-4 text-forest-dark" size={14} />
          <span>Sponsorship Opportunities</span>
        </div>

        {/* Title */}
        <h1
          className="font-cinzel text-3xl md:text-5xl lg:text-6xl font-bold text-cream mb-4 tracking-wide"
          style={{ textShadow: "0 4px 20px rgba(0,0,0,0.5)" }}
        >
          Partner with EMUCON 2025
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-gold-light mb-6 md:mb-8 font-light max-w-[700px] mx-auto">
          5 hours. 41 clubs. Thousands of students. Direct access to Gen Z when they're most engaged.
        </p>

        {/* CTA */}
        <a
          href="#contact"
          className="inline-block px-8 md:px-10 py-4 text-forest-dark font-bold rounded border border-gold-light uppercase tracking-wider text-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_40px_rgba(201,162,39,0.5)]"
          style={{
            background: "linear-gradient(135deg, #c9a227, #8a6d1a)",
          }}
        >
          Get in Touch
        </a>
      </div>
    </section>
  );
};

export default SponsorHero;
