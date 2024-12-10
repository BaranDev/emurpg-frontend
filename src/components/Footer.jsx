import React from "react";
import { FaDiscord, FaWhatsapp, FaInstagram, FaLinkedin } from "react-icons/fa";
import { config } from "../config";
const Footer = () => {
  return (
    <footer className="bg-gray-800 border-t-2 border-yellow-600 py-2 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center space-y-2">
          <p className="text-lg text-yellow-500 font-medieval text-center">
            Join Our Community
          </p>
          <div className="flex flex-wrap justify-center gap-4 px-4">
            <a
              href={config.DISCORD_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-indigo-500 transition-colors"
              aria-label="Join our Discord"
            >
              <FaDiscord size={config.FOOTER_ICON_SIZE} />
            </a>
            <a
              href={config.WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-green-500 transition-colors"
              aria-label="Join our WhatsApp group"
            >
              <FaWhatsapp size={config.FOOTER_ICON_SIZE} />
            </a>
            <a
              href={config.INSTAGRAM_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-pink-500 transition-colors"
              aria-label="Follow us on Instagram"
            >
              <FaInstagram size={config.FOOTER_ICON_SIZE} />
            </a>
            <a
              href={config.LINKEDIN_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-blue-500 transition-colors"
              aria-label="Connect with us on LinkedIn"
            >
              <FaLinkedin size={config.FOOTER_ICON_SIZE} />
            </a>
          </div>
          <p className="text-xs text-gray-400 mt-4 text-center px-4">
            {config.FOOTER_TEXT}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
