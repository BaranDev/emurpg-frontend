import { LeafIcon } from "./EmuconIcons";

const EmuconSectionHeader = ({ title }) => {
  return (
    <div className="text-center mb-4 md:mb-10 lg:mb-12">
      <h2 className="font-cinzel text-2xl md:text-4xl text-cream mb-1 md:mb-4 inline-flex items-center gap-3 md:gap-4">
        <LeafIcon
          size={20}
          className="hidden md:block text-forest-light opacity-50 transform -scale-x-100"
        />
        <span
          className="relative"
          style={{ textShadow: "0 2px 10px rgba(0,0,0,0.3)" }}
        >
          {title}
        </span>
        <LeafIcon
          size={20}
          className="hidden md:block text-forest-light opacity-50"
        />
      </h2>

      {/* Decorative underline */}
      <div className="flex items-center justify-center gap-2 mt-2">
        <div className="h-px w-12 md:w-16 bg-gradient-to-r from-transparent to-forest-light/40" />
        <div className="w-1.5 h-1.5 rounded-full bg-gold/50" />
        <div className="h-px w-12 md:w-16 bg-gradient-to-l from-transparent to-forest-light/40" />
      </div>
    </div>
  );
};

export default EmuconSectionHeader;
