import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";
import { GlobalAudioProvider } from "./contexts/GlobalAudioContext";
import { WebSocketProvider } from "./contexts/WebSocketContext";
import BottomNavBar from "./components/layout/BottomNavBar";

// Pages
import HomePage from "./pages/HomePage";
import EventsPage from "./pages/EventsPage";
import TableDetailPage from "./pages/TableDetailPage";
import AdminPage from "./pages/Admin";
import EmuconThankYou from "./pages/Emucon/ThankYou";
import EmuconSponsors from "./pages/Emucon/Sponsors";
import EmuconRulesPage from "./pages/EmuconRulesPage";
import EmuconDemoHome from "./pages/Emucon/DemoHome";
import EmuconDemoLive from "./pages/Emucon/DemoLive";
import CharrollerLanding from "./pages/Charroller/Landing";
import CharrollerManager from "./pages/Charroller/Manager";
import Privacy from "./pages/Privacy";
import NotFound from "./pages/NotFound";

function AppContent() {
  console.log(
    "Hello my curious friend! If you are seeing this, you must be interested in how this app works. Feel free to reach out to me on contact@cevdetbaran.com if you want to help me on EMURPG's apps.",
  );

  const handleLanguageSwitch = (language) => {
    i18n.changeLanguage(language);
  };

  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route path="/" element={<HomePage onLanguageSwitch={handleLanguageSwitch} />} />
        <Route path="/events" element={<EventsPage onLanguageSwitch={handleLanguageSwitch} />} />
        <Route path="/table/:slug" element={<TableDetailPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/emucon" element={<EmuconThankYou />} />
        <Route path="/emucon/live" element={<EmuconThankYou />} />
        <Route path="/emucon/sponsors" element={<EmuconSponsors />} />
        <Route path="/emucon/rules" element={<EmuconRulesPage />} />
        <Route path="/emucon/register/:token" element={<EmuconThankYou />} />
        <Route
          path="/charroller"
          element={
            <GlobalAudioProvider>
              <CharrollerLanding onLanguageSwitch={handleLanguageSwitch} />
            </GlobalAudioProvider>
          }
        />
        <Route
          path="/charroller/manager"
          element={
            <GlobalAudioProvider>
              <CharrollerManager onLanguageSwitch={handleLanguageSwitch} />
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
  );
}

function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <WebSocketProvider>
        <AppContent />
      </WebSocketProvider>
    </I18nextProvider>
  );
}

export default App;
