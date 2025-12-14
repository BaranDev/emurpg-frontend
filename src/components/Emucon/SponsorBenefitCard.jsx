const SponsorBenefitCard = ({ icon, title, description }) => {
  return (
    <div
      className="group p-6 md:p-8 rounded-md transition-all duration-300 border border-gold/20 hover:border-gold hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(0,0,0,0.3)]"
      style={{ background: "rgba(26, 46, 26, 0.6)" }}
    >
      {/* Icon */}
      <div
        className="w-[50px] h-[50px] mb-4 rounded-lg flex items-center justify-center text-2xl transition-transform duration-300 group-hover:scale-110"
        style={{
          background: "linear-gradient(135deg, #c9a227, #8a6d1a)",
        }}
      >
        {icon}
      </div>

      {/* Title */}
      <h4 className="font-cinzel text-lg text-gold-light mb-2.5">{title}</h4>

      {/* Description */}
      <p className="text-emucon-text-secondary text-sm">{description}</p>
    </div>
  );
};

export default SponsorBenefitCard;
