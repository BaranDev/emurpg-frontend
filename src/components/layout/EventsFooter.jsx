import { FaDiscord, FaWhatsapp, FaInstagram, FaLinkedin } from "react-icons/fa";
import { config } from "../../config";

const SOCIAL_LINKS = [
  {
    href: config.DISCORD_LINK,
    label: "Join our Discord",
    Icon: FaDiscord,
    hoverColor: "#818cf8", // indigo-400
  },
  {
    href: config.WHATSAPP_LINK,
    label: "Join our WhatsApp group",
    Icon: FaWhatsapp,
    hoverColor: "#34d399", // emerald-400
  },
  {
    href: config.INSTAGRAM_LINK,
    label: "Follow us on Instagram",
    Icon: FaInstagram,
    hoverColor: "#fb7185", // rose-400
  },
  {
    href: config.LINKEDIN_LINK,
    label: "Connect with us on LinkedIn",
    Icon: FaLinkedin,
    hoverColor: "#38bdf8", // sky-400
  },
];

const Footer = () => (
  <footer
    className="mt-auto relative"
    style={{ background: "rgba(5, 6, 14, 0.88)" }}
  >
    {/* Top gradient rule */}
    <div
      className="h-px w-full"
      style={{
        background:
          "linear-gradient(to right, transparent, rgba(201,162,39,0.45) 30%, rgba(201,162,39,0.45) 70%, transparent)",
      }}
    />

    <div className="container mx-auto px-4 py-5 flex flex-col items-center gap-3">
      <p className="font-cinzel text-sm text-amber-100/60 tracking-widest uppercase">
        ✦ Join Our Community ✦
      </p>

      <div className="flex items-center gap-6">
        {SOCIAL_LINKS.map(({ href, label, Icon, hoverColor }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className="text-stone-600 transition-all duration-200 hover:scale-110"
            style={{ "--hover-color": hoverColor }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.color = hoverColor)
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = "")
            }
          >
            <Icon size={config.FOOTER_ICON_SIZE} />
          </a>
        ))}
      </div>

      <p className="font-cinzel text-xs text-stone-700 tracking-wide">
        {config.FOOTER_TEXT}
      </p>
    </div>
  </footer>
);

export default Footer;
