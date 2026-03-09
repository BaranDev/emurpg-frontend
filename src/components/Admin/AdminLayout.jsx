import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Calendar,
  Users,
  BarChart3,
  LogOut,
  Castle,
  Shield,
  Sparkles,
  ChevronRight,
  Home,
  Table2,
  Gamepad2,
  FileText,
  UserPlus,
  Clock,
  Palette,
  Settings,
} from "lucide-react";
import { clearSession, getLoginData } from "../../utils/auth";
import { ServerStatus } from "./AdminHeader";

const AdminLayout = ({ children, activePanel, onPanelChange, onLogout }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [torchFlicker, setTorchFlicker] = useState(1);
  const [expandedGroup, setExpandedGroup] = useState(null);
  const loginData = getLoginData();

  // Animated torch effect
  useEffect(() => {
    const interval = setInterval(() => {
      setTorchFlicker(0.85 + Math.random() * 0.3);
    }, 150);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    clearSession();
    onLogout?.();
  };

  const menuSections = [
    {
      label: null,
      items: [
        {
          id: "dashboard",
          label: "Dashboard",
          icon: Home,
          description: "Overview & stats",
        },
      ],
    },
    {
      label: "EMURPG",
      items: [
        {
          id: "events",
          label: "Events",
          icon: Calendar,
          description: "Game events",
        },
        {
          id: "tables",
          label: "Tables",
          icon: Table2,
          description: "Manage tables",
        },
        {
          id: "themes",
          label: "Table Themes",
          icon: Palette,
          description: "Visual styles",
        },
        {
          id: "games",
          label: "Games Library",
          icon: Gamepad2,
          description: "Game database",
        },
      ],
    },
    {
      label: "EMUCON",
      items: [
        {
          id: "emucon",
          label: "Corners",
          icon: Sparkles,
          description: "Corner activities",
        },
        {
          id: "managers",
          label: "Managers",
          icon: UserPlus,
          description: "Club managers",
        },
        {
          id: "emucon-schedule",
          label: "Schedule",
          icon: Clock,
          description: "Time periods",
        },
      ],
    },
    {
      label: "Management",
      items: [
        {
          id: "registrations",
          label: "Registrations",
          icon: Users,
          description: "General event signups",
        },
        {
          id: "reports",
          label: "Reports",
          icon: FileText,
          description: "Generate reports",
        },
        {
          id: "analytics",
          label: "Analytics",
          icon: BarChart3,
          description: "View statistics",
        },
        {
          id: "team-members",
          label: "Team Members",
          icon: Users,
          description: "Manage game masters",
        },
        {
          id: "admin-accounts",
          label: "Admin Accounts",
          icon: Shield,
          description: "Manage admin access",
        },
      ],
    },
  ];

  const menuItems = menuSections.flatMap((s) => s.items);

  // Mobile bottom nav groups
  const mobileGroups = [
    {
      id: "dashboard",
      label: "Home",
      icon: Home,
      items: null, // direct navigate
    },
    {
      id: "events",
      label: "Events",
      icon: Calendar,
      items: menuSections[1].items, // EMURPG section
    },
    {
      id: "emucon",
      label: "EMUCON",
      icon: Sparkles,
      items: menuSections[2].items, // EMUCON section
    },
    {
      id: "management",
      label: "Manage",
      icon: Settings,
      items: menuSections[3].items, // Management section
    },
  ];

  // Find which mobile group the active panel belongs to
  const activeGroupId =
    mobileGroups.find((g) => g.items?.some((item) => item.id === activePanel))
      ?.id || (activePanel === "dashboard" ? "dashboard" : null);

  const handleMobileGroupTap = (group) => {
    if (!group.items) {
      // Direct navigate (Dashboard)
      setExpandedGroup(null);
      onPanelChange(group.id);
      return;
    }
    if (expandedGroup === group.id) {
      // Collapse if already expanded
      setExpandedGroup(null);
    } else {
      // Expand and navigate to first sub-item if not already in this group
      setExpandedGroup(group.id);
      if (activeGroupId !== group.id) {
        onPanelChange(group.items[0].id);
      }
    }
  };

  const handleSubItemTap = (itemId) => {
    onPanelChange(itemId);
  };

  const expandedGroupData = mobileGroups.find((g) => g.id === expandedGroup);

  return (
    <div className="min-h-screen bg-gray-950 flex">
      {/* Castle Background SVG - Fixed */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <svg
          className="absolute bottom-0 w-full h-48 md:h-64"
          viewBox="0 0 1200 200"
          preserveAspectRatio="xMidYMax slice"
          fill="none"
        >
          {/* Castle silhouette */}
          <path
            d="M0,200 L0,120 L30,120 L30,100 L50,100 L50,120 L80,120 L80,80 L100,60 L120,80 L120,120 
               L180,120 L180,90 L200,70 L220,90 L220,120 L280,120 L280,100 L300,100 L300,120 
               L360,120 L360,60 L380,40 L400,60 L400,120 L460,120 L460,100 L480,100 L480,120 
               L540,120 L540,80 L560,60 L580,80 L580,120 L640,120 L640,90 L660,70 L680,90 L680,120 
               L740,120 L740,100 L760,100 L760,120 L820,120 L820,60 L840,40 L860,60 L860,120 
               L920,120 L920,100 L940,100 L940,120 L1000,120 L1000,80 L1020,60 L1040,80 L1040,120 
               L1100,120 L1100,90 L1120,70 L1140,90 L1140,120 L1200,120 L1200,200 Z"
            fill="rgba(17, 24, 39, 0.95)"
            stroke="rgba(234, 179, 8, 0.2)"
            strokeWidth="1"
          />
          {/* Tower windows */}
          {[100, 380, 560, 840, 1020].map((x, i) => (
            <rect
              key={i}
              x={x - 5}
              y={70}
              width={10}
              height={15}
              fill={`rgba(234, 179, 8, ${0.3 * torchFlicker})`}
              rx="2"
            />
          ))}
        </svg>

        {/* Torch flames */}
        <div
          className="absolute bottom-48 left-[8%] w-4 h-8 rounded-full blur-md"
          style={{
            background: `radial-gradient(circle, rgba(234, 179, 8, ${
              0.6 * torchFlicker
            }) 0%, rgba(239, 68, 68, ${
              0.3 * torchFlicker
            }) 50%, transparent 70%)`,
            transform: `scale(${torchFlicker})`,
          }}
        />
        <div
          className="absolute bottom-52 right-[8%] w-4 h-8 rounded-full blur-md"
          style={{
            background: `radial-gradient(circle, rgba(234, 179, 8, ${
              0.6 * torchFlicker
            }) 0%, rgba(239, 68, 68, ${
              0.3 * torchFlicker
            }) 50%, transparent 70%)`,
            transform: `scale(${torchFlicker})`,
          }}
        />
      </div>

      {/* Sidebar - Desktop Only */}
      <aside
        className={`fixed lg:relative z-40 h-screen bg-gray-900/95 border-r border-yellow-900/30 backdrop-blur-sm transition-all duration-300 ${
          isSidebarOpen ? "w-64" : "w-20"
        } hidden lg:flex lg:flex-col`}
      >
        {/* Logo/Header */}
        <div className="p-4 border-b border-yellow-900/30">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-900/40 rounded-lg">
              <Castle className="w-6 h-6 text-yellow-300" />
            </div>
            {isSidebarOpen && (
              <div>
                <h1 className="font-bold text-yellow-500 font-cinzel">
                  EMURPG
                </h1>
                <p className="text-xs text-gray-500">Admin Panel</p>
              </div>
            )}
          </div>
        </div>

        {/* Server health badge */}
        {isSidebarOpen && (
          <div className="px-4 py-2 border-b border-yellow-900/20">
            <ServerStatus />
          </div>
        )}

        {/* Toggle Button */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="absolute -right-3 top-20 p-1.5 bg-gray-800 border border-gray-700 rounded-full hover:bg-gray-700 transition-colors"
        >
          <ChevronRight
            className={`w-4 h-4 text-gray-400 transition-transform ${
              isSidebarOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* Navigation */}
        <nav className="p-3 space-y-1 overflow-y-auto h-[calc(100vh-180px)]">
          {menuSections.map((section, si) => (
            <div key={si}>
              {section.label && isSidebarOpen && (
                <p className="px-3 pt-4 pb-1 text-[10px] font-semibold uppercase tracking-widest text-gray-500">
                  {section.label}
                </p>
              )}
              {section.label && !isSidebarOpen && si > 0 && (
                <div className="mx-3 my-2 border-t border-gray-700/50" />
              )}
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = activePanel === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onPanelChange(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                      isActive
                        ? "bg-yellow-900/40 text-yellow-400 border border-yellow-500/30"
                        : "bg-transparent text-gray-400 hover:bg-gray-800 hover:text-white border border-transparent"
                    }`}
                    title={!isSidebarOpen ? item.label : undefined}
                  >
                    <Icon
                      className={`w-5 h-5 flex-shrink-0 ${
                        isActive ? "text-yellow-300" : ""
                      }`}
                    />
                    {isSidebarOpen && (
                      <div className="text-left">
                        <p className="text-sm font-medium">{item.label}</p>
                        <p className="text-xs text-gray-500">
                          {item.description}
                        </p>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        {/* User/Logout */}
        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-yellow-900/30 bg-gray-900/95">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-gray-800 rounded-full">
              <Shield className="w-4 h-4 text-yellow-500" />
            </div>
            {isSidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {loginData?.username || "Admin"}
                </p>
                <p className="text-xs text-gray-500">EMURPG Admin</p>
              </div>
            )}
          </div>
          <button
            onClick={handleLogout}
            className={`w-full flex items-center justify-center gap-2 px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors ${
              !isSidebarOpen ? "px-2" : ""
            }`}
          >
            <LogOut className="w-4 h-4" />
            {isSidebarOpen && <span className="text-sm">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Header — branding only */}
      <div className="fixed top-0 left-0 right-0 z-50 lg:hidden bg-gray-900/95 border-b border-yellow-900/30 backdrop-blur-sm">
        <div className="flex items-center justify-between p-3 sm:p-4">
          <div className="flex items-center gap-2">
            <Castle className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500" />
            <span className="font-bold text-yellow-500 font-cinzel text-sm sm:text-base">
              EMURPG Admin
            </span>
          </div>
          <ServerStatus />
        </div>
      </div>

      {/* Mobile Bottom Nav — grouped with expanding secondary row */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-50 lg:hidden"
        style={{
          background:
            "linear-gradient(to top, rgba(3,7,30,0.98) 0%, rgba(3,7,30,0.93) 100%)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderTop: "1px solid rgba(234,179,8,0.12)",
          paddingBottom: "max(env(safe-area-inset-bottom, 0px), 4px)",
        }}
      >
        {/* Secondary row — sub-items for expanded group */}
        {expandedGroupData?.items && (
          <div
            className="flex overflow-x-auto px-2 py-1.5 border-b border-yellow-900/20"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {expandedGroupData.items.map((item) => {
              const Icon = item.icon;
              const isActive = activePanel === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSubItemTap(item.id)}
                  className={`flex items-center gap-1.5 flex-shrink-0 px-3 py-1.5 rounded-lg transition-all duration-200 active:scale-95 ${
                    isActive
                      ? "bg-yellow-900/30 text-yellow-400 border border-yellow-500/30"
                      : "text-gray-400 hover:text-gray-200 border border-transparent"
                  }`}
                >
                  <Icon
                    className={`w-3.5 h-3.5 flex-shrink-0 ${
                      isActive ? "text-yellow-300" : ""
                    }`}
                  />
                  <span
                    className={`text-[11px] font-medium whitespace-nowrap ${
                      isActive ? "text-yellow-400" : "text-gray-500"
                    }`}
                  >
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* Primary row — category tabs */}
        <div className="flex items-stretch justify-around px-1 py-1">
          {mobileGroups.map((group) => {
            const Icon = group.icon;
            const isGroupActive = activeGroupId === group.id;
            const isExpanded = expandedGroup === group.id;
            return (
              <button
                key={group.id}
                onClick={() => handleMobileGroupTap(group)}
                className={`flex flex-col items-center justify-center flex-1 py-2 px-1 rounded-xl gap-1 transition-all duration-200 active:scale-95 ${
                  isGroupActive
                    ? "text-yellow-400"
                    : "text-gray-500 hover:text-gray-300"
                }`}
              >
                <div className="relative flex items-center justify-center">
                  <Icon
                    className={`w-5 h-5 transition-all duration-200 ${
                      isGroupActive
                        ? "drop-shadow-[0_0_6px_rgba(250,204,21,0.5)]"
                        : ""
                    }`}
                  />
                  {isGroupActive && !isExpanded && (
                    <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-yellow-400" />
                  )}
                  {isExpanded && (
                    <span className="absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full bg-yellow-400" />
                  )}
                </div>
                <span
                  className={`text-[10px] font-medium leading-none whitespace-nowrap transition-all duration-200 ${
                    isGroupActive ? "text-yellow-400" : "text-gray-600"
                  }`}
                >
                  {group.label}
                </span>
              </button>
            );
          })}
          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex flex-col items-center justify-center flex-1 py-2 px-1 rounded-xl gap-1 transition-all duration-200 active:scale-95 text-red-400/60 hover:text-red-400"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-[10px] font-medium leading-none whitespace-nowrap text-red-400/50">
              Logout
            </span>
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 lg:ml-0 min-h-screen pt-14 sm:pt-16 lg:pt-0 pb-20 lg:pb-0 relative z-10">
        <div className="p-3 sm:p-4 md:p-6 lg:p-8">
          {/* Breadcrumb */}
          {activePanel !== "dashboard" && (
            <nav className="flex items-center gap-2 text-sm text-gray-500 mb-4">
              <button
                onClick={() => onPanelChange("dashboard")}
                className="hover:text-yellow-500 transition-colors"
              >
                Admin
              </button>
              <ChevronRight className="w-3 h-3" />
              <span className="text-yellow-500">
                {menuItems.find((m) => m.id === activePanel)?.label ||
                  activePanel}
              </span>
            </nav>
          )}
          {children}
        </div>
      </main>
    </div>
  );
};

AdminLayout.propTypes = {
  children: PropTypes.node.isRequired,
  activePanel: PropTypes.string.isRequired,
  onPanelChange: PropTypes.func.isRequired,
  onLogout: PropTypes.func,
};

export default AdminLayout;
