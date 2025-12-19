// Admin Components
export { default as AdminLogin } from "./AdminLogin";
export { default as AdminMain } from "./AdminMain";
export { default as AdminLayout } from "./AdminLayout";
export { default as AdminSidebar } from "./AdminSidebar";
export { default as AdminHeader } from "./AdminHeader";

// Panel Components - EMUCON
export { default as EmuconAdminPanel } from "./EmuconAdminPanel";
export { default as EmuconManagersPanel } from "./EmuconManagersPanel";
export { default as EmuconSchedulePanel } from "./EmuconSchedulePanel";

// Panel Components - EMURPG
export { default as EventsAdminPanel } from "./EventsAdminPanel";
export { default as TablesAdminPanel } from "./TablesAdminPanel";
export { default as GamesLibraryPanel } from "./GamesLibraryPanel";
export { default as RegistrationsPanel } from "./RegistrationsPanel";
export { default as ReportsPanel } from "./ReportsPanel";
export { default as AnalyticsPanel } from "./AnalyticsPanel";

// Shared UI Components
export { default as AdminModal } from "./shared/AdminModal";
export { default as AdminButton } from "./shared/AdminButton";
export { default as ConfirmDialog } from "./shared/ConfirmDialog";
export { default as LoadingSpinner } from "./shared/LoadingSpinner";

// Re-export Emucon admin components
export * from "./Emucon";
