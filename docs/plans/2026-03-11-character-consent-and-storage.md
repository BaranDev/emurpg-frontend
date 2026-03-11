# Character Consent & Storage Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a first-time data consent modal before character creation, save consenting users' characters to MongoDB, and expose a secret admin view inside CharRoller showing all saved characters.

**Architecture:** Consent stored in localStorage (`emurpg_charroller_consent`). Characters saved fire-and-forget to a new backend endpoint after creation. If user declines, hard limit of 1 character enforced client-side. Admin view gated behind existing `settings.adminCode` in CharRoller Settings.

**Tech Stack:** FastAPI + MongoDB (backend) | React + Tailwind + lucide-react + react-i18next (frontend)

---

## Key File Paths

**Backend:** `d:/git clones/emurpg-backend/main.py` (all routes in single file)
- Charroller schemas: lines ~2365–2388
- Charroller endpoints end at: line ~3394
- New endpoints insert BEFORE line 3396 (EMUCON ROUTES SETUP comment)
- `charroller_usage_db = client["charroller_usage"]` at line 2359
- `validate_admin_code(code)` at line ~2434
- `get_client_ip(request)` already exists

**Frontend:** `d:/git clones/emurpg-frontend/src/`
- `pages/Charroller/Manager.jsx` — main page, wire consent + save + admin view
- `components/Charroller/` — new components go here
- `utils/characterStorage.js` — add consent helpers
- `locales/en.json` + `locales/tr.json` — add i18n keys
- `config.js` or `config/` — `config.backendUrl` already used in Manager.jsx

---

## Task 1: Backend — Add `SaveCharacterRequest` schema and `POST /api/charroller/save-character`

**Files:**
- Modify: `d:/git clones/emurpg-backend/main.py`

**Step 1: Add schema**

After line 2388 (after `AdminCodeRequest` class), add:

```python
class SaveCharacterRequest(BaseModel):
    character_data: dict
```

**Step 2: Add new MongoDB db reference**

After line 2359 (`charroller_usage_db = client["charroller_usage"]`), add:

```python
charroller_characters_db = client["charroller_characters"]
```

**Step 3: Add endpoint**

Insert before line 3396 (before `# EMUCON ROUTES SETUP #`):

```python
@app.post("/api/charroller/save-character")
async def save_character(request: Request, data: SaveCharacterRequest):
    """Save a character to the database. Called fire-and-forget from frontend."""
    try:
        check_origin(request)
        character = data.character_data.copy()
        character.pop("portrait_url", None)
        character["saved_at"] = datetime.now().isoformat()
        character["client_ip"] = get_client_ip(request)
        charroller_characters_db.characters.insert_one(character)
        return JSONResponse(content={"saved": True})
    except Exception as e:
        print(f"Error saving character: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to save character")
```

**Step 4: Commit**

```bash
cd "d:/git clones/emurpg-backend" && git add main.py && git commit -m "feat: add POST /api/charroller/save-character endpoint"
```

---

## Task 2: Backend — Add `GET /api/admin/charroller/characters`

**Files:**
- Modify: `d:/git clones/emurpg-backend/main.py`

**Step 1: Add endpoint**

Insert after the `save_character` endpoint (still before `# EMUCON ROUTES SETUP #`):

```python
@app.get("/api/admin/charroller/characters")
async def get_saved_characters(request: Request):
    """List all saved characters. Requires admin API key."""
    check_origin(request)
    admin_code = request.headers.get("x-admin-code", "")
    if not validate_admin_code(admin_code):
        raise HTTPException(status_code=401, detail="Unauthorized")
    chars = list(
        charroller_characters_db.characters.find({}, {"_id": 0})
        .sort("saved_at", -1)
        .limit(500)
    )
    return JSONResponse(content={"characters": chars, "total": len(chars)})
```

**Step 2: Commit**

```bash
cd "d:/git clones/emurpg-backend" && git add main.py && git commit -m "feat: add GET /api/admin/charroller/characters endpoint"
```

---

## Task 3: Backend — Add pytest tests

**Files:**
- Create: `d:/git clones/emurpg-backend/tests/test_charroller_storage.py`

**Step 1: Write tests**

```python
"""Regression tests for charroller character storage endpoints."""
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)


def test_save_character_returns_200():
    """Happy path: save a character returns saved=True."""
    response = client.post(
        "/api/charroller/save-character",
        json={"character_data": {"character_name": "Test Hero", "system": "dnd5e", "level": 1}},
    )
    assert response.status_code == 200
    assert response.json()["saved"] is True


def test_save_character_missing_body_returns_422():
    """Missing body returns validation error."""
    response = client.post("/api/charroller/save-character", json={})
    assert response.status_code == 422


def test_get_saved_characters_without_auth_returns_401():
    """Unauthenticated request to admin endpoint returns 401."""
    response = client.get("/api/admin/charroller/characters")
    assert response.status_code == 401


def test_get_saved_characters_with_invalid_key_returns_401():
    """Invalid admin key returns 401."""
    response = client.get(
        "/api/admin/charroller/characters",
        headers={"x-admin-code": "invalid_key_xyz"},
    )
    assert response.status_code == 401
```

**Step 2: Run tests**

```bash
cd "d:/git clones/emurpg-backend" && pytest tests/test_charroller_storage.py -v
```

Expected output:
```
PASSED tests/test_charroller_storage.py::test_save_character_returns_200
PASSED tests/test_charroller_storage.py::test_save_character_missing_body_returns_422
PASSED tests/test_charroller_storage.py::test_get_saved_characters_without_auth_returns_401
PASSED tests/test_charroller_storage.py::test_get_saved_characters_with_invalid_key_returns_401
```

**Step 3: Run full test suite**

```bash
cd "d:/git clones/emurpg-backend" && pytest -v
```

Expected: All tests pass.

**Step 4: Commit**

```bash
cd "d:/git clones/emurpg-backend" && git add tests/test_charroller_storage.py && git commit -m "test: add charroller character storage endpoint tests"
```

---

## Task 4: Frontend — Add consent i18n keys

**Files:**
- Modify: `d:/git clones/emurpg-frontend/src/locales/en.json`
- Modify: `d:/git clones/emurpg-frontend/src/locales/tr.json`

**Step 1: Add to `en.json` inside the `charroller` key**

```json
"consent": {
  "title": "Before you begin",
  "body": "I agree to let my created characters be used to improve this tool. My data will not be shared.",
  "accept": "Accept & Continue",
  "decline": "Decline & Continue",
  "decline_note": "You can still create characters, but you'll be limited to 1.",
  "limit_reached": "You've reached your 1-character limit. Accept data sharing in the consent prompt to create more.",
  "admin_section": "All Saved Characters",
  "admin_loading": "Loading characters...",
  "admin_empty": "No characters saved yet.",
  "admin_total": "{{count}} characters saved",
  "admin_saved_at": "Saved {{date}}"
}
```

**Step 2: Add to `tr.json` inside the `charroller` key**

```json
"consent": {
  "title": "Başlamadan önce",
  "body": "Oluşturduğum karakterlerin bu aracı geliştirmek için kullanılmasına izin veriyorum. Verilerim paylaşılmayacak.",
  "accept": "Kabul Et & Devam",
  "decline": "Reddet & Devam",
  "decline_note": "Karakter oluşturmaya devam edebilirsin, ancak 1 karakterle sınırlı olacaksın.",
  "limit_reached": "1 karakter sınırına ulaştın. Daha fazla karakter oluşturmak için veri paylaşım iznini kabul et.",
  "admin_section": "Kaydedilen Tüm Karakterler",
  "admin_loading": "Karakterler yükleniyor...",
  "admin_empty": "Henüz kaydedilen karakter yok.",
  "admin_total": "{{count}} karakter kaydedildi",
  "admin_saved_at": "{{date}} tarihinde kaydedildi"
}
```

**Step 3: Commit**

```bash
cd "d:/git clones/emurpg-frontend" && git add src/locales/en.json src/locales/tr.json && git commit -m "feat: add consent and admin i18n keys"
```

---

## Task 5: Frontend — Add consent helpers to `characterStorage.js`

**Files:**
- Modify: `d:/git clones/emurpg-frontend/src/utils/characterStorage.js`

**Step 1: Read the file, then add these functions at the end**

```js
// ========================
// CONSENT
// ========================

const CONSENT_KEY = "emurpg_charroller_consent";

export const getConsent = () => localStorage.getItem(CONSENT_KEY); // 'accepted' | 'declined' | null

export const setConsent = (value) => {
  if (value !== "accepted" && value !== "declined") return;
  localStorage.setItem(CONSENT_KEY, value);
};
```

**Step 2: Commit**

```bash
cd "d:/git clones/emurpg-frontend" && git add src/utils/characterStorage.js && git commit -m "feat: add getConsent/setConsent to characterStorage"
```

---

## Task 6: Frontend — Create `DataConsentModal.jsx`

**Files:**
- Create: `d:/git clones/emurpg-frontend/src/components/Charroller/DataConsentModal.jsx`

**Step 1: Write the component**

```jsx
import PropTypes from "prop-types";
import { Shield } from "lucide-react";
import { useTranslation } from "react-i18next";

const TAVERN = {
  overlay: "rgba(10, 6, 3, 0.88)",
  cardBg: "linear-gradient(135deg, rgba(42, 26, 15, 0.99), rgba(61, 40, 23, 0.99))",
  border: "rgba(139, 69, 19, 0.6)",
  accent: "#ffaa33",
  accentGlow: "rgba(255, 170, 51, 0.2)",
  text: "#d4a574",
  textDark: "#8a7060",
  buttonBg: "linear-gradient(135deg, rgba(139, 69, 19, 0.8), rgba(101, 50, 14, 0.8))",
  buttonSecBg: "rgba(20, 12, 6, 0.8)",
};

const DataConsentModal = ({ onAccept, onDecline }) => {
  const { t } = useTranslation();

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ background: TAVERN.overlay, backdropFilter: "blur(6px)" }}
    >
      <div
        className="w-full max-w-sm rounded-2xl p-6 shadow-2xl"
        style={{
          background: TAVERN.cardBg,
          border: `1px solid ${TAVERN.border}`,
          boxShadow: `0 0 60px ${TAVERN.accentGlow}`,
        }}
      >
        {/* Icon + title */}
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: TAVERN.accentGlow, border: `1px solid ${TAVERN.border}` }}
          >
            <Shield className="w-5 h-5" style={{ color: TAVERN.accent }} />
          </div>
          <h2 className="font-cinzel text-base font-bold" style={{ color: TAVERN.text }}>
            {t("charroller.consent.title")}
          </h2>
        </div>

        {/* Body */}
        <p className="text-sm leading-relaxed mb-2" style={{ color: TAVERN.text }}>
          {t("charroller.consent.body")}
        </p>
        <p className="text-xs mb-5" style={{ color: TAVERN.textDark }}>
          {t("charroller.consent.decline_note")}
        </p>

        {/* Buttons */}
        <div className="flex flex-col gap-2">
          <button
            onClick={onAccept}
            className="w-full py-2.5 rounded-lg font-semibold text-sm transition-all hover:brightness-110"
            style={{ background: TAVERN.buttonBg, color: TAVERN.text, border: `1px solid ${TAVERN.border}` }}
          >
            {t("charroller.consent.accept")}
          </button>
          <button
            onClick={onDecline}
            className="w-full py-2.5 rounded-lg font-semibold text-sm transition-all hover:brightness-110"
            style={{ background: TAVERN.buttonSecBg, color: TAVERN.textDark, border: `1px solid rgba(139,69,19,0.3)` }}
          >
            {t("charroller.consent.decline")}
          </button>
        </div>
      </div>
    </div>
  );
};

DataConsentModal.propTypes = {
  onAccept: PropTypes.func.isRequired,
  onDecline: PropTypes.func.isRequired,
};

export default DataConsentModal;
```

**Step 2: Commit**

```bash
cd "d:/git clones/emurpg-frontend" && git add src/components/Charroller/DataConsentModal.jsx && git commit -m "feat: add DataConsentModal component"
```

---

## Task 7: Frontend — Create `AdminCharactersPanel.jsx`

**Files:**
- Create: `d:/git clones/emurpg-frontend/src/components/Charroller/AdminCharactersPanel.jsx`

**Step 1: Write the component**

```jsx
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Users, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { config } from "../../config";

const TAVERN = {
  cardBg: "linear-gradient(135deg, rgba(42, 26, 15, 0.95), rgba(61, 40, 23, 0.95))",
  border: "rgba(139, 69, 19, 0.4)",
  accent: "#ffaa33",
  text: "#d4a574",
  textDark: "#8a7060",
  tagBg: "rgba(139, 69, 19, 0.25)",
};

const SYSTEM_LABELS = {
  dnd5e: "D&D 5E",
  pathfinder2e: "PF2E",
  coc: "CoC",
  fate: "Fate",
};

const AdminCharactersPanel = ({ adminCode }) => {
  const { t } = useTranslation();
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchChars = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${config.backendUrl}/api/admin/charroller/characters`, {
          headers: { "x-admin-code": adminCode },
        });
        if (!res.ok) throw new Error(`${res.status}`);
        const data = await res.json();
        setCharacters(data.characters || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchChars();
  }, [adminCode]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: TAVERN.accent }} />
        <span className="ml-3 text-sm" style={{ color: TAVERN.textDark }}>
          {t("charroller.consent.admin_loading")}
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-16">
        <p className="text-red-400 text-sm">Error: {error}</p>
      </div>
    );
  }

  if (characters.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3">
        <Users className="w-12 h-12 opacity-30" style={{ color: TAVERN.text }} />
        <p className="text-sm" style={{ color: TAVERN.textDark }}>
          {t("charroller.consent.admin_empty")}
        </p>
      </div>
    );
  }

  return (
    <div className="animate-fadeIn">
      {/* Header */}
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-xl font-cinzel font-bold" style={{ color: TAVERN.text }}>
          {t("charroller.consent.admin_section")}
        </h2>
        <span className="text-xs px-2 py-1 rounded-full" style={{ background: TAVERN.tagBg, color: TAVERN.accent }}>
          {t("charroller.consent.admin_total", { count: characters.length })}
        </span>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {characters.map((char, i) => (
          <div
            key={char.character_name + i}
            className="rounded-xl overflow-hidden"
            style={{ background: TAVERN.cardBg, border: `1px solid ${TAVERN.border}` }}
          >
            {/* Portrait */}
            <div className="relative h-32 bg-black/30 flex items-center justify-center overflow-hidden">
              {char.portrait_url ? (
                <img
                  src={char.portrait_url}
                  alt={char.character_name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Users className="w-10 h-10 opacity-20" style={{ color: TAVERN.text }} />
              )}
              {/* System badge */}
              <span
                className="absolute top-2 right-2 px-1.5 py-0.5 text-[10px] font-bold rounded uppercase"
                style={{ background: "rgba(0,0,0,0.7)", color: TAVERN.accent }}
              >
                {SYSTEM_LABELS[char.system] || char.system || "?"}
              </span>
            </div>

            {/* Info */}
            <div className="p-3">
              <p className="font-cinzel text-sm font-bold truncate" style={{ color: TAVERN.text }}>
                {char.character_name || "Unknown"}
              </p>
              <p className="text-xs truncate mt-0.5" style={{ color: TAVERN.textDark }}>
                {char.class || char.occupation || "Adventurer"}
                {char.level ? ` · Lv ${char.level}` : ""}
              </p>
              {char.saved_at && (
                <p className="text-[10px] mt-1.5" style={{ color: TAVERN.textDark }}>
                  {t("charroller.consent.admin_saved_at", {
                    date: new Date(char.saved_at).toLocaleDateString(),
                  })}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

AdminCharactersPanel.propTypes = {
  adminCode: PropTypes.string.isRequired,
};

export default AdminCharactersPanel;
```

**Step 2: Commit**

```bash
cd "d:/git clones/emurpg-frontend" && git add src/components/Charroller/AdminCharactersPanel.jsx && git commit -m "feat: add AdminCharactersPanel component"
```

---

## Task 8: Frontend — Wire everything into `Manager.jsx`

**Files:**
- Modify: `d:/git clones/emurpg-frontend/src/pages/Charroller/Manager.jsx`

**Step 1: Add imports**

Find the existing import block. Add after the PostCreationModal import (line 25):
```js
import DataConsentModal from "../../components/Charroller/DataConsentModal";
import AdminCharactersPanel from "../../components/Charroller/AdminCharactersPanel";
import { getConsent, setConsent } from "../../utils/characterStorage";
```

**Step 2: Add state variables**

After the existing `showPostCreation` state (line 58), add:
```js
const [showConsent, setShowConsent] = useState(false);
const [pendingCreateMode, setPendingCreateMode] = useState(null);
const [showAdminChars, setShowAdminChars] = useState(false);
```

**Step 3: Replace `handleStartCreate` calls with a gated wrapper**

Find the existing `handleStartCreate` function:
```js
  const handleStartCreate = (mode) => {
    setIsCreating(true);
    setCreateMode(mode);
    setSelectedCharacter(null);
    setSelectedFile(null);
    setError(null);
    setMobileSidebarOpen(false);
  };
```
Add a NEW function AFTER it (do not modify the existing one):
```js
  const handleCreateClick = (mode) => {
    const consent = getConsent();
    if (consent === null) {
      setPendingCreateMode(mode);
      setShowConsent(true);
      return;
    }
    if (consent === "declined" && characters.length >= 1) {
      setError(t("charroller.consent.limit_reached"));
      return;
    }
    setShowAdminChars(false);
    handleStartCreate(mode);
  };

  const handleConsentAccept = () => {
    setConsent("accepted");
    setShowConsent(false);
    setShowAdminChars(false);
    handleStartCreate(pendingCreateMode);
    setPendingCreateMode(null);
  };

  const handleConsentDecline = () => {
    setConsent("declined");
    setShowConsent(false);
    if (characters.length >= 1) {
      setError(t("charroller.consent.limit_reached"));
      setPendingCreateMode(null);
      return;
    }
    setShowAdminChars(false);
    handleStartCreate(pendingCreateMode);
    setPendingCreateMode(null);
  };
```

**Step 4: Replace button `onClick` calls in JSX**

There are 4 places where `handleStartCreate` is called from buttons in the JSX (sidebar + empty state). Replace each one:

Find: `onClick={() => handleStartCreate("upload")}` — replace ALL with: `onClick={() => handleCreateClick("upload")}`
Find: `onClick={() => handleStartCreate("describe")}` — replace ALL with: `onClick={() => handleCreateClick("describe")}`

**Step 5: Add fire-and-forget save after PDF processing**

In `handleProcessPDF`, find the block after `setShowPostCreation(true);` (line 175). Add immediately before the `// Generate portrait async` comment:
```js
      // Fire-and-forget character save
      if (getConsent() === "accepted") {
        fetch(`${config.backendUrl}/api/charroller/save-character`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ character_data: { ...data, system: selectedSystem } }),
        }).catch(() => {});
      }
```

**Step 6: Same fire-and-forget save after AI generation**

In `handleGenerateCharacter`, find the block after `setShowPostCreation(true);` (line 251). Add the same fire-and-forget block before the portrait generation code:
```js
      // Fire-and-forget character save
      if (getConsent() === "accepted") {
        fetch(`${config.backendUrl}/api/charroller/save-character`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ character_data: { ...data, system: selectedSystem } }),
        }).catch(() => {});
      }
```

**Step 7: Add "All Saved Characters" button to sidebar footer**

Find the sidebar footer settings button block:
```jsx
              <div
                className="p-3"
                style={{ borderTop: "1px solid rgba(139, 69, 19, 0.3)" }}
              >
                <button
                  onClick={() => setShowSettings(true)}
```
Replace with:
```jsx
              <div
                className="p-3 space-y-1"
                style={{ borderTop: "1px solid rgba(139, 69, 19, 0.3)" }}
              >
                {settings.adminCode && (
                  <button
                    onClick={() => {
                      setShowAdminChars(true);
                      setSelectedCharacter(null);
                      setIsCreating(false);
                      setMobileSidebarOpen(false);
                    }}
                    className={`w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${showAdminChars ? "text-amber-300" : "text-tavern-parchmentDark hover:text-tavern-parchment"} hover:bg-tavern-wood/30`}
                  >
                    <Users className="w-4 h-4" />
                    {t("charroller.consent.admin_section")}
                  </button>
                )}
                <button
                  onClick={() => setShowSettings(true)}
```
And close the div properly (the original closing `</div>` stays).

**Step 8: Add admin panel to main content area**

Find the main content section that shows `{selectedCharacter && !isCreating && ...}`. After the `LevelUpChoices` block but before the empty state block, add:

Actually, find the block:
```jsx
            {/* Selected Character */}
            {selectedCharacter && !isCreating && (
```

Add BEFORE it:
```jsx
            {/* Admin: All Saved Characters */}
            {showAdminChars && !isCreating && settings.adminCode && (
              <AdminCharactersPanel adminCode={settings.adminCode} />
            )}
```

**Step 9: Update the empty state condition**

Find:
```jsx
            {!selectedCharacter && !isCreating && (
```
Replace with:
```jsx
            {!selectedCharacter && !isCreating && !showAdminChars && (
```

**Step 10: Add DataConsentModal render**

Find the `{showFeedback && ...}` modal block near the end of the JSX return. Add BEFORE it:
```jsx
      {showConsent && (
        <DataConsentModal
          onAccept={handleConsentAccept}
          onDecline={handleConsentDecline}
        />
      )}
```

**Step 11: Commit**

```bash
cd "d:/git clones/emurpg-frontend" && git add src/pages/Charroller/Manager.jsx && git commit -m "feat: wire consent modal, character save, and admin panel into Manager"
```

---

## Task 9: Frontend — Export new components from Charroller index

**Files:**
- Modify: `d:/git clones/emurpg-frontend/src/components/Charroller/index.jsx`

**Step 1: Add exports**

```js
export { default as DataConsentModal } from "./DataConsentModal";
export { default as AdminCharactersPanel } from "./AdminCharactersPanel";
```

**Step 2: Commit**

```bash
cd "d:/git clones/emurpg-frontend" && git add src/components/Charroller/index.jsx && git commit -m "chore: export DataConsentModal and AdminCharactersPanel"
```

---

## Task 10: Final verification

**Step 1: Run backend tests**
```bash
cd "d:/git clones/emurpg-backend" && pytest -v
```
Expected: All tests pass.

**Step 2: Run frontend lint**
```bash
cd "d:/git clones/emurpg-frontend" && npm run lint
```
Expected: 0 errors.

**Step 3: Run frontend tests**
```bash
cd "d:/git clones/emurpg-frontend" && npm run test
```
Expected: All 33 tests pass.

**Step 4: Push both repos**
```bash
cd "d:/git clones/emurpg-backend" && git push origin main
cd "d:/git clones/emurpg-frontend" && git push origin main
```

**Step 5: Manual smoke test checklist**
- [ ] First click of "Create with AI" → DataConsentModal appears
- [ ] Click "Accept & Continue" → consent saved to localStorage, character creation starts
- [ ] New character is created → POST to `/api/charroller/save-character` fires (check network tab)
- [ ] Reload page → no consent modal shown again
- [ ] Clear localStorage, click create → consent appears again
- [ ] Click "Decline & Continue" with 0 characters → creation proceeds, limit of 1 enforced
- [ ] With `declined` consent and 1 character: click create → error message appears (no modal)
- [ ] In CharRoller Settings, enter valid admin code → "All Saved Characters" button appears in sidebar
- [ ] Click "All Saved Characters" → AdminCharactersPanel loads, shows saved characters
- [ ] Characters show portrait (from R2 URL), name, class, level, system, saved date
- [ ] `/api/admin/charroller/characters` without header → 401
- [ ] Switch language to TR → all consent/admin strings update
