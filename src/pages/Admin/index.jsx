import { useState, useEffect } from "react";
import { AdminLogin, AdminMain } from "../../components/Admin";
import { EmuconManagerDashboard } from "../../components/Admin/Emucon";

const AdminPage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [adminType, setAdminType] = useState(null); // 'emurpg' | 'emucon_manager'
  const [managerData, setManagerData] = useState(null);

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = () => {
    const loginData = localStorage.getItem("login");
    if (!loginData) return;

    const { expirationTime, adminType: storedAdminType, clubId, clubName } =
      JSON.parse(loginData);
    const currentTime = new Date().getTime();

    if (currentTime < expirationTime) {
      setIsLoggedIn(true);
      setAdminType(storedAdminType || "emurpg");
      if (storedAdminType === "emucon_manager") {
        setManagerData({ clubId, clubName });
      }
    } else {
      localStorage.removeItem("login");
      localStorage.removeItem("apiKey");
    }
  };

  const handleLogin = (result) => {
    setIsLoggedIn(true);
    setAdminType(result?.adminType || "emurpg");
  };

  const handleEmuconManagerLogin = (result) => {
    setIsLoggedIn(true);
    setAdminType("emucon_manager");
    setManagerData({ clubId: result.clubId, clubName: result.clubName });
  };

  const handleLogout = () => {
    localStorage.removeItem("login");
    localStorage.removeItem("apiKey");
    setIsLoggedIn(false);
    setAdminType(null);
    setManagerData(null);
  };

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

  return <AdminMain onLogout={handleLogout} />;
};

export default AdminPage;
