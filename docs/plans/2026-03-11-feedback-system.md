# Feedback System Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a Web3Forms-powered feedback system to the Charroller — a post-creation announcement modal (5s countdown) and a persistent floating/navbar feedback button that opens a form modal.

**Architecture:** Two new components (`PostCreationModal`, `FeedbackModal`) wired into `Manager.jsx`. Feedback button lives in `CharrollerNavbar` on mobile (icon in right group) and as a fixed floating button on desktop. Web3Forms handles email delivery via a single env var.

**Tech Stack:** React + Lucide icons + Tailwind + inline styles (tavern theme) + Web3Forms free API

---

## Pre-requisites

Before implementing, the user must:
1. Visit https://web3forms.com
2. Enter `emufrpclub@gmail.com` and click "Create Access Key"
3. Copy the key and add to `d:/git clones/emurpg-frontend/.env`:
   ```
   VITE_WEB3FORMS_KEY=your_key_here
   ```

---

### Task 1: Add i18n translations

**Files:**
- Modify: `src/locales/en.json`
- Modify: `src/locales/tr.json`

**Step 1: Add `feedback` key to en.json**

Find the last key in the `charroller` section and add after it:

```json
"feedback": {
  "button_label": "Feedback",
  "modal_title": "Share Your Thoughts",
  "name_placeholder": "Your name (optional)",
  "message_placeholder": "What do you think? Any suggestions?",
  "submit": "Send",
  "sending": "Sending...",
  "success_title": "Thank you!",
  "success_body": "Your feedback means a lot.",
  "error": "Something went wrong. Please try again.",
  "post_creation_title": "Your character is ready!",
  "post_creation_body": "Take a look — then I'd love to hear what you think.",
  "post_creation_cta": "Give Feedback",
  "closing_in": "Closing in {{count}}s"
}
```

**Step 2: Add `feedback` key to tr.json**

Same location in the `charroller` section:

```json
"feedback": {
  "button_label": "Geri Bildirim",
  "modal_title": "Düşüncelerini Paylaş",
  "name_placeholder": "Adın (isteğe bağlı)",
  "message_placeholder": "Ne düşünüyorsun? Önerilerin var mı?",
  "submit": "Gönder",
  "sending": "Gönderiliyor...",
  "success_title": "Teşekkürler!",
  "success_body": "Geri bildiriminiz çok değerli.",
  "error": "Bir şeyler ters gitti. Lütfen tekrar dene.",
  "post_creation_title": "Karakterin hazır!",
  "post_creation_body": "Bir göz at — sonra ne düşündüğünü duymak isterim.",
  "post_creation_cta": "Geri Bildirim Ver",
  "closing_in": "{{count}}s içinde kapanıyor"
}
```

**Step 3: Commit**

```bash
git add src/locales/en.json src/locales/tr.json
git commit -m "feat: add feedback i18n keys (en + tr)"
```

---

### Task 2: Create FeedbackModal component

**Files:**
- Create: `src/components/Charroller/FeedbackModal.jsx`

**Step 1: Write the component**

```jsx
import { useState } from "react";
import { X, Send, MessageSquare, CheckCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

const TAVERN = {
  overlay: "rgba(10, 6, 3, 0.85)",
  cardBg: "linear-gradient(135deg, rgba(42, 26, 15, 0.98), rgba(61, 40, 23, 0.98))",
  border: "rgba(139, 69, 19, 0.6)",
  accent: "#ffaa33",
  accentGlow: "rgba(255, 170, 51, 0.25)",
  text: "#d4a574",
  textDark: "#8a7060",
  inputBg: "rgba(20, 12, 6, 0.7)",
  buttonBg: "linear-gradient(135deg, rgba(139, 69, 19, 0.8), rgba(101, 50, 14, 0.8))",
};

const FeedbackModal = ({ onClose }) => {
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("idle"); // "idle" | "sending" | "success" | "error"

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    setStatus("sending");

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: import.meta.env.VITE_WEB3FORMS_KEY,
          subject: "Charroller Feedback",
          from_name: name.trim() || "Anonymous",
          message: message.trim(),
        }),
      });
      const data = await res.json();
      setStatus(data.success ? "success" : "error");
    } catch {
      setStatus("error");
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ background: TAVERN.overlay, backdropFilter: "blur(4px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="relative w-full max-w-md rounded-2xl p-6 shadow-2xl"
        style={{ background: TAVERN.cardBg, border: `1px solid ${TAVERN.border}`, boxShadow: `0 0 40px ${TAVERN.accentGlow}` }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg transition-colors hover:bg-white/10"
          style={{ color: TAVERN.textDark }}
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: TAVERN.accentGlow, border: `1px solid ${TAVERN.border}` }}
          >
            <MessageSquare className="w-5 h-5" style={{ color: TAVERN.accent }} />
          </div>
          <h2 className="font-cinzel text-lg font-bold" style={{ color: TAVERN.text }}>
            {t("charroller.feedback.modal_title")}
          </h2>
        </div>

        {status === "success" ? (
          <div className="flex flex-col items-center py-6 gap-3">
            <CheckCircle className="w-12 h-12" style={{ color: TAVERN.accent }} />
            <p className="font-cinzel text-base font-bold" style={{ color: TAVERN.text }}>
              {t("charroller.feedback.success_title")}
            </p>
            <p className="text-sm" style={{ color: TAVERN.textDark }}>
              {t("charroller.feedback.success_body")}
            </p>
            <button
              onClick={onClose}
              className="mt-2 px-5 py-2 rounded-lg font-semibold text-sm transition-all hover:brightness-110"
              style={{ background: TAVERN.buttonBg, color: TAVERN.text, border: `1px solid ${TAVERN.border}` }}
            >
              {t("common.close")}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("charroller.feedback.name_placeholder")}
              maxLength={60}
              className="w-full rounded-lg px-3 py-2.5 text-sm outline-none transition-all"
              style={{
                background: TAVERN.inputBg,
                border: `1px solid ${TAVERN.border}`,
                color: TAVERN.text,
              }}
            />
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={t("charroller.feedback.message_placeholder")}
              required
              rows={4}
              maxLength={1000}
              className="w-full rounded-lg px-3 py-2.5 text-sm outline-none resize-none transition-all"
              style={{
                background: TAVERN.inputBg,
                border: `1px solid ${TAVERN.border}`,
                color: TAVERN.text,
              }}
            />
            {status === "error" && (
              <p className="text-red-400 text-xs">{t("charroller.feedback.error")}</p>
            )}
            <button
              type="submit"
              disabled={status === "sending" || !message.trim()}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg font-semibold text-sm transition-all hover:brightness-110 disabled:opacity-50"
              style={{ background: TAVERN.buttonBg, color: TAVERN.text, border: `1px solid ${TAVERN.border}` }}
            >
              <Send className="w-4 h-4" />
              {status === "sending" ? t("charroller.feedback.sending") : t("charroller.feedback.submit")}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default FeedbackModal;
```

**Step 2: Commit**

```bash
git add src/components/Charroller/FeedbackModal.jsx
git commit -m "feat: add FeedbackModal component (Web3Forms)"
```

---

### Task 3: Create PostCreationModal component

**Files:**
- Create: `src/components/Charroller/PostCreationModal.jsx`

**Step 1: Write the component**

```jsx
import { useEffect, useState } from "react";
import { Scroll, MessageSquare } from "lucide-react";
import { useTranslation } from "react-i18next";

const COUNTDOWN_SECONDS = 5;

const TAVERN = {
  overlay: "rgba(10, 6, 3, 0.88)",
  cardBg: "linear-gradient(135deg, rgba(42, 26, 15, 0.99), rgba(61, 40, 23, 0.99))",
  border: "rgba(139, 69, 19, 0.6)",
  accent: "#ffaa33",
  accentGlow: "rgba(255, 170, 51, 0.2)",
  text: "#d4a574",
  textDark: "#8a7060",
  buttonBg: "linear-gradient(135deg, rgba(139, 69, 19, 0.8), rgba(101, 50, 14, 0.8))",
};

const PostCreationModal = ({ onClose, onFeedbackOpen }) => {
  const { t } = useTranslation();
  const [remaining, setRemaining] = useState(COUNTDOWN_SECONDS);
  const [canClose, setCanClose] = useState(false);

  useEffect(() => {
    if (remaining <= 0) {
      setCanClose(true);
      // Auto-close after countdown reaches 0
      const timer = setTimeout(onClose, 400);
      return () => clearTimeout(timer);
    }
    const tick = setTimeout(() => setRemaining((r) => r - 1), 1000);
    return () => clearTimeout(tick);
  }, [remaining, onClose]);

  const progress = ((COUNTDOWN_SECONDS - remaining) / COUNTDOWN_SECONDS) * 100;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ background: TAVERN.overlay, backdropFilter: "blur(6px)" }}
    >
      <div
        className="relative w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl"
        style={{ background: TAVERN.cardBg, border: `1px solid ${TAVERN.border}`, boxShadow: `0 0 60px ${TAVERN.accentGlow}` }}
      >
        {/* Countdown bar — fills from left */}
        <div className="absolute top-0 left-0 right-0 h-1" style={{ background: "rgba(139, 69, 19, 0.3)" }}>
          <div
            className="h-full transition-all duration-1000 ease-linear"
            style={{ width: `${progress}%`, background: TAVERN.accent, boxShadow: `0 0 8px ${TAVERN.accent}` }}
          />
        </div>

        <div className="p-7 pt-8 flex flex-col items-center text-center gap-4">
          {/* Icon */}
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center"
            style={{ background: TAVERN.accentGlow, border: `1px solid ${TAVERN.border}` }}
          >
            <Scroll className="w-8 h-8" style={{ color: TAVERN.accent }} />
          </div>

          {/* Title */}
          <h2 className="font-cinzel text-xl font-bold" style={{ color: TAVERN.text }}>
            {t("charroller.feedback.post_creation_title")}
          </h2>

          {/* Body */}
          <p className="text-sm leading-relaxed" style={{ color: TAVERN.textDark }}>
            {t("charroller.feedback.post_creation_body")}
          </p>

          {/* Countdown label */}
          <p className="text-xs font-mono" style={{ color: TAVERN.textDark }}>
            {t("charroller.feedback.closing_in", { count: remaining })}
          </p>

          {/* CTA — only enabled after countdown */}
          <button
            onClick={() => { onClose(); onFeedbackOpen(); }}
            disabled={!canClose}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm transition-all hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: TAVERN.buttonBg, color: TAVERN.text, border: `1px solid ${TAVERN.border}` }}
          >
            <MessageSquare className="w-4 h-4" />
            {t("charroller.feedback.post_creation_cta")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostCreationModal;
```

**Step 2: Commit**

```bash
git add src/components/Charroller/PostCreationModal.jsx
git commit -m "feat: add PostCreationModal with 5s countdown"
```

---

### Task 4: Add feedback icon to CharrollerNavbar (mobile)

**Files:**
- Modify: `src/components/Charroller/CharrollerNavbar.jsx`

**Step 1: Add `MessageSquare` to the Lucide import**

Find:
```js
import { ArrowLeft, Settings, Globe } from "lucide-react";
```
Replace with:
```js
import { ArrowLeft, Settings, Globe, MessageSquare } from "lucide-react";
```

**Step 2: Add `onFeedbackOpen` prop to the component signature**

Find:
```js
const CharrollerNavbar = ({ onLanguageSwitch, onSettingsOpen }) => {
```
Replace with:
```js
const CharrollerNavbar = ({ onLanguageSwitch, onSettingsOpen, onFeedbackOpen }) => {
```

**Step 3: Add feedback button in the right group — mobile only, before language**

Find:
```jsx
{/* Language */}
<button
  onClick={handleLanguageToggle}
```
Insert before it:
```jsx
{/* Feedback — mobile only */}
{onFeedbackOpen && (
  <button
    onClick={onFeedbackOpen}
    className="md:hidden p-2 rounded-lg transition-colors duration-300 hover:text-amber-300"
    style={{ color: "#8a7060" }}
    title="Feedback"
  >
    <MessageSquare className="w-5 h-5" />
  </button>
)}
```

**Step 4: Update PropTypes**

Find:
```js
CharrollerNavbar.propTypes = {
  onLanguageSwitch: PropTypes.func,
  onSettingsOpen: PropTypes.func,
};
```
Replace with:
```js
CharrollerNavbar.propTypes = {
  onLanguageSwitch: PropTypes.func,
  onSettingsOpen: PropTypes.func,
  onFeedbackOpen: PropTypes.func,
};
```

**Step 5: Commit**

```bash
git add src/components/Charroller/CharrollerNavbar.jsx
git commit -m "feat: add mobile feedback icon to CharrollerNavbar"
```

---

### Task 5: Wire feedback system into Manager.jsx

**Files:**
- Modify: `src/pages/Charroller/Manager.jsx`

**Step 1: Import new components and MessageSquare icon**

Find the existing import block at the top and add:
```js
import { MessageSquare } from "lucide-react";
import FeedbackModal from "../../components/Charroller/FeedbackModal";
import PostCreationModal from "../../components/Charroller/PostCreationModal";
```

**Step 2: Add state variables**

Find:
```js
const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
```
Add after it:
```js
const [showFeedback, setShowFeedback] = useState(false);
const [showPostCreation, setShowPostCreation] = useState(false);
```

**Step 3: Trigger PostCreationModal after PDF processing**

In `handleProcessPDF`, find:
```js
setSelectedCharacter(newChar);
setIsCreating(false);
setCreateMode(null);
setRefreshKey((k) => k + 1);
setIsLoading(false);
```
Add `setShowPostCreation(true);` after `setIsLoading(false);`:
```js
setSelectedCharacter(newChar);
setIsCreating(false);
setCreateMode(null);
setRefreshKey((k) => k + 1);
setIsLoading(false);
setShowPostCreation(true);
```

**Step 4: Trigger PostCreationModal after AI generation**

In `handleGenerateCharacter`, find the same block (identical lines):
```js
setSelectedCharacter(newChar);
setIsCreating(false);
setCreateMode(null);
setRefreshKey((k) => k + 1);
setIsLoading(false);
```
Add `setShowPostCreation(true);` after `setIsLoading(false);`:
```js
setSelectedCharacter(newChar);
setIsCreating(false);
setCreateMode(null);
setRefreshKey((k) => k + 1);
setIsLoading(false);
setShowPostCreation(true);
```

**Step 5: Pass `onFeedbackOpen` to CharrollerNavbar**

Find:
```jsx
<CharrollerNavbar
  onLanguageSwitch={onLanguageSwitch}
  onSettingsOpen={() => setShowSettings(true)}
/>
```
Replace with:
```jsx
<CharrollerNavbar
  onLanguageSwitch={onLanguageSwitch}
  onSettingsOpen={() => setShowSettings(true)}
  onFeedbackOpen={() => setShowFeedback(true)}
/>
```

**Step 6: Add floating feedback button (desktop only)**

Find the music player div:
```jsx
{/* Music Player — desktop only (mobile uses navbar play button) */}
<div className="hidden md:block fixed bottom-4 right-4 z-30">
  <TavernPlayer autoPlay />
</div>
```
Add the floating button just before it:
```jsx
{/* Floating feedback button — desktop only */}
<button
  onClick={() => setShowFeedback(true)}
  className="hidden md:flex fixed bottom-24 right-4 z-30 items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 hover:brightness-110 hover:scale-105 shadow-lg"
  style={{
    background: "linear-gradient(135deg, rgba(42, 26, 15, 0.95), rgba(61, 40, 23, 0.95))",
    border: "1px solid rgba(139, 69, 19, 0.6)",
    color: "#d4a574",
    boxShadow: "0 4px 20px rgba(80, 40, 10, 0.4)",
  }}
>
  <MessageSquare className="w-4 h-4" style={{ color: "#ffaa33" }} />
  <span>{t("charroller.feedback.button_label")}</span>
</button>
```

**Step 7: Render modals at the bottom of the JSX**

Find the closing `</>` of the component return, just before it find the last modal (LevelUpChoices):
```jsx
      {levelUpChoices && (
        <LevelUpChoices ... />
      )}
    </>
```
Add after `LevelUpChoices`:
```jsx
      {showFeedback && (
        <FeedbackModal onClose={() => setShowFeedback(false)} />
      )}

      {showPostCreation && (
        <PostCreationModal
          onClose={() => setShowPostCreation(false)}
          onFeedbackOpen={() => setShowFeedback(true)}
        />
      )}
```

**Step 8: Commit**

```bash
git add src/pages/Charroller/Manager.jsx
git commit -m "feat: wire feedback modals and floating button into Manager"
```

---

### Task 6: Export new components from index

**Files:**
- Modify: `src/components/Charroller/index.jsx`

**Step 1: Add exports**

Open the file and add:
```js
export { default as FeedbackModal } from "./FeedbackModal";
export { default as PostCreationModal } from "./PostCreationModal";
```

**Step 2: Commit**

```bash
git add src/components/Charroller/index.jsx
git commit -m "chore: export FeedbackModal and PostCreationModal from Charroller index"
```

---

### Task 7: Final verification

**Step 1: Run linter**
```bash
cd "d:/git clones/emurpg-frontend" && npm run lint
```
Expected: No errors.

**Step 2: Run tests**
```bash
npm run test
```
Expected: All existing tests pass (no new tests needed — UI-only feature with no logic to unit test).

**Step 3: Manual smoke test checklist**
- [ ] Start dev server: `npm run dev`
- [ ] Go to `/charroller/manager`
- [ ] Desktop: floating "Feedback" button visible bottom-right above music player
- [ ] Mobile (resize browser): floating button hidden, feedback icon visible in navbar
- [ ] Click feedback button → FeedbackModal opens in tavern style
- [ ] Submit without message → blocked (required field)
- [ ] Submit with message → success state shown (check emufrpclub@gmail.com inbox)
- [ ] Create a character (via AI or PDF) → PostCreationModal appears immediately
- [ ] Countdown bar fills over 5 seconds, modal auto-closes
- [ ] "Give Feedback" button disabled during countdown, enabled after
- [ ] Click "Give Feedback" → PostCreationModal closes, FeedbackModal opens
- [ ] Switch language to TR → all text updates correctly

**Step 4: Push to main**
```bash
git push origin main
```
