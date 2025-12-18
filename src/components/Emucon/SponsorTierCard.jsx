import PropTypes from "prop-types";
const tierStyles = {
  gold: {
    borderColor: "border-gold",
    nameColor: "text-gold",
    accentGradient: "linear-gradient(90deg, #c9a227, #e8d48b, #c9a227)",
  },
  silver: {
    borderColor: "border-[#a8a8a8]",
    nameColor: "text-[#ccc]",
    accentGradient: "linear-gradient(90deg, #888, #ccc, #888)",
  },
  bronze: {
    borderColor: "border-[#cd7f32]",
    nameColor: "text-[#e8b87d]",
    accentGradient: "linear-gradient(90deg, #cd7f32, #e8b87d, #cd7f32)",
  },
};

import { ShieldIcon } from "./EmuconIcons";

const SponsorTierCard = ({ tier, name, subtitle, features }) => {
  const styles = tierStyles[tier] || tierStyles.bronze;

  return (
    <div
      className={`relative rounded-xl p-8 md:p-10 text-center border-2 ${styles.borderColor} overflow-hidden transition-all duration-300 hover:-translate-y-1`}
      style={{
        background:
          "linear-gradient(135deg, rgba(26, 46, 26, 0.8), rgba(13, 31, 13, 0.9))",
      }}
    >
      {/* Top accent bar */}
      <div
        className="absolute top-0 left-0 right-0 h-1"
        style={{ background: styles.accentGradient }}
      />

      {/* Tier name */}
      <div className={`font-cinzel text-2xl mb-2.5 ${styles.nameColor}`}>
        {name}
      </div>

      {/* Subtitle */}
      <p className="text-emucon-text-muted text-sm">{subtitle}</p>

      {/* Features list */}
      <ul className="text-left mt-5 pt-5 border-t border-forest-medium list-none">
        {features.map((feature, index) => (
          <li
            key={index}
            className="text-emucon-text-secondary text-sm mb-2.5 pl-8 relative flex items-start gap-3"
          >
            <span className="absolute left-0 -translate-y-0.5">
              <ShieldIcon size={14} className="text-forest-glow" />
            </span>
            <span className="leading-tight">{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

SponsorTierCard.propTypes = {
  tier: PropTypes.oneOf(["gold", "silver", "bronze"]).isRequired,
  name: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
  features: PropTypes.arrayOf(PropTypes.string).isRequired,
};
export default SponsorTierCard;
