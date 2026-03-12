import PropTypes from "prop-types";

const SectionTitle = ({ children, icon: Icon = null }) => (
  <div className="relative flex items-center justify-center mb-12">

    {/* Left extending rule */}
    <div className="hidden sm:flex flex-1 items-center justify-end gap-2 min-w-0">
      <div
        className="h-px flex-1 min-w-0"
        style={{
          background:
            "linear-gradient(to right, transparent, rgba(201,162,39,0.45))",
        }}
      />
      <span
        className="text-xs flex-shrink-0 select-none"
        style={{ color: "rgba(201,162,39,0.55)" }}
        aria-hidden="true"
      >
        ◆
      </span>
    </div>

    {/* Title block */}
    <div className="relative px-6 sm:px-10 py-3 flex-shrink-0 text-center">
      {/* Amber halo */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 90% 110% at 50% 50%, rgba(201,162,39,0.07) 0%, transparent 70%)",
        }}
      />

      {/* Title */}
      <h2
        className="relative font-cinzel font-bold text-3xl md:text-4xl text-amber-100 flex items-center justify-center gap-3"
        style={{ textShadow: "0 0 28px rgba(201,162,39,0.22)" }}
      >
        {Icon && (
          <Icon
            className="text-2xl md:text-3xl flex-shrink-0"
            style={{
              color: "rgba(201,162,39,0.75)",
              filter: "drop-shadow(0 0 8px rgba(201,162,39,0.35))",
            }}
          />
        )}
        <span>{children}</span>
      </h2>

      {/* Double rule below */}
      <div className="mt-2.5 flex flex-col items-center gap-0.5">
        <div
          className="h-px w-full"
          style={{
            background:
              "linear-gradient(to right, transparent, rgba(201,162,39,0.55), transparent)",
          }}
        />
        <div
          className="h-px w-2/3"
          style={{
            background:
              "linear-gradient(to right, transparent, rgba(201,162,39,0.2), transparent)",
          }}
        />
      </div>
    </div>

    {/* Right extending rule */}
    <div className="hidden sm:flex flex-1 items-center gap-2 min-w-0">
      <span
        className="text-xs flex-shrink-0 select-none"
        style={{ color: "rgba(201,162,39,0.55)" }}
        aria-hidden="true"
      >
        ◆
      </span>
      <div
        className="h-px flex-1 min-w-0"
        style={{
          background:
            "linear-gradient(to right, rgba(201,162,39,0.45), transparent)",
        }}
      />
    </div>

  </div>
);

SectionTitle.propTypes = {
  children: PropTypes.node.isRequired,
  icon: PropTypes.elementType,
};

export default SectionTitle;
