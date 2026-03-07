import { FaDiscord, FaInstagram, FaLinkedin, FaWhatsapp } from "react-icons/fa";
import { config } from "../../config";
import SocialIcon from "../SocialIcon";
import { useTranslation } from "react-i18next";

const CharrollerFooter = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-gray-900 py-12 border-t border-gray-800">
      <div className="container mx-auto px-4 items-center justify-center text-center">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-gray-400 text-center">
          <div>
            <h3 className="text-xl font-bold text-yellow-500 mb-4 font-cinzel">
              EMURPG Charroller
            </h3>
            <p className="text-sm">
              The ultimate TTRPG companion for adventurers. Create, manage, and
              roll with ease.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-bold text-yellow-500 mb-4">
              Contact Us
            </h3>
            <p>Send your ravens to:</p>
            <a
              href="mailto:emufrpclub@gmail.com"
              className="text-yellow-500 hover:text-yellow-400"
            >
              emufrpclub@gmail.com
            </a>
          </div>
          <div>
            <h3 className="text-xl font-bold text-yellow-500 mb-4">
              Follow Us
            </h3>
            <div className="flex flex-wrap justify-center gap-6 text-center items-center">
              <SocialIcon
                icon={<FaDiscord />}
                href={config.DISCORD_LINK}
                label="Discord"
              />
              <SocialIcon
                icon={<FaWhatsapp />}
                href={config.WHATSAPP_LINK}
                label="WhatsApp"
              />
              <SocialIcon
                icon={<FaInstagram />}
                href={config.INSTAGRAM_LINK}
                label="Instagram"
              />
              <SocialIcon
                icon={<FaLinkedin />}
                href={config.LINKEDIN_LINK}
                label="LinkedIn"
              />
            </div>
          </div>
        </div>
        <div className="text-center mt-8 text-gray-500 text-sm">
          <p>{config.FOOTER_TEXT}</p>
          <p className="mt-2 text-xs opacity-50">
            Charroller v1.0 • Built with Tavern Magic
          </p>
        </div>
      </div>
    </footer>
  );
};

export default CharrollerFooter;
