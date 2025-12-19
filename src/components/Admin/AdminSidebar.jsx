import PropTypes from "prop-types";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Calendar,
  Users,
  Gamepad2,
  FileText,
  BarChart3,
  Settings,
  Shield,
  PartyPopper,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const AdminSidebar = ({ collapsed, onToggle, adminType = "emurpg" }) => {
  const location = useLocation();

  const emurpgMenuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/admin" },
    { icon: Calendar, label: "Events", path: "/admin/events" },
    { icon: Gamepad2, label: "Games", path: "/admin/games" },
    { icon: Users, label: "Registrations", path: "/admin/registrations" },
    {
      icon: PartyPopper,
      label: "EMUCON Managers",
      path: "/admin/emucon-managers",
    },
    { icon: BarChart3, label: "Analytics", path: "/admin/analytics" },
    { icon: FileText, label: "Reports", path: "/admin/reports" },
    { icon: Settings, label: "Settings", path: "/admin/settings" },
  ];

  const emuconMenuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/admin" },
    { icon: Calendar, label: "My Events", path: "/admin/events" },
    { icon: Users, label: "Participants", path: "/admin/participants" },
    { icon: FileText, label: "Schedule Requests", path: "/admin/schedule" },
  ];

  const menuItems = adminType === "emurpg" ? emurpgMenuItems : emuconMenuItems;

  return (
    <aside
      className={`fixed left-0 top-0 z-40 h-screen border-r border-[#9d0208]/30 bg-gradient-to-b from-[#03071e] via-[#370617] to-[#03071e] transition-all duration-300 hidden lg:block ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      {/* Stone texture overlay */}
      <div className="absolute inset-0 opacity-5 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMSIgZmlsbD0iI2ZmZiIvPjwvc3ZnPg==')]" />

      {/* Header */}
      <div className="relative flex h-16 items-center justify-between border-b border-[#9d0208]/30 bg-gradient-to-r from-[#6a040f]/30 to-transparent px-4">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-[#ffba08]" />
            <span className="font-metamorphous text-lg font-bold text-[#faa307]">
              {adminType === "emurpg" ? "EMURPG" : "EMUCON"}
            </span>
          </div>
        )}
        {collapsed && <Shield className="mx-auto h-6 w-6 text-[#ffba08]" />}
      </div>

      {/* Navigation */}
      <nav className="relative mt-4 px-2 ">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`group mb-1 flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all ${
                isActive
                  ? "bg-gradient-to-r from-[#9d0208]/20 to-[#6a040f]/10 text-[#faa307] shadow-inner shadow-[#9d0208]/20"
                  : "text-gray-400 hover:bg-[#6a040f]/10 hover:text-[#faa307]"
              }`}
            >
              <item.icon
                className={`h-5 w-5 flex-shrink-0 ${
                  isActive
                    ? "text-[#ffba08]"
                    : "text-gray-500 group-hover:text-[#faa307]/70"
                }`}
              />
              {!collapsed && (
                <span className="truncate text-sm font-medium">
                  {item.label}
                </span>
              )}
              {isActive && (
                <div className="absolute left-0 h-8 w-1 rounded-r-full bg-[#f48c06]" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Toggle Button */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-20 rounded-full border border-[#9d0208]/50 bg-[#03071e] p-1.5 text-[#faa307] shadow-lg transition-all hover:bg-[#370617] hover:text-[#ffba08]"
      >
        {collapsed ? (
          <ChevronRight className="h-4 w-4" />
        ) : (
          <ChevronLeft className="h-4 w-4" />
        )}
      </button>

      {/* Admin Type Badge */}
      <div className="absolute bottom-4 left-0 right-0 px-4">
        {!collapsed && (
          <div
            className={`rounded-lg border px-3 py-2 text-center text-xs ${
              adminType === "emurpg"
                ? "border-[#f48c06]/30 bg-[#6a040f]/30 text-[#faa307]"
                : "border-[#9d0208]/30 bg-[#370617]/30 text-[#e85d04]"
            }`}
          >
            {adminType === "emurpg" ? "Full Admin Access" : "Event Manager"}
          </div>
        )}
      </div>
    </aside>
  );
};

AdminSidebar.propTypes = {
  collapsed: PropTypes.bool,
  onToggle: PropTypes.func,
  adminType: PropTypes.oneOf(["emurpg", "emucon_manager"]),
};

export default AdminSidebar;
