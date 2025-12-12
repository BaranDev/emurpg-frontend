import React from "react";
import PropTypes from "prop-types";

const SectionTitle = ({ children, icon: Icon = null }) => (
  <div className="relative flex items-center justify-center mb-12">
    <div className="relative px-12 py-4">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent" />
      <h2 className="relative px-8 text-4xl font-bold text-white flex items-center gap-4 font-medieval drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
        {Icon && <Icon className="text-3xl text-white/90 drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]" />}
        <span>{children}</span>
      </h2>
      <div className="absolute left-0 right-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
    </div>
  </div>
);

SectionTitle.propTypes = {
  children: PropTypes.node.isRequired,
  icon: PropTypes.elementType,
};

export default SectionTitle;
