import { EmailIcon } from "./EmuconIcons";

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
  },
];

const SponsorContactCTA = () => {
  return (
    <div
      id="contact"
      className="text-center px-6 md:px-10 py-12 md:py-16 rounded-xl border border-gold/30 mt-10 flex flex-col items-center justify-center"
      style={{
        background:
          "linear-gradient(135deg, rgba(201, 162, 39, 0.15), rgba(26, 46, 26, 0.6))",
      }}
    >
      {/* Title */}
      <h3 className="font-cinzel text-2xl md:text-3xl text-emucon-text-primary mb-5">
        Ready to Partner for EMUCON 2026?
      </h3>

      {/* Description - English */}
      <p className="text-emucon-text-secondary mb-4 max-w-[600px] mx-auto">
        EMUCON 2025 was a huge success with 600+ attendees! Join us in making
        EMUCON 2026 even bigger. Reach out to discuss sponsorship opportunities
        and custom packages.
      </p>

      {/* Description - Turkish */}
      <p className="text-emucon-text-muted mb-8">
        EMUCON 2025, 600+ katılımcı ile büyük bir başarı oldu! EMUCON 2026&#39;yı
        daha da büyük yapmak için bize katılın. Sponsorluk fırsatları ve özel
        paketler için bizimle iletişime geçin.
      </p>

      {/* Contact info */}
      <div className="flex justify-center gap-6 md:gap-8 flex-wrap mt-8">
        {contacts.map((contact, index) => (
          <div key={index} className="text-center">
            <div className="font-cinzel text-lg text-cream mb-2">
              {contact.name}
            </div>
            <div className="text-sm text-emucon-text-muted mb-3">
              {contact.role}
              <span className="block text-xs">{contact.roleTr}</span>
            </div>
            <a
              href={`mailto:${contact.email}`}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 hover:shadow-[0_4px_12px_rgba(201,162,39,0.3)]"
              style={{
                background:
                  "linear-gradient(135deg, rgba(13, 31, 13, 0.5), rgba(26, 46, 26, 0.4))",
                border: "1px solid rgba(201, 162, 39, 0.3)",
                textDecoration: "none",
              }}
            >
              <EmailIcon size={14} className="text-gold-light flex-shrink-0" />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SponsorContactCTA;
