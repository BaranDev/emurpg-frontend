import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import logoWhite from "../../assets/logo/LOGO_WHITE.png";
import { LeafIcon, SwordIcon, ShieldIcon, StarIcon } from "./EmuconIcons";

const EmuconNavbar = ({
  showBack = false,
  scrollThreshold = 300,
  scrollContainer = null,
  backPath = "/emucon",
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const container = scrollContainer?.current || window;
    const handleScroll = () => {
      let scrollTop = 0;
      if (scrollContainer && scrollContainer.current) {
        scrollTop = scrollContainer.current.scrollTop;
      } else {
        scrollTop = window.scrollY;
      }
      setIsVisible(scrollTop > scrollThreshold);
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [scrollThreshold, scrollContainer]);

  return (
    <nav
      role="banner"
      aria-label="EMUCON navigation"
      className={`select-none fixed top-0 left-0 right-0 z-[1000] px-4 py-3 md:px-8 flex items-center justify-between transition-transform duration-300 ease-out group ${
        isVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
      }`}
      style={{
        background:
          "linear-gradient(180deg, rgba(10,30,12,0.95), rgba(12,34,14,0.9))",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        borderBottom: "1px solid rgba(201,162,39,0.08)",
        boxShadow: "0 6px 28px rgba(6,22,7,0.6)",
      }}
    >
      {/* Cloud-like bottom edge */}
      <div className="absolute -bottom-5 left-0 right-0 h-5 pointer-events-none">
        <svg
          viewBox="0 0 1200 60"
          className="w-full h-full"
          preserveAspectRatio="none"
        >
          <path
            d="M0,60 Q200,30 400,45 T800,35 T1200,50 L1200,0 L0,0 Z"
            fill="rgba(13,31,13,0.85)"
          />
        </svg>
      </div>

      {/* Left section with medieval ornaments */}
      <div className="w-[60px] md:w-[120px] relative flex items-center gap-2">
        <div className="absolute -left-3 -top-2 md:-left-6 md:-top-3 opacity-80 pointer-events-none">
          <LeafIcon className="text-forest-light/50 w-6 h-6 md:w-8 md:h-8 drop-shadow-md transform transition-transform duration-300 group-hover:scale-110" />
        </div>
        <div className="absolute -left-7 bottom-0 md:-left-14 md:bottom-0 opacity-60 pointer-events-none">
          <SwordIcon className="text-forest-light/35 w-4 h-4 md:w-5 md:h-5 rotate-45 transform transition-transform duration-300 group-hover:-translate-y-1" />
        </div>
        <div className="relative z-10">
          {showBack && (
            <Link
              to={backPath}
              className="flex items-center gap-2 text-emucon-text-secondary hover:text-gold-light transition-colors duration-300 text-sm"
            >
              ← <span className="hidden md:inline">Back</span>
            </Link>
          )}
        </div>
      </div>

      {/* Center - EMUCON title with star and gentle gold glow */}
      <div className="flex-1 text-center relative">
        <div className="absolute inset-x-0 -bottom-4 h-4 pointer-events-none flex items-end justify-center opacity-40">
          <div className="w-40 h-4 rounded-full bg-gradient-to-b from-transparent to-green-900/40 blur-sm" />
        </div>
        <div className="absolute inset-x-0 -top-3 flex justify-center pointer-events-none opacity-60">
          <StarIcon className="text-gold-light w-6 h-6 md:w-8 md:h-8 drop-shadow-[0_2px_12px_rgba(201,162,39,0.25)] transform transition-transform duration-300 group-hover:scale-110" />
        </div>
        <span
          className="font-cinzel text-xl md:text-2xl font-bold text-cream tracking-[0.15em] drop-shadow-[0_4px_16px_rgba(0,0,0,0.6)]"
          style={{ textShadow: "0 6px 22px rgba(0,0,0,0.6)" }}
        >
          EMUCON
        </span>
      </div>

      {/* Right section - Logo button with shield ornament */}
      <div className="w-[60px] md:w-[120px] flex justify-end relative items-center">
        <div className="absolute -right-3 -top-2 md:-right-6 md:-top-3 opacity-80 pointer-events-none">
          <LeafIcon className="text-forest-light/50 w-6 h-6 md:w-8 md:h-8 drop-shadow-md rotate-12 transform transition-transform duration-300 group-hover:scale-110" />
        </div>
        <div className="absolute -right-9 bottom-0 md:-right-20 md:bottom-0 opacity-80 pointer-events-none">
          <ShieldIcon className="text-forest-medium/40 w-5 h-5 md:w-6 md:h-6 transform transition-transform duration-300 group-hover:-translate-y-1" />
        </div>
        <Link
          to="/"
          className="flex items-center justify-center w-10 h-10 md:w-[50px] md:h-[50px] rounded-full border border-forest-light transition-all duration-300 hover:border-forest-glow hover:shadow-[0_0_20px_rgba(107,155,107,0.3)]"
          style={{ background: "rgba(45, 74, 45, 0.5)" }}
          title="EMURPG Homepage"
        >
          <img
            src={logoWhite}
            alt="EMURPG"
            draggable={false}
            className="w-6 h-6 md:w-8 md:h-8 object-contain select-none"
          />
        </Link>
      </div>
    </nav>
  );
};

EmuconNavbar.propTypes = {
  showBack: PropTypes.bool,
  scrollThreshold: PropTypes.number,
  scrollContainer: PropTypes.object,
};

export default EmuconNavbar;
