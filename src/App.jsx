import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import TableDetailPage from "./pages/TableDetailPage";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";
import AdminDashboard from "./components/AdminDashboard";
import Login from "./components/Login";
import EventsPage from "./pages/EventsPage";
import EmuconRulesPage from "./pages/EmuconRulesPage";
import EmuconHome from "./pages/Emucon/Home";
import EmuconSponsors from "./pages/Emucon/Sponsors";
import NotFound from "./components/NotFound";
import Privacy from "./components/Privacy";

// Inner component that has access to translation context
function AppContent() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  console.log(
    "Hello my curious friend! If you are seeing this, you must be interested in how this app works. Feel free to reach out to me on cevdetbaranoral@gmail.com if you want to help me on EMURPG's apps."
  );
  useEffect(() => {
    checkLoginStatus();
  }, []);

  const handleLanguageSwitch = (language) => {
    i18n.changeLanguage(language);
  };

  const checkLoginStatus = () => {
    const loginData = localStorage.getItem("login");
    const apiKeyData = localStorage.getItem("apiKey");

    if (loginData && apiKeyData) {
      const { expirationTime } = JSON.parse(loginData);
      const currentTime = new Date().getTime();

      if (currentTime < expirationTime) {
        setIsLoggedIn(true);
      } else {
        // Session expired, clear localStorage
        localStorage.removeItem("login");
        localStorage.removeItem("apiKey");
      }
    }
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("login");
    localStorage.removeItem("apiKey");
    setIsLoggedIn(false);
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
          <Route
            path="/admin"
            element={
              isLoggedIn ? (
                <AdminDashboard onLogout={handleLogout} />
              ) : (
                <Login onLogin={handleLogin} />
              )
            }
          />
          <Route path="/emucon" element={<EmuconHome />} />
          <Route path="/emucon/sponsors" element={<EmuconSponsors />} />
          <Route path="/emucon/rules" element={<EmuconRulesPage />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
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
