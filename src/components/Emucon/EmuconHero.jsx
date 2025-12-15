import { Link } from "react-router-dom";
import logoWhite from "../../assets/logo/LOGO_WHITE.png";
import forestDownArrow from "../../assets/images/forest-down-arrow.png";
import { CalendarIcon, ClockIcon, LocationIcon } from "./EmuconIcons";

const EmuconHero = () => {
  return (
    <section className="min-h-screen relative flex flex-col items-center justify-center text-center px-5 py-10 overflow-hidden bg-transparent select-none">
      {/* Hero content */}
      <div className="relative z-10 max-w-[900px] top-20 md:top-24 lg:top-28">
        {/* Logo frame */}
        <div className="w-[100px] h-[100px] md:w-[180px] md:h-[180px] mx-auto mb-8 md:mb-12 relative flex items-center justify-center">
          {/* Outer ring */}
          <div className="absolute inset-0 border-[3px] border-forest-light rounded-full opacity-50" />
          {/* Inner ring */}
          <div className="absolute inset-[10px] border border-gold rounded-full opacity-30" />
          {/* Logo */}
          <img
            src={logoWhite}
            alt="EMUCON"
            draggable={false}
            className="w-[400px] h-[400px] md:w-[400px] md:h-[400px] object-contain select-none"
            style={{ filter: "drop-shadow(0 0 30px rgba(107, 155, 107, 0.5))" }}
          />
        </div>

        {/* Title */}
        <h1
          className="font-cinzel text-4xl md:text-6xl lg:text-7xl font-bold text-cream mb-2.5 tracking-wider"
          style={{ textShadow: "0 4px 20px rgba(0,0,0,0.5)" }}
        >
          EMUCON 2025
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-gold-light mb-6 md:mb-8 font-light tracking-[0.2em] uppercase">
          Campus Festival
        </p>

        {/* Date & Time badge */}
        <div
          className="relative inline-flex items-center gap-4 md:gap-6 flex-wrap justify-center px-6 md:px-10 py-4 md:py-5 rounded-lg mb-4 md:mb-5 border border-forest-light/60 backdrop-blur-sm"
          style={{
            background:
              "linear-gradient(135deg, rgba(45, 74, 45, 0.5), rgba(26, 46, 26, 0.6))",
            boxShadow:
              "0 4px 20px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)",
          }}
        >
          {/* Inner glow */}
          <div className="absolute inset-0 rounded-lg bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />

          <div className="relative flex items-center gap-2.5">
            <div
              className="p-2 rounded-md"
              style={{
                background: "rgba(201, 162, 39, 0.15)",
                border: "1px solid rgba(201, 162, 39, 0.3)",
              }}
            >
              <CalendarIcon size={18} className="text-gold-light" />
            </div>
            <span className="text-base md:text-lg text-cream font-medium">
              December 20, 2025
            </span>
          </div>

          <div className="hidden sm:block w-px h-8 bg-gradient-to-b from-transparent via-forest-light/50 to-transparent" />

          <div className="relative flex items-center gap-2.5">
            <div
              className="p-2 rounded-md"
              style={{
                background: "rgba(201, 162, 39, 0.15)",
                border: "1px solid rgba(201, 162, 39, 0.3)",
              }}
            >
              <ClockIcon size={18} className="text-gold-light" />
            </div>
            <span className="text-base md:text-lg text-cream font-medium">
              2:00 PM – 6:00 PM
            </span>
          </div>
        </div>

        {/* Location */}
        <div
          className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full mb-8 md:mb-10"
          style={{
            background: "rgba(26, 46, 26, 0.4)",
            border: "1px solid rgba(74, 124, 74, 0.3)",
          }}
        >
          <LocationIcon size={16} className="text-forest-glow" />
          <a
            href="https://maps.app.goo.gl/bprQpkqkQTjHKkM57"
            target="_blank"
            rel="noopener noreferrer"
            className="text-emucon-text-secondary hover:text-forest-glow transition-colors text-sm md:text-base"
          >
            EMU Lala Mustafa Pasha Sports Complex
          </a>
        </div>

        {/* CTA Buttons */}
        <div className="flex gap-3 md:gap-4 justify-center flex-wrap">
          <Link
            to="/emucon/rules"
            className="inline-block px-6 md:px-8 py-3 md:py-4 text-cream font-semibold rounded border border-forest-glow uppercase tracking-wider text-xs md:text-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_30px_rgba(107,155,107,0.4)]"
            style={{
              background: "linear-gradient(135deg, #2d4a2d, #4a7c4a)",
            }}
          >
            Event Rules
          </Link>
          <Link
            to="/emucon/sponsors"
            className="inline-block px-6 md:px-8 py-3 md:py-4 text-cream font-semibold rounded border border-gold-light uppercase tracking-wider text-xs md:text-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_30px_rgba(201,162,39,0.4)]"
            style={{
              background: "linear-gradient(135deg, #c9a227, #a88420)",
            }}
          >
            Become a Sponsor
          </Link>
        </div>
      </div>

      {/* Scroll down indicator */}
      <div className="flex-grow flex items-end justify-center pb-24 md:pb-32 relative z-10">
        <div className="opacity-50 hover:opacity-100 transition-opacity motion-safe:animate-[bounce_3s_ease-in-out_infinite] cursor-pointer">
          <img
            src={forestDownArrow}
            alt="Scroll down"
            draggable={false}
            className="w-16 h-16 md:w-24 md:h-24 transition-opacity duration-300 object-contain select-none"
          />
        </div>
      </div>
    </section>
  );
};

export default EmuconHero;
