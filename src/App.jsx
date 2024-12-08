import React, { useState, useEffect } from "react";import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import TableDetailPage from "./pages/TableDetailPage";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";
import AdminDashboard from "./components/AdminDashboard";
import Login from "./components/Login";
import EventsPage from "./pages/EventsPage";
import NotFound from "./components/NotFound";
import Privacy from "./components/Privacy";
import HomePage from "./pages/HomePage";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkLoginStatus();
  }, []);

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

    setIsLoading(false);
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("login");
    localStorage.removeItem("apiKey");
    setIsLoggedIn(false);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <I18nextProvider i18n={i18n}>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/events" element={<EventsPage />} />
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
    </I18nextProvider>
  );
}

export default App;
