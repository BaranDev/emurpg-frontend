import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FaHome, FaCalendar, FaDiceD20, FaDice } from "react-icons/fa";
import PropTypes from "prop-types";

const HIDDEN_PATHS = ["/admin", "/demo"];

const BottomNavBar = ({ onLanguageSwitch: _onLanguageSwitch }) => {
  const location = useLocation();
  const { t } = useTranslation();
  const currentPath = location.pathname;

  if (HIDDEN_PATHS.some((p) => currentPath.startsWith(p))) {
    return null;
  }

  const isActive = (path) => {
    if (path === "/") return currentPath === "/";
    return currentPath.startsWith(path);
  };

  const navItems = [
    {
      id: "home",
      icon: FaHome,
      label: t("bottom_nav.home"),
      path: "/",
      type: null,
      onClick: () => (window.location.href = "/"),
    },
    {
      id: "events",
      icon: FaCalendar,
      label: t("bottom_nav.events"),
      path: "/events",
      type: null,
      onClick: () => (window.location.href = "/events"),
    },
    {
      id: "emucon",
      icon: FaDiceD20,
      label: "EMUCON",
      path: "/emucon",
      type: null,
      onClick: () => (window.location.href = "/emucon/"),
    },
    {
      id: "charroller",
      icon: FaDice,
      label: t("bottom_nav.charroller"),
      path: "/charroller",
      type: null,
      onClick: () => (window.location.href = "/charroller"),
    },
  ];

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-50"
      style={{
        background:
          "linear-gradient(to top, rgba(15, 23, 42, 0.98) 0%, rgba(15, 23, 42, 0.93) 100%)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderTop: "1px solid rgba(255, 255, 255, 0.08)",
        paddingBottom: "max(env(safe-area-inset-bottom, 0px), 4px)",
      }}
    >
      <div className="flex items-stretch justify-around px-1 py-1">
        {navItems.map((item) => {
          const active = isActive(item.path);
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={item.onClick}
              aria-label={item.label}
              aria-current={active ? "page" : undefined}
              className={`flex flex-col items-center justify-center flex-1 py-2 px-1 rounded-xl gap-1 transition-all duration-200 active:scale-95 ${
                active ? "text-yellow-400" : "text-white/45 hover:text-white/70"
              }`}
            >
              <div className="relative flex items-center justify-center">
                <Icon
                  className={`text-[1.2rem] transition-all duration-200 ${
                    active ? "drop-shadow-[0_0_6px_rgba(250,204,21,0.55)]" : ""
                  }`}
                />
                {active && (
                  <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-yellow-400" />
                )}
              </div>
              <span
                className={`text-[10px] font-medium leading-none transition-all duration-200 ${
                  active ? "text-yellow-400" : "text-white/35"
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

BottomNavBar.propTypes = {
  onLanguageSwitch: PropTypes.func,
};

export default BottomNavBar;
