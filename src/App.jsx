import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import TableDetailPage from "./pages/TableDetailPage";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";
import AdminDashboard from "./components/AdminDashboard";
import { AdminLogin, AdminMain } from "./components/Admin";
import { EmuconManagerDashboard } from "./components/Admin/Emucon";
import EventsPage from "./pages/EventsPage";
import EmuconRulesPage from "./pages/EmuconRulesPage";
import EmuconThankYou from "./pages/Emucon/ThankYou";
import EmuconSponsors from "./pages/Emucon/Sponsors";
import CharrollerLandingPage from "./pages/CharrollerLandingPage";
import CharrollerPage from "./pages/CharrollerPage";
import NotFound from "./components/NotFound";
import Privacy from "./components/Privacy";
import { GlobalAudioProvider } from "./contexts/GlobalAudioContext";
import EmuconDemoLive from "./pages/Emucon/DemoLive";
import EmuconDemoHome from "./pages/Emucon/DemoHome";
import BottomNavBar from "./components/BottomNavBar";

// Inner component that has access to translation context
function AppContent() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [adminType, setAdminType] = useState(null); // 'emurpg' or 'emucon_manager'
  const [managerData, setManagerData] = useState(null);
  const [useNewAdmin, setUseNewAdmin] = useState(true); // Toggle for new vs legacy admin

  console.log(
    "Hello my curious friend! If you are seeing this, you must be interested in how this app works. Feel free to reach out to me on cevdetbaranoral@gmail.com if you want to help me on EMURPG's apps.",
  );

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const handleLanguageSwitch = (language) => {
    i18n.changeLanguage(language);
  };

  const checkLoginStatus = () => {
    const loginData = localStorage.getItem("login");

    if (loginData) {
      const {
        expirationTime,
        adminType: storedAdminType,
        clubId,
        clubName,
      } = JSON.parse(loginData);
      const currentTime = new Date().getTime();

      if (currentTime < expirationTime) {
        setIsLoggedIn(true);
        setAdminType(storedAdminType || "emurpg");
        if (storedAdminType === "emucon_manager") {
          setManagerData({ clubId, clubName });
        }
      } else {
        // Session expired, clear localStorage
        localStorage.removeItem("login");
        localStorage.removeItem("apiKey");
      }
    }
  };

  const handleLogin = (result) => {
    setIsLoggedIn(true);
    setAdminType(result?.adminType || "emurpg");
  };

  const handleEmuconManagerLogin = (result) => {
    setIsLoggedIn(true);
    setAdminType("emucon_manager");
    setManagerData({
      clubId: result.clubId,
      clubName: result.clubName,
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("login");
    localStorage.removeItem("apiKey");
    setIsLoggedIn(false);
    setAdminType(null);
    setManagerData(null);
  };

  // Render appropriate admin dashboard based on admin type
  const renderAdminPage = () => {
    if (!isLoggedIn) {
      return (
        <AdminLogin
          onLogin={handleLogin}
          onEmuconManagerLogin={handleEmuconManagerLogin}
        />
      );
    }

    if (adminType === "emucon_manager" && managerData) {
      return (
        <EmuconManagerDashboard
          clubId={managerData.clubId}
          clubName={managerData.clubName}
          onLogout={handleLogout}
        />
      );
    }

    // Use new AdminMain with sidebar navigation
    if (useNewAdmin) {
      return <AdminMain onLogout={handleLogout} />;
    }

    // Legacy AdminDashboard (fallback)
    return <AdminDashboard onLogout={handleLogout} />;
  };

  return (
    <>
      <Router>
        <Routes>
          <Route
            path="/"
            element={<HomePage onLanguageSwitch={handleLanguageSwitch} />}
          />
          <Route
            path="/events"
            element={<EventsPage onLanguageSwitch={handleLanguageSwitch} />}
          />
          <Route path="/table/:slug" element={<TableDetailPage />} />
          <Route path="/admin" element={renderAdminPage()} />
          <Route path="/emucon" element={<EmuconThankYou />} />
          <Route path="/emucon/live" element={<EmuconThankYou />} />
          <Route path="/emucon/sponsors" element={<EmuconSponsors />} />
          <Route path="/emucon/rules" element={<EmuconRulesPage />} />
          <Route path="/emucon/register/:token" element={<EmuconThankYou />} />
          {/* Charroller routes wrapped with GlobalAudioProvider for persistent music */}
          <Route
            path="/charroller"
            element={
              <GlobalAudioProvider>
                <CharrollerLandingPage
                  onLanguageSwitch={handleLanguageSwitch}
                />
              </GlobalAudioProvider>
            }
          />
          <Route
            path="/charroller/manager"
            element={
              <GlobalAudioProvider>
                <CharrollerPage onLanguageSwitch={handleLanguageSwitch} />
              </GlobalAudioProvider>
            }
          />
          <Route path="/demo/emucon" element={<EmuconDemoHome />} />
          <Route path="/demo/emucon/live" element={<EmuconDemoLive />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <BottomNavBar onLanguageSwitch={handleLanguageSwitch} />
      </Router>
    </>
  );
}

// Main App component with I18nextProvider
function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <AppContent />
    </I18nextProvider>
  );
}

export default App;
