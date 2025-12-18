import PropTypes from "prop-types";
// Medieval/Fantasy themed SVG icons for EMUCON

// Base wrapper for consistent styling
const IconWrapper = ({ children, className = "", size = 24 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={size}
    height={size}
    className={className}
    fill="currentColor"
  >
    {children}
  </svg>
);

// Gaming Controller - Medieval style with shield motif
export const GamepadIcon = ({ className = "", size = 24 }) => (
  <IconWrapper className={className} size={size}>
    <path d="M6 9h2v2H6V9zm10 0h2v2h-2V9zm-6 0h4v2h-4V9z" opacity="0.3" />
    <path d="M20 6H4c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 10H4V8h16v8zM6 9h2v2H6V9zm0 3h2v2H6v-2zm4-3h4v2h-4V9zm0 3h4v2h-4v-2zm6-3h2v2h-2V9zm0 3h2v2h-2v-2z" />
    <path d="M12 3L8 6h8l-4-3z" fill="currentColor" opacity="0.6" />
  </IconWrapper>
);

// Music - Lyre/Harp style
export const MusicIcon = ({ className = "", size = 24 }) => (
  <IconWrapper className={className} size={size}>
    <path
      d="M12 3c-4.97 0-9 4.03-9 9v7c0 1.1.9 2 2 2h4v-8H5v-1c0-3.87 3.13-7 7-7s7 3.13 7 7v1h-4v8h4c1.1 0 2-.9 2-2v-7c0-4.97-4.03-9-9-9z"
      opacity="0.8"
    />
    <path d="M9 13v6h2v-6H9zm4 0v6h2v-6h-2z" />
    <circle cx="12" cy="5" r="1.5" opacity="0.6" />
  </IconWrapper>
);

// Art - Paint palette with brush
export const ArtIcon = ({ className = "", size = 24 }) => (
  <IconWrapper className={className} size={size}>
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8zm-5.5 9c-.83 0-1.5-.67-1.5-1.5S5.67 8 6.5 8 8 8.67 8 9.5 7.33 11 6.5 11zm3-4C8.67 7 8 6.33 8 5.5S8.67 4 9.5 4s1.5.67 1.5 1.5S10.33 7 9.5 7zm5 0c-.83 0-1.5-.67-1.5-1.5S13.67 4 14.5 4s1.5.67 1.5 1.5S15.33 7 14.5 7zm3 4c-.83 0-1.5-.67-1.5-1.5S16.67 8 17.5 8s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
  </IconWrapper>
);

// Food - Medieval feast/goblet style
export const FoodIcon = ({ className = "", size = 24 }) => (
  <IconWrapper className={className} size={size}>
    <path
      d="M18.06 3l-1.34 1.34C18.17 5.3 19 6.81 19 8.5c0 3.1-2.4 5.38-5 5.94V21h-4v-6.56c-2.6-.56-5-2.84-5-5.94 0-1.69.83-3.2 2.28-4.16L6 3h12.06z"
      opacity="0.8"
    />
    <path d="M12 2L8 5l4 3 4-3-4-3z" opacity="0.6" />
    <rect x="10" y="19" width="4" height="3" rx="1" />
  </IconWrapper>
);

// Camera - Vintage/fantasy crystal ball style
export const CameraIcon = ({ className = "", size = 24 }) => (
  <IconWrapper className={className} size={size}>
    <circle cx="12" cy="12" r="8" opacity="0.3" />
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
    <circle cx="12" cy="12" r="5" opacity="0.6" />
    <circle cx="12" cy="12" r="3" />
    <circle cx="14" cy="10" r="1" fill="white" opacity="0.8" />
  </IconWrapper>
);

// Workshop/Tools - Anvil and hammer style
export const WorkshopIcon = ({ className = "", size = 24 }) => (
  <IconWrapper className={className} size={size}>
    <path
      d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1z"
      opacity="0.3"
    />
    <path d="M21 11l-3-3v2H3v2h15v2l3-3z" />
    <path d="M6 15h12v2H6v-2z" opacity="0.6" />
    <path d="M9 17h6v4H9v-4z" />
  </IconWrapper>
);

// Calendar - Scroll style
export const CalendarIcon = ({ className = "", size = 24 }) => (
  <IconWrapper className={className} size={size}>
    <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zM5 8V6h14v2H5z" />
    <path
      d="M7 12h2v2H7v-2zm4 0h2v2h-2v-2zm4 0h2v2h-2v-2zm-8 4h2v2H7v-2zm4 0h2v2h-2v-2zm4 0h2v2h-2v-2z"
      opacity="0.6"
    />
  </IconWrapper>
);

// Clock - Hourglass/sundial style
export const ClockIcon = ({ className = "", size = 24 }) => (
  <IconWrapper className={className} size={size}>
    <path
      d="M6 2v6h.01L6 8.01 10 12l-4 4 .01.01H6V22h12v-5.99h-.01L18 16l-4-4 4-3.99-.01-.01H18V2H6z"
      opacity="0.3"
    />
    <path d="M6 2v6h.01L6 8.01 10 12l-4 4 .01.01H6V22h12v-5.99h-.01L18 16l-4-4 4-3.99-.01-.01H18V2H6zm10 14.5V20H8v-3.5l4-4 4 4zm-4-5l-4-4V4h8v3.5l-4 4z" />
  </IconWrapper>
);

// Location pin - Tower/castle marker style
export const LocationIcon = ({ className = "", size = 24 }) => (
  <IconWrapper className={className} size={size}>
    <path
      d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
      opacity="0.3"
    />
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 19.25C9.51 17.65 7 13.32 7 9c0-2.76 2.24-5 5-5s5 2.24 5 5c0 4.32-2.51 8.65-5 12.25z" />
    <path d="M10 7h4v2h-1v3h-2V9h-1V7z" />
    <path d="M9 12h6l-3 4-3-4z" opacity="0.6" />
  </IconWrapper>
);

// Phone - Scroll/messenger style
export const PhoneIcon = ({ className = "", size = 24 }) => (
  <IconWrapper className={className} size={size}>
    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
  </IconWrapper>
);

// Email - Scroll/letter style
export const EmailIcon = ({ className = "", size = 24 }) => (
  <IconWrapper className={className} size={size}>
    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
  </IconWrapper>
);

// Sword icon for decorative purposes
export const SwordIcon = ({ className = "", size = 24 }) => (
  <IconWrapper className={className} size={size}>
    <path d="M19.07 4.93l-1.41 1.41L19.07 7.76l1.41-1.41c.39-.39.39-1.02 0-1.41l-.01-.01c-.39-.39-1.02-.39-1.4 0z" />
    <path d="M17.66 6.34l-9.9 9.9 1.41 1.41 9.9-9.9-1.41-1.41z" opacity="0.6" />
    <path d="M5.34 14.24l-1.41 1.41c-.39.39-.39 1.02 0 1.41l2.83 2.83c.39.39 1.02.39 1.41 0l1.41-1.41-4.24-4.24z" />
    <path
      d="M7.76 11.83l1.41 1.41 2.83-2.83-1.41-1.41-2.83 2.83z"
      opacity="0.8"
    />
  </IconWrapper>
);

// Shield icon for decorative purposes
export const ShieldIcon = ({ className = "", size = 24 }) => (
  <IconWrapper className={className} size={size}>
    <path
      d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"
      opacity="0.3"
    />
    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 19.93c-4.05-1.23-7-5.36-7-9.93V6.3l7-3.11 7 3.11V11c0 4.57-2.95 8.7-7 9.93z" />
    <path
      d="M12 7l-4 2v3c0 2.5 1.7 4.8 4 5.5 2.3-.7 4-3 4-5.5V9l-4-2zm2 7h-4v-3l2-1 2 1v3z"
      opacity="0.6"
    />
  </IconWrapper>
);

// Crown icon for decorative/sponsor purposes
export const CrownIcon = ({ className = "", size = 24 }) => (
  <IconWrapper className={className} size={size}>
    <path d="M5 16h14v2H5v-2z" opacity="0.6" />
    <path d="M12 2l-4 7 4-3 4 3-4-7z" />
    <path d="M3 11l2-4v7H3v-3zm18 0v3h-2V7l2 4z" opacity="0.8" />
    <path d="M5 14h14V8l-4 3-3-5-3 5-4-3v6z" opacity="0.3" />
  </IconWrapper>
);

// Scroll icon for info/rules
export const ScrollIcon = ({ className = "", size = 24 }) => (
  <IconWrapper className={className} size={size}>
    <path
      d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"
      opacity="0.3"
    />
    <path d="M14 17H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
    <path
      d="M3 5c0-1.1.9-2 2-2h1v18H5c-1.1 0-2-.9-2-2V5zm16 0v14c0 1.1-.9 2-2 2h1V3h1c1.1 0 2 .9 2 2z"
      opacity="0.6"
    />
  </IconWrapper>
);

// Tree icon for forest theme
export const TreeIcon = ({ className = "", size = 24 }) => (
  <IconWrapper className={className} size={size}>
    <path d="M12 2L4 14h4v8h8v-8h4L12 2z" opacity="0.6" />
    <path d="M12 2L6 10h3v4H6l6 8 6-8h-3v-4h3L12 2zm0 3.5L15.5 10H14v4h2.5L12 18.5 7.5 14H10v-4H8.5L12 5.5z" />
  </IconWrapper>
);

// Leaf decorative icon
export const LeafIcon = ({ className = "", size = 24 }) => (
  <IconWrapper className={className} size={size}>
    <path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75C7 8 17 8 17 8z" />
  </IconWrapper>
);

// Star for decorative purposes
export const StarIcon = ({ className = "", size = 24 }) => (
  <IconWrapper className={className} size={size}>
    <path
      d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
      opacity="0.8"
    />
    <path d="M12 4.44l2.34 4.73 5.22.76-3.78 3.68.89 5.2-4.67-2.45-4.67 2.45.89-5.2-3.78-3.68 5.22-.76L12 4.44z" />
  </IconWrapper>
);

// Moon icon
export const MoonIcon = ({ className = "", size = 24 }) => (
  <IconWrapper className={className} size={size}>
    <path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-2.98 0-5.4-2.42-5.4-5.4 0-1.81.89-3.42 2.26-4.4-.44-.06-.9-.1-1.36-.1z" />
  </IconWrapper>
);

// Up arrow icon
export const UpArrowIcon = ({ className = "", size = 24 }) => (
  <IconWrapper className={className} size={size}>
    <path d="M12 4l-6 6h4v6h4v-6h4l-6-6z" />
  </IconWrapper>
);

MoonIcon.propTypes = {
  className: PropTypes.string,
  size: PropTypes.number,
};

UpArrowIcon.propTypes = {
  className: PropTypes.string,
  size: PropTypes.number,
};

StarIcon.propTypes = {
  className: PropTypes.string,
  size: PropTypes.number,
};

LeafIcon.propTypes = {
  className: PropTypes.string,
  size: PropTypes.number,
};

TreeIcon.propTypes = {
  className: PropTypes.string,
  size: PropTypes.number,
};

ScrollIcon.propTypes = {
  className: PropTypes.string,
  size: PropTypes.number,
};

CrownIcon.propTypes = {
  className: PropTypes.string,
  size: PropTypes.number,
};

ShieldIcon.propTypes = {
  className: PropTypes.string,
  size: PropTypes.number,
};

SwordIcon.propTypes = {
  className: PropTypes.string,
  size: PropTypes.number,
};

EmailIcon.propTypes = {
  className: PropTypes.string,
  size: PropTypes.number,
};

PhoneIcon.propTypes = {
  className: PropTypes.string,
  size: PropTypes.number,
};

CameraIcon.propTypes = {
  className: PropTypes.string,
  size: PropTypes.number,
};

WorkshopIcon.propTypes = {
  className: PropTypes.string,
  size: PropTypes.number,
};

CalendarIcon.propTypes = {
  className: PropTypes.string,
  size: PropTypes.number,
};

ClockIcon.propTypes = {
  className: PropTypes.string,
  size: PropTypes.number,
};

FoodIcon.propTypes = {
  className: PropTypes.string,
  size: PropTypes.number,
};

ArtIcon.propTypes = {
  className: PropTypes.string,
  size: PropTypes.number,
};

MusicIcon.propTypes = {
  className: PropTypes.string,
  size: PropTypes.number,
};

GamepadIcon.propTypes = {
  className: PropTypes.string,
  size: PropTypes.number,
};

LocationIcon.propTypes = {
  className: PropTypes.string,
  size: PropTypes.number,
};

IconWrapper.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  size: PropTypes.number,
};

export default {
  GamepadIcon,
  MusicIcon,
  ArtIcon,
  FoodIcon,
  CameraIcon,
  WorkshopIcon,
  CalendarIcon,
  ClockIcon,
  LocationIcon,
  PhoneIcon,
  EmailIcon,
  SwordIcon,
  ShieldIcon,
  CrownIcon,
  ScrollIcon,
  TreeIcon,
  LeafIcon,
  StarIcon,
  MoonIcon,
  UpArrowIcon,
};
