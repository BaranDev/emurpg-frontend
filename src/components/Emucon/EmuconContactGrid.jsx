import { EmailIcon, ShieldIcon, CrownIcon } from "./EmuconIcons";

const contacts = [
  {
    name: "Cevdet Baran Oral",
    role: "Activity Coordinator",
    roleTr: "Etkinlik Koordinatörü",
    email: "cevdetbaranoral@gmail.com",
  },
  {
    name: "Ayberk Onaylı",
    role: "Club President",
    roleTr: "Kulüp Başkanı",
    email: "emufrpclub@gmail.com",
    isPresident: true,
  },
];

const EmuconContactGrid = () => {
  return (
    <div>
      {/* Contact cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-5 lg:gap-6 mt-4 md:mt-6 lg:mt-8">
        {contacts.map((contact, index) => (
          <div
            key={index}
            className="group relative p-3 md:p-4 lg:p-5 rounded-xl border border-forest-medium/70 transition-all duration-300 hover:border-forest-light/60 hover:shadow-[0_10px_30px_rgba(0,0,0,0.4)] overflow-hidden"
            style={{
              background:
                "linear-gradient(160deg, rgba(26, 46, 26, 0.7), rgba(13, 31, 13, 0.85))",
            }}
          >
            {/* Top edge highlight */}
            <div
              className="absolute inset-x-0 top-0 h-px"
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgba(107,155,107,0.25), transparent)",
              }}
            />

            {/* Decorative shield icon */}
            <div className="absolute top-3 right-3 opacity-[0.06] group-hover:opacity-[0.1] transition-opacity duration-300">
              <ShieldIcon size={40} className="text-forest-light" />
            </div>

            {/* Corner decorations */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-forest-light/20 rounded-tl-xl" />
            <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-forest-light/20 rounded-tr-xl" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-forest-light/20 rounded-bl-xl" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-forest-light/20 rounded-br-xl" />

            {/* Horizontal layout */}
            <div className="relative flex items-center gap-3 md:gap-4 lg:gap-5">
              {/* Avatar / Icon */}
              <div className="relative flex-shrink-0 w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16">
                <div
                  className="w-full h-full rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-105"
                  style={{
                    background:
                      "linear-gradient(145deg, rgba(45, 74, 45, 0.6), rgba(26, 46, 26, 0.8))",
                    border: "2px solid rgba(74, 124, 74, 0.4)",
                    boxShadow:
                      "inset 0 2px 4px rgba(255,255,255,0.08), 0 4px 15px rgba(0,0,0,0.3)",
                  }}
                >
                  {contact.isPresident ? (
                    <CrownIcon
                      size={24}
                      className="text-gold-light/80 group-hover:text-gold-light transition-colors"
                    />
                  ) : (
                    <ShieldIcon
                      size={22}
                      className="text-forest-glow/80 group-hover:text-forest-glow transition-colors"
                    />
                  )}
                </div>
                {/* Glow effect */}
                <div
                  className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: contact.isPresident
                      ? "radial-gradient(circle, rgba(201,162,39,0.15) 0%, transparent 70%)"
                      : "radial-gradient(circle, rgba(107,155,107,0.15) 0%, transparent 70%)",
                  }}
                />
              </div>

              {/* Info section */}
              <div className="flex-1 text-left min-w-0">
                {/* Name */}
                <h4 className="font-cinzel text-sm md:text-base lg:text-lg text-cream mb-0.5 md:mb-1 transition-colors duration-300 group-hover:text-gold-light truncate">
                  {contact.name}
                </h4>

                {/* Role */}
                <div className="text-xs md:text-sm text-forest-glow mb-1 md:mb-2">
                  {contact.role}
                  <span className="text-emucon-text-muted block text-[10px] md:text-xs">
                    {contact.roleTr}
                  </span>
                </div>

                {/* Email */}
                <a
                  href={`mailto:${contact.email}`}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all duration-300 hover:shadow-[0_4px_12px_rgba(107,155,107,0.3)]"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(13, 31, 13, 0.5), rgba(26, 46, 26, 0.4))",
                    border: "1px solid rgba(74, 124, 74, 0.3)",
                    textDecoration: "none",
                  }}
                >
                  <EmailIcon
                    size={12}
                    className="text-gold-light flex-shrink-0"
                  />
                  <span className="text-cream text-xs md:text-sm font-medium truncate">
                    {contact.email}
                  </span>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer text with decorative divider */}
      <div className="mt-6 md:mt-10 lg:mt-12 text-center">
        <div className="flex items-center justify-center gap-4 mb-4 md:mb-6">
          <div className="h-px w-20 bg-gradient-to-r from-transparent to-forest-light/40" />
          <div
            className="p-2 rounded-lg"
            style={{
              background: "rgba(45, 74, 45, 0.3)",
              border: "1px solid rgba(74, 124, 74, 0.25)",
            }}
          >
            <ShieldIcon size={18} className="text-forest-light/60" />
          </div>
          <div className="h-px w-20 bg-gradient-to-l from-transparent to-forest-light/40" />
        </div>
        <p className="text-emucon-text-secondary text-sm md:text-base leading-relaxed">
          For sponsorship inquiries, partnership opportunities, or general
          questions—reach out!
        </p>
        <p className="text-emucon-text-muted text-sm mt-2 italic">
          Sponsorluk, ortaklık veya genel sorular için iletişime geçin!
        </p>
      </div>
    </div>
  );
};

export default EmuconContactGrid;
