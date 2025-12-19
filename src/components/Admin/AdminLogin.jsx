import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { sha256 } from "js-sha256";
import { config } from "../../config";
import { setApiKey, setLoginData } from "../../utils/auth";
import {
  Shield,
  Key,
  User,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  Castle,
  Scroll,
} from "lucide-react";

const AdminLogin = ({ onLogin, onEmuconManagerLogin }) => {
  const [loginMode, setLoginMode] = useState("credentials"); // 'credentials' or 'invite'
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showSetPassword, setShowSetPassword] = useState(false);
  const [inviteData, setInviteData] = useState(null);

  // Second validation for EMURPG admins
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState("");
  const [pendingLoginResult, setPendingLoginResult] = useState(null);
  const [apiKeyError, setApiKeyError] = useState("");

  const backendUrl = config.backendUrl;

  // Animated torch effect
  const [torchFlicker, setTorchFlicker] = useState(1);
  useEffect(() => {
    const interval = setInterval(() => {
      setTorchFlicker(0.85 + Math.random() * 0.3);
    }, 150);
    return () => clearInterval(interval);
  }, []);

  const handleCredentialsSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    try {
      const hashedPassword = sha256(password);

      const response = await fetch(`${backendUrl}/api/admin/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, hashedPassword }),
      });

      const result = await response.json();

      if (response.ok) {
        // Check if this is an EMURPG admin - require second validation
        if (result.adminType === "emurpg") {
          setPendingLoginResult(result);
          setShowApiKeyModal(true);
          setApiKeyInput("");
          setApiKeyError("");
        } else {
          // EMUCON managers can proceed directly
          setLoginData({
            username,
            adminType: result.adminType,
            clubId: result.clubId || null,
            clubName: result.clubName || null,
          });

          if (result.apiKey) {
            setApiKey(result.apiKey);
          }

          onEmuconManagerLogin?.(result);
        }
      } else {
        setErrorMessage(result.detail || "Invalid credentials");
      }
    } catch (error) {
      setErrorMessage("Connection failed. Please try again.");
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInviteSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch(`${backendUrl}/api/admin/verify-invite`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inviteCode }),
      });

      const result = await response.json();

      if (response.ok) {
        setInviteData(result);
        setShowSetPassword(true);
      } else {
        setErrorMessage(result.detail || "Invalid invitation code");
      }
    } catch (error) {
      setErrorMessage("Connection failed. Please try again.");
      console.error("Invite verification error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    if (newPassword !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      setIsLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setErrorMessage("Password must be at least 6 characters");
      setIsLoading(false);
      return;
    }

    try {
      const hashedPassword = sha256(newPassword);

      const response = await fetch(`${backendUrl}/api/admin/activate-invite`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inviteCode,
          hashedPassword,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        const expirationTime = new Date().getTime() + 30 * 60 * 1000;
        localStorage.setItem(
          "login",
          JSON.stringify({
            username: result.username,
            expirationTime,
            adminType: "emucon_manager",
            clubId: result.clubId,
          })
        );

        onEmuconManagerLogin?.(result);
      } else {
        setErrorMessage(result.detail || "Failed to activate account");
      }
    } catch (error) {
      setErrorMessage("Connection failed. Please try again.");
      console.error("Activation error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle API key validation for EMURPG admins
  const handleApiKeyValidation = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setApiKeyError("");

    if (!apiKeyInput.trim()) {
      setApiKeyError("API key is required");
      setIsLoading(false);
      return;
    }

    try {
      // Validate the API key against the backend
      const response = await fetch(`${backendUrl}/api/admin/validate-key`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apiKey: apiKeyInput.trim(),
        },
      });

      if (response.ok) {
        // API key is valid - complete the login
        setLoginData({
          username,
          adminType: pendingLoginResult.adminType,
          clubId: pendingLoginResult.clubId || null,
          clubName: pendingLoginResult.clubName || null,
        });

        setApiKey(apiKeyInput.trim());
        setShowApiKeyModal(false);
        onLogin(pendingLoginResult);
      } else {
        setApiKeyError("Invalid API key. Access denied.");
      }
    } catch (error) {
      setApiKeyError("Validation failed. Please try again.");
      console.error("API key validation error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelApiKey = () => {
    setShowApiKeyModal(false);
    setPendingLoginResult(null);
    setApiKeyInput("");
    setApiKeyError("");
  };

  return (
    <div className="min-h-screen w-full overflow-hidden bg-gray-950">
      {/* API Key Modal for EMURPG Admins */}
      {showApiKeyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-md mx-4">
            {/* Modal glow effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-[#9d0208] via-[#d00000] to-[#9d0208] rounded-2xl blur-lg opacity-50 animate-pulse" />

            <div className="relative bg-gradient-to-b from-[#03071e] to-[#370617] border-2 border-[#9d0208]/50 rounded-2xl p-8 shadow-2xl">
              {/* Header */}
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#6a040f]/30 border-2 border-[#d00000]/50 mb-4">
                  <Key className="w-8 h-8 text-[#ffba08]" />
                </div>
                <h2 className="text-2xl font-bold text-[#faa307] font-metamorphous">
                  Second Validation
                </h2>
                <p className="text-gray-400 text-sm mt-2">
                  Enter your API key to complete authentication
                </p>
              </div>

              {/* Error message */}
              {apiKeyError && (
                <div className="mb-4 flex items-center gap-2 rounded-lg border border-red-500/50 bg-red-900/20 px-4 py-3 text-red-400">
                  <AlertCircle className="h-5 w-5 flex-shrink-0" />
                  <span className="text-sm">{apiKeyError}</span>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleApiKeyValidation} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    API Key
                  </label>
                  <div className="relative">
                    <Key className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#9d0208]" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={apiKeyInput}
                      onChange={(e) => setApiKeyInput(e.target.value)}
                      placeholder="Enter your API key"
                      className="w-full rounded-lg border-2 border-[#6a040f]/50 bg-[#03071e]/80 py-3 pl-12 pr-12 text-white placeholder-gray-500 focus:border-[#f48c06] focus:outline-none focus:ring-2 focus:ring-[#f48c06]/20 transition-all"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#faa307] transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleCancelApiKey}
                    className="flex-1 py-3 px-4 rounded-lg border-2 border-gray-600 text-gray-400 hover:border-gray-500 hover:text-gray-300 transition-all font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 py-3 px-4 rounded-lg bg-gradient-to-r from-[#d00000] to-[#9d0208] text-white font-bold hover:from-[#dc2f02] hover:to-[#d00000] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Validating...
                      </>
                    ) : (
                      <>
                        <Shield className="h-5 w-5" />
                        Verify
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Security notice */}
              <div className="mt-6 pt-4 border-t border-[#6a040f]/30">
                <p className="text-xs text-gray-500 text-center">
                  This additional verification ensures secure access to admin
                  functions
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Animated background with castle silhouette */}
      <div className="fixed inset-0">
        {/* Dark gradient base */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-gray-950 to-black" />

        {/* Castle silhouette */}
        <div className="absolute inset-x-0 bottom-0 h-64 opacity-20">
          <svg
            viewBox="0 0 1200 200"
            className="h-full w-full"
            preserveAspectRatio="none"
          >
            <path
              d="M0 200 L0 150 L50 150 L50 100 L70 100 L70 80 L90 80 L90 100 L110 100 L110 150 
                 L200 150 L200 120 L220 120 L220 60 L240 60 L240 40 L260 40 L260 60 L280 60 L280 120 L300 120 L300 150
                 L400 150 L400 100 L450 100 L450 50 L480 30 L510 50 L510 100 L560 100 L560 150
                 L700 150 L700 80 L750 80 L750 40 L770 40 L770 20 L790 20 L790 40 L810 40 L810 80 L860 80 L860 150
                 L950 150 L950 110 L1000 110 L1000 70 L1020 70 L1020 50 L1040 50 L1040 70 L1060 70 L1060 110 L1110 110 L1110 150
                 L1200 150 L1200 200 Z"
              fill="currentColor"
              className="text-amber-900"
            />
          </svg>
        </div>

        {/* Torch glow effects */}
        <div
          className="absolute left-1/4 top-1/3 h-64 w-64 rounded-full bg-amber-500/20 blur-[100px] transition-opacity duration-150"
          style={{ opacity: torchFlicker * 0.5 }}
        />
        <div
          className="absolute right-1/4 top-1/3 h-64 w-64 rounded-full bg-amber-500/20 blur-[100px] transition-opacity duration-150"
          style={{ opacity: torchFlicker * 0.5 }}
        />

        {/* Subtle stars */}
        <div className="absolute inset-0 opacity-30">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute h-0.5 w-0.5 rounded-full bg-white"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 50}%`,
                opacity: Math.random() * 0.7 + 0.3,
              }}
            />
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="relative flex min-h-screen flex-col items-center justify-center px-4 py-8">
        {/* Logo/Shield */}
        <div className="mb-8 flex flex-col items-center">
          <div
            className="relative mb-4 rounded-full bg-gradient-to-b from-amber-600 to-amber-800 p-1 shadow-2xl shadow-amber-900/50"
            style={{ filter: `brightness(${torchFlicker})` }}
          >
            <div className="rounded-full bg-gradient-to-b from-gray-800 to-gray-900 p-6">
              <Castle className="h-12 w-12 text-amber-400" />
            </div>
          </div>
          <h1 className="font-metamorphous text-3xl font-bold tracking-wide text-amber-100">
            EMURPG Admin
          </h1>
          <p className="mt-2 text-sm text-amber-400/60">
            Enter the realm of management
          </p>
        </div>

        {/* Login Card */}
        <div className="w-full max-w-md">
          <div className="relative overflow-hidden rounded-xl border border-amber-900/40 bg-gradient-to-b from-gray-900/95 to-gray-950/95 p-8 shadow-2xl backdrop-blur-sm">
            {/* Stone texture overlay */}
            <div className="absolute inset-0 opacity-5 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMSIgZmlsbD0iI2ZmZiIvPjwvc3ZnPg==')]" />

            {/* Top ornament */}
            <div className="absolute inset-x-0 top-0 flex justify-center">
              <div className="h-1 w-32 rounded-b-full bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />
            </div>

            {/* Mode Toggle */}
            {!showSetPassword && (
              <div className="relative mb-6 flex rounded-lg border border-amber-900/30 bg-gray-900/50 p-1">
                <button
                  type="button"
                  onClick={() => setLoginMode("credentials")}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all ${
                    loginMode === "credentials"
                      ? "bg-gradient-to-b from-amber-600 to-amber-700 text-white shadow-lg shadow-amber-900/30"
                      : "text-amber-400/60 hover:text-amber-300"
                  }`}
                >
                  <Shield className="h-4 w-4" />
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => setLoginMode("invite")}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all ${
                    loginMode === "invite"
                      ? "bg-gradient-to-b from-amber-600 to-amber-700 text-white shadow-lg shadow-amber-900/30"
                      : "text-amber-400/60 hover:text-amber-300"
                  }`}
                >
                  <Scroll className="h-4 w-4" />
                  Invite Code
                </button>
              </div>
            )}

            {/* Error Message */}
            {errorMessage && (
              <div className="relative mb-4 flex items-center gap-2 rounded-lg border border-red-900/50 bg-red-950/50 px-4 py-3 text-sm text-red-300">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                {errorMessage}
              </div>
            )}

            {/* Credentials Form */}
            {loginMode === "credentials" && !showSetPassword && (
              <form
                onSubmit={handleCredentialsSubmit}
                className="relative space-y-5"
              >
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-amber-200/80">
                    <User className="h-4 w-4" />
                    Username
                  </label>
                  <input
                    type="text"
                    autoComplete="username"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="w-full rounded-lg border border-amber-900/30 bg-gray-900/70 px-4 py-3 text-amber-100 placeholder-gray-500 transition-all focus:border-amber-500/50 focus:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-amber-200/80">
                    <Lock className="h-4 w-4" />
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full rounded-lg border border-amber-900/30 bg-gray-900/70 px-4 py-3 pr-12 text-amber-100 placeholder-gray-500 transition-all focus:border-amber-500/50 focus:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-amber-400/50 transition-colors hover:text-amber-300"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="relative w-full overflow-hidden rounded-lg border border-amber-500/50 bg-gradient-to-b from-amber-600 to-amber-700 px-6 py-3 font-medium text-white shadow-lg shadow-amber-900/30 transition-all hover:from-amber-500 hover:to-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Authenticating...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <Key className="h-5 w-5" />
                      Enter the Castle
                    </span>
                  )}
                </button>
              </form>
            )}

            {/* Invite Code Form */}
            {loginMode === "invite" && !showSetPassword && (
              <form
                onSubmit={handleInviteSubmit}
                className="relative space-y-5"
              >
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-amber-200/80">
                    <Scroll className="h-4 w-4" />
                    Invitation Code
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your invitation code"
                    value={inviteCode}
                    onChange={(e) =>
                      setInviteCode(e.target.value.toUpperCase())
                    }
                    required
                    className="w-full rounded-lg border border-amber-900/30 bg-gray-900/70 px-4 py-3 font-mono text-center text-lg tracking-widest text-amber-100 placeholder-gray-500 transition-all focus:border-amber-500/50 focus:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                  />
                  <p className="text-xs text-amber-400/50">
                    Received an invitation to manage your club&apos;s EMUCON
                    events? Enter the code above.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="relative w-full overflow-hidden rounded-lg border border-amber-500/50 bg-gradient-to-b from-amber-600 to-amber-700 px-6 py-3 font-medium text-white shadow-lg shadow-amber-900/30 transition-all hover:from-amber-500 hover:to-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Verifying...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <Scroll className="h-5 w-5" />
                      Verify Invitation
                    </span>
                  )}
                </button>
              </form>
            )}

            {/* Set Password Form (after invite verification) */}
            {showSetPassword && (
              <form onSubmit={handleSetPassword} className="relative space-y-5">
                <div className="mb-4 rounded-lg border border-amber-500/30 bg-amber-950/30 p-4">
                  <p className="text-sm text-amber-200">
                    Welcome,{" "}
                    <span className="font-bold">{inviteData?.clubName}</span>{" "}
                    manager!
                  </p>
                  <p className="mt-1 text-xs text-amber-400/60">
                    Please set your password to activate your account.
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-amber-200/80">
                    <Lock className="h-4 w-4" />
                    New Password
                  </label>
                  <input
                    type="password"
                    placeholder="Enter a strong password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full rounded-lg border border-amber-900/30 bg-gray-900/70 px-4 py-3 text-amber-100 placeholder-gray-500 transition-all focus:border-amber-500/50 focus:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-amber-200/80">
                    <Lock className="h-4 w-4" />
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="w-full rounded-lg border border-amber-900/30 bg-gray-900/70 px-4 py-3 text-amber-100 placeholder-gray-500 transition-all focus:border-amber-500/50 focus:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowSetPassword(false);
                      setInviteData(null);
                      setNewPassword("");
                      setConfirmPassword("");
                    }}
                    className="flex-1 rounded-lg border border-gray-600 bg-gray-800 px-4 py-3 font-medium text-gray-300 transition-all hover:bg-gray-700"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 rounded-lg border border-amber-500/50 bg-gradient-to-b from-amber-600 to-amber-700 px-4 py-3 font-medium text-white shadow-lg shadow-amber-900/30 transition-all hover:from-amber-500 hover:to-amber-600 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <Loader2 className="mx-auto h-5 w-5 animate-spin" />
                    ) : (
                      "Activate Account"
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* Bottom ornament */}
            <div className="absolute inset-x-0 bottom-0 flex justify-center">
              <div className="h-1 w-32 rounded-t-full bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />
            </div>
          </div>
        </div>

        {/* Footer text */}
        <p className="mt-8 text-center text-xs text-amber-400/30">
          EMURPG - Eastern Mediterranean University RPG Club
        </p>
      </div>
    </div>
  );
};

AdminLogin.propTypes = {
  onLogin: PropTypes.func.isRequired,
  onEmuconManagerLogin: PropTypes.func,
};

export default AdminLogin;
