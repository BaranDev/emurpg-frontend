// config.js
const DEV = true;

const backendUrl = DEV ? "http://localhost:8000" : "https://api.emurpg.com";

const config = {
  backendUrl: backendUrl,
  DISCORD_LINK: "https://discord.gg/QFynV24URr",
  WHATSAPP_LINK: "https://chat.whatsapp.com/IMoi88nhVWDDU5lS65dgLL",
  INSTAGRAM_LINK: "https://www.instagram.com/emurpgclub/",
  LINKEDIN_LINK: "https://www.linkedin.com/company/emu-rpg-club/",
  FOOTER_TEXT: "© 2024 EMU RPG Club. All rights reserved.",
  FOOTER_ICON_SIZE: 18,
};

export default config;
