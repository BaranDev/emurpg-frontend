import { useState } from "react";
import PropTypes from "prop-types";
import {
  FaScroll,
  FaQuoteLeft,
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaTwitter,
  FaYoutube,
  FaGithub,
  FaGlobe,
  FaDiscord,
  FaCopy,
  FaTimes,
} from "react-icons/fa";

const SOCIAL_LINKS = [
  { key: "website", Icon: FaGlobe },
  { key: "facebook", Icon: FaFacebook },
  { key: "twitter", Icon: FaTwitter },
  { key: "instagram", Icon: FaInstagram },
  { key: "linkedin", Icon: FaLinkedin },
  { key: "github", Icon: FaGithub },
  { key: "youtube", Icon: FaYoutube },
];

import { config } from "../../config";
import * as MemberPhotos from "../../assets/member_photos";

const GameMasterCard = ({
  name,
  title,
  description,
  image,
  socials = {
    instagram: null,
    twitter: null,
    facebook: null,
    linkedin: null,
    github: null,
    youtube: null,
    website: null,
    discord: null,
  },
}) => {
  const [showDiscordModal, setShowDiscordModal] = useState(false);
  const [discordCopied, setDiscordCopied] = useState(false);

  const isValidUrl = (url) =>
    Boolean(url && (url.startsWith("http://") || url.startsWith("https://")));

  const handleDiscordClick = (e) => {
    e.preventDefault();
    setShowDiscordModal(true);
  };

  const handleCopyDiscord = async () => {
    if (!socials.discord) return;
    try {
      await navigator.clipboard.writeText(socials.discord);
      setDiscordCopied(true);
      setTimeout(() => setDiscordCopied(false), 2000);
    } catch {
      // Clipboard API can fail in insecure contexts
    }
  };

  // Fallback to static assets if R2 is disabled and no image is provided from DB
  const getStaticImage = () => {
    if (config.ENABLE_R2 || image) return image;

    // Slugify name to match export keys like photo_baran
    const slug = name?.toLowerCase().split(" ")[0];
    return MemberPhotos[`photo_${slug}`] || null;
  };

  const displayImage = getStaticImage();

  return (
    <>
      <div className="relative bg-gradient-to-b from-gray-800 to-gray-900 rounded-lg overflow-hidden p-5 md:p-6 group transition-transform duration-300 hover:scale-[1.02]">
        {/* Decorative corners */}
        <div className="absolute top-0 left-0 w-10 h-10 border-t-2 border-l-2 border-yellow-500/30 rounded-tl-lg" />
        <div className="absolute top-0 right-0 w-10 h-10 border-t-2 border-r-2 border-yellow-500/30 rounded-tr-lg" />
        <div className="absolute bottom-0 left-0 w-10 h-10 border-b-2 border-l-2 border-yellow-500/30 rounded-bl-lg" />
        <div className="absolute bottom-0 right-0 w-10 h-10 border-b-2 border-r-2 border-yellow-500/30 rounded-br-lg" />

        {/* Main content */}
        <div className="relative z-10">
          {/* Image container with decorative border */}
          <div className="relative w-28 h-28 md:w-32 md:h-32 mx-auto mb-5">
            <div
              className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 animate-spin"
              style={{
                animationDuration: "20s",
                animationTimingFunction: "linear",
              }}
            />
            <div className="absolute inset-2 rounded-full overflow-hidden border-2 border-yellow-500/30 p-1">
              <div className="w-full h-full rounded-full overflow-hidden select-none pointer-events-none">
                {displayImage ? (
                  <img
                    src={displayImage}
                    alt={name}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-700 text-yellow-500 text-2xl font-bold">
                    {name
                      ? name
                          .split(" ")
                          .map((w) => w[0])
                          .join("")
                          .toUpperCase()
                          .slice(0, 2)
                      : "?"}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Title section with scroll icon */}
          <div className="text-center mb-4">
            <div className="flex items-center justify-center mb-2">
              <div className="h-px w-12 bg-gradient-to-r from-transparent via-yellow-500/30 to-transparent" />
              <FaScroll className="text-yellow-500/50 mx-2" />
              <div className="h-px w-12 bg-gradient-to-r from-transparent via-yellow-500/30 to-transparent" />
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-yellow-500 mb-1.5">
              {name}
            </h3>
            <p className="text-yellow-300/90 font-medieval italic text-sm md:text-base">
              {title}
            </p>
          </div>

          {/* Description with fancy border */}
          {description ? (
            <div className="relative mt-4 pt-4 border-t border-yellow-500/20">
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-800 px-3">
                <div className="w-2 h-2 bg-yellow-500/30 rotate-45" />
              </div>
              <div>
                <FaQuoteLeft className="absolute top-0 left-0 text-yellow-500/30 text-xs -translate-x-3 -translate-y-[6px]" />
                <p className="text-gray-400 leading-relaxed text-sm md:text-base">
                  {description}
                </p>
              </div>
            </div>
          ) : null}

          {/* Social links */}
          {Object.values(socials).some((social) => social) ? (
            <div className="flex justify-center gap-3 md:gap-4 mt-4 border-t border-yellow-500/20 pt-3 md:pt-4">
              {SOCIAL_LINKS.filter(({ key }) => isValidUrl(socials[key])).map(
                ({ key, Icon }) => (
                  <a
                    key={key}
                    href={socials[key]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-yellow-500/50 hover:text-yellow-500 transition-colors"
                  >
                    <Icon size={20} />
                  </a>
                ),
              )}
              {!isValidUrl(socials.discord) && socials.discord && (
                <button
                  onClick={handleDiscordClick}
                  className="text-yellow-500/50 hover:text-yellow-500 transition-colors bg-transparent border-none cursor-pointer"
                  title="Click to view Discord username"
                >
                  <FaDiscord size={20} />
                </button>
              )}
            </div>
          ) : null}
        </div>

        {/* Hover effect overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-yellow-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Discord Username Modal */}
      {showDiscordModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-lg border-2 border-yellow-500/40 p-6 max-w-sm w-full shadow-2xl">
            {/* Close Button */}
            <button
              onClick={() => setShowDiscordModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <FaTimes size={20} />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
              <FaDiscord size={28} className="text-blue-400" />
              <h2 className="text-2xl font-bold text-yellow-500">Discord</h2>
            </div>

            {/* Username Display */}
            <div className="mb-6">
              <p className="text-gray-400 text-sm mb-2">Username:</p>
              <div className="bg-gray-700/50 border border-gray-600 rounded-lg p-4 flex items-center justify-between">
                <code className="text-yellow-300 font-mono text-lg break-all">
                  {socials.discord}
                </code>
              </div>
            </div>

            {/* Copy Button */}
            <button
              onClick={handleCopyDiscord}
              className={`w-full px-4 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                discordCopied
                  ? "bg-emerald-600 text-white"
                  : "bg-yellow-600 hover:bg-yellow-700 text-white"
              }`}
            >
              <FaCopy size={16} />
              {discordCopied ? "Copied!" : "Copy Username"}
            </button>

            {/* Helper Text */}
            <p className="text-gray-400 text-xs mt-4 text-center">
              Share this username to add them on Discord
            </p>

            {/* Close Button */}
            <button
              onClick={() => setShowDiscordModal(false)}
              className="w-full mt-3 px-4 py-2 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

GameMasterCard.propTypes = {
  name: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  image: PropTypes.string,
  socials: PropTypes.shape({
    instagram: PropTypes.string,
    twitter: PropTypes.string,
    facebook: PropTypes.string,
    linkedin: PropTypes.string,
    github: PropTypes.string,
    youtube: PropTypes.string,
    website: PropTypes.string,
    discord: PropTypes.string,
  }),
};

export default GameMasterCard;
