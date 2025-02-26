import React from "react";
import PropTypes from "prop-types";

const SectionTitle = ({ children, icon: Icon = null }) => (
  <div className="relative flex items-center justify-center mb-12">
    <div className="relative px-12 py-4">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-900/5 to-transparent" />
      <h2 className="relative px-8 text-4xl font-bold text-yellow-600 flex items-center gap-4 font-medieval">
        {Icon && <Icon className="text-3xl" />}
        <span>{children}</span>
      </h2>
      <div className="absolute left-0 right-0 bottom-0 h-px bg-gradient-to-r from-transparent via-yellow-600/30 to-transparent" />
    </div>
  </div>
);

SectionTitle.propTypes = {
  children: PropTypes.node.isRequired,
  icon: PropTypes.elementType,
};

export default SectionTitle;
