import logoLightGray from "../../assets/logo/LOGO_LIGHTGRAY.png";
import logoYellow from "../../assets/logo/LOGO_YELLOW.png";
import {
  TreeIcon,
  LeafIcon,
  StarIcon,
  MoonIcon,
  ShieldIcon,
  UpArrowIcon,
} from "./EmuconIcons";
import PropTypes from "prop-types";

const EmuconFooter = ({
  logoVariant = "lightgray",
  scrollContainer = null,
}) => {
  const logo = logoVariant === "yellow" ? logoYellow : logoLightGray;

  return (
    <footer className="relative overflow-hidden select-none">
      {/* Forest silhouette background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, rgba(13,31,13,0.3) 0%, rgba(13,31,13,0.95) 30%, #0d1f0d 100%)",
        }}
      />

      {/* Decorative trees row */}
      <div className="absolute top-0 left-0 right-0 h-20 overflow-hidden pointer-events-none opacity-30">
        <div className="flex justify-around items-end h-full">
          {[...Array(12)].map((_, i) => (
            <TreeIcon
              key={i}
              size={30 + Math.random() * 20}
              className="text-forest-medium transform translate-y-2"
              style={{ opacity: 0.3 + Math.random() * 0.4 }}
            />
          ))}
        </div>
      </div>

      {/* Floating stars/fireflies */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(8)].map((_, i) => {
          const left = `${10 + Math.random() * 80}%`;
          const top = `${10 + Math.random() * 40}%`;
          const animationDelay = `${Math.random() * 3}s`;
          const animationDuration = `${2 + Math.random() * 2}s`;
          const size = 8 + Math.random() * 6;

          return (
            <div
              key={i}
              className="absolute"
              style={{
                left,
                top,
                animationName: "float",
                animationDelay,
                animationDuration,
                animationIterationCount: "infinite",
                animationTimingFunction: "ease-in-out",
                willChange: "transform",
              }}
            >
              <StarIcon size={size} className="text-gold-light/40" />
            </div>
          );
        })}
      </div>

      {/* Main footer content */}
      <div className="relative z-10 pt-16 pb-10 px-5">
        {/* Moon landing zone - decorative moon with logo */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            {/* Moon glow */}
            <div
              className="absolute -inset-8 rounded-full opacity-30"
              style={{
                background:
                  "radial-gradient(circle, rgba(200,220,255,0.4) 0%, transparent 70%)",
              }}
            />

            {/* Moon circle with logo */}
            <div
              className="relative w-24 h-24 md:w-28 md:h-28 rounded-full flex items-center justify-center"
              style={{
                background:
                  "radial-gradient(circle at 30% 30%, rgba(240,248,255,0.15) 0%, rgba(212,229,247,0.1) 40%, rgba(168,197,226,0.05) 100%)",
                boxShadow:
                  "0 0 30px rgba(200,220,255,0.2), inset -5px -5px 15px rgba(100,130,170,0.1)",
                border: "1px solid rgba(200,220,255,0.2)",
              }}
            >
              <img
                src={logo}
                alt="EMURPG"
                draggable={false}
                className="w-16 h-16 md:w-20 md:h-20 object-contain select-none"
                style={{
                  filter: "drop-shadow(0 0 8px rgba(200,220,255,0.3))",
                  opacity: 0.8,
                }}
              />
            </div>
          </div>
        </div>

        {/* Decorative divider with leaves */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <LeafIcon
            size={16}
            className="text-forest-light/40 transform -scale-x-100"
          />
          <div className="h-px w-20 bg-gradient-to-r from-transparent via-forest-light/30 to-transparent" />
          <ShieldIcon size={18} className="text-forest-glow/50" />
          <div className="h-px w-20 bg-gradient-to-r from-transparent via-forest-light/30 to-transparent" />
          <LeafIcon size={16} className="text-forest-light/40" />
        </div>

        {/* Event title */}
        <h3 className="font-cinzel text-xl md:text-2xl text-cream/90 text-center mb-2">
          EMUCON 2025
        </h3>
        <p className="text-gold-light/70 text-sm text-center tracking-wider uppercase mb-4">
          Campus Festival
        </p>

        {/* Organization info */}
        <div className="text-center space-y-2 mb-6">
          <p className="text-forest-glow text-sm">
            Organized by{" "}
            <span className="text-cream/80 font-medium">EMURPG Club</span>
          </p>
          <p className="text-emucon-text-muted text-xs">
            Eastern Mediterranean University
          </p>
        </div>

        {/* Date badge */}
        <div className="flex justify-center mb-8">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm"
            style={{
              background: "rgba(45, 74, 45, 0.3)",
              border: "1px solid rgba(74, 124, 74, 0.3)",
            }}
          >
            <MoonIcon size={14} className="text-gold-light/60" />
            <span className="text-emucon-text-secondary">
              December 20, 2025
            </span>
          </div>
        </div>

        {/* Bottom decorative border */}
        <div className="relative pt-6 border-t border-forest-medium/30">
          <div className="flex items-center justify-center gap-2 text-emucon-text-muted/50 text-xs">
            <TreeIcon size={12} className="text-forest-light/30" />
            <span>Where Campus Culture Comes Alive</span>
            <TreeIcon size={12} className="text-forest-light/30" />
          </div>
        </div>

        {/* Go to top button (centered at bottom) */}
        <div className="flex justify-center mt-6">
          <button
            aria-label="Back to top"
            title="Back to top"
            className="inline-flex flex-col items-center justify-center px-4 py-3 rounded-lg bg-forest-light/20 text-forest-glow hover:bg-forest-light/30 hover:scale-105 hover:shadow-[0_6px_20px_rgba(201,162,39,0.25)] transition-all duration-200 border border-forest-glow/50 backdrop-blur-sm"
            onClick={() => {
              const container = scrollContainer?.current || window;
              try {
                if (container && container.scrollTo) {
                  container.scrollTo({ top: 0, behavior: "smooth" });
                } else {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }
              } catch {
                // Fallback
                if (container && typeof container.scrollTop !== "undefined") {
                  container.scrollTop = 0;
                } else {
                  window.scrollTo(0, 0);
                }
              }
            }}
          >
            <UpArrowIcon className="text-forest-glow w-8 h-8 mb-1" />
            <span className="text-xs font-medium uppercase tracking-wider">
              Go to top
            </span>
          </button>
        </div>
      </div>

      {/* CSS for floating animation */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }
      `}</style>
    </footer>
  );
};
EmuconFooter.propTypes = {
  logoVariant: PropTypes.oneOf(["lightgray", "yellow"]),
  scrollContainer: PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
};
export default EmuconFooter;
