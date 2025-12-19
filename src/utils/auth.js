/**
 * Authentication utility functions
 * Handles localStorage operations for API keys and session management
 */

/**
 * Get the API key from localStorage
 * Handles both old format (raw string) and new format (JSON object)
 * @returns {string|null} The API key or null if not found
 */
export const getApiKey = () => {
  const stored = localStorage.getItem("apiKey");
  if (!stored) return null;

  try {
    // Try parsing as JSON (new format)
    const parsed = JSON.parse(stored);
    return parsed.apiKey || parsed;
  } catch {
    // Fall back to raw string (old format)
    return stored;
  }
};

/**
 * Set the API key in localStorage
 * @param {string} apiKey - The API key to store
 */
export const setApiKey = (apiKey) => {
  if (apiKey) {
    localStorage.setItem("apiKey", apiKey);
  }
};

/**
 * Clear the API key from localStorage
 */
export const clearApiKey = () => {
  localStorage.removeItem("apiKey");
};

/**
 * Get login data from localStorage
 * @returns {object|null} The login data or null if not found/expired
 */
export const getLoginData = () => {
  const stored = localStorage.getItem("login");
  if (!stored) return null;

  try {
    const data = JSON.parse(stored);
    const currentTime = new Date().getTime();

    // Check if session expired
    if (data.expirationTime && currentTime >= data.expirationTime) {
      clearSession();
      return null;
    }

    return data;
  } catch {
    return null;
  }
};

/**
 * Set login data in localStorage
 * @param {object} data - Login data including username, adminType, etc.
 * @param {number} [expirationMinutes=30] - Session duration in minutes
 */
export const setLoginData = (data, expirationMinutes = 30) => {
  const expirationTime = new Date().getTime() + expirationMinutes * 60 * 1000;
  localStorage.setItem(
    "login",
    JSON.stringify({
      ...data,
      expirationTime,
    })
  );
};

/**
 * Clear all session data from localStorage
 */
export const clearSession = () => {
  localStorage.removeItem("login");
  localStorage.removeItem("apiKey");
};

/**
 * Check if user is logged in with valid session
 * @returns {boolean}
 */
export const isLoggedIn = () => {
  return getLoginData() !== null;
};

/**
 * Get the admin type from session
 * @returns {'emurpg'|'emucon_manager'|null}
 */
export const getAdminType = () => {
  const loginData = getLoginData();
  return loginData?.adminType || null;
};

/**
 * Create request headers with API key
 * @param {boolean} [includeContentType=true] - Include Content-Type header
 * @returns {object} Headers object for fetch requests
 */
export const getAuthHeaders = (includeContentType = true) => {
  const headers = {};

  if (includeContentType) {
    headers["Content-Type"] = "application/json";
  }

  const apiKey = getApiKey();
  if (apiKey) {
    headers["apiKey"] = apiKey;
  }

  return headers;
};
