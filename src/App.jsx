import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import TableDetailPage from "./pages/TableDetailPage";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";
import AdminDashboard from "./components/AdminDashboard";
import Login from "./components/Login";
import EventsPage from "./pages/EventsPage";
import NotFound from "./components/NotFound";
import Privacy from "./components/Privacy";
import { LanguageSelector } from "./components";

// Inner component that has access to translation context
function AppContent() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);

  useEffect(() => {
    checkLanguageSelection();
    checkLoginStatus();
  }, []);

  const checkLanguageSelection = () => {
    const savedLanguage = localStorage.getItem("selectedLanguage");
    if (!savedLanguage) {
      setShowLanguageSelector(true);
    }
  };

  const handleLanguageSelect = (language) => {
    i18n.changeLanguage(language);
    setShowLanguageSelector(false);
  };

  const handleLanguageSwitch = () => {
    setShowLanguageSelector(true);
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
      {showLanguageSelector && (
        <LanguageSelector onLanguageSelect={handleLanguageSelect} />
      )}
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
          <Route path="*" element={<NotFound />} />
          <Route path="/privacy" element={<Privacy />} />
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
