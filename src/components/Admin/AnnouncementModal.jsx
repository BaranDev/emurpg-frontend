import { useRef, useState, useCallback, useLayoutEffect } from "react";
import PropTypes from "prop-types";
import { toPng } from "html-to-image";
import { Download, Image as ImageIcon, Trash2, Upload, X } from "lucide-react";
import AdminModal from "./shared/AdminModal";
import AdminButton from "./shared/AdminButton";
import AnnouncementCard, { THEMES, DEFAULT_OPTIONS } from "./AnnouncementCard";
import { config } from "../../config";
import { getApiKey } from "../../utils/auth";

// The card is 1080 px wide. Scale it to fit comfortably inside the modal.
const CARD_WIDTH = 1080;
const PREVIEW_WIDTH = 680;
const PREVIEW_SCALE = PREVIEW_WIDTH / CARD_WIDTH;

// Ordered list of themes for the selector row
const THEME_LIST = Object.values(THEMES);

// Colour keys exposed to the picker panel — in visual importance order
const COLOR_KEYS = [
  { key: "accent", label: "Accent", hint: "Title · rules · ornaments" },
  { key: "badgeBg", label: "Badge", hint: "Event type badge" },
  { key: "tableTopBar", label: "Table Bar", hint: "Stripe on table cards" },
  { key: "textLight", label: "Text", hint: "Primary text" },
  { key: "headerBg", label: "Header", hint: "Header & footer band" },
];

// Convert an image File to a WebP Blob (quality 0.88) via canvas before upload.
// Falls back to the original file if the browser cannot encode WebP.
function convertToWebP(file) {
  return new Promise((resolve) => {
    const img = new Image();
    const src = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(src);
      try {
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        canvas.getContext("2d").drawImage(img, 0, 0);
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              resolve(file);
              return;
            }
            resolve(
              new File([blob], file.name.replace(/\.[^.]+$/, ".webp"), {
                type: "image/webp",
              }),
            );
          },
          "image/webp",
          0.88,
        );
      } catch {
        resolve(file);
      }
    };
    img.onerror = () => {
      URL.revokeObjectURL(src);
      resolve(file);
    };
    img.src = src;
  });
}

// Convert any CSS colour string (hex or rgba) to a #rrggbb hex string
// so it can be used as the value of <input type="color">.
function toHex(color) {
  if (!color) return "#ffffff";
  if (color.startsWith("#")) return color.slice(0, 7);
  const m = color.match(/rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);
  if (!m) return "#000000";
  return (
    "#" +
    [m[1], m[2], m[3]]
      .map((n) => parseInt(n, 10).toString(16).padStart(2, "0"))
      .join("")
  );
}

const AnnouncementModal = ({ event, isOpen, onClose }) => {
  const exportRef = useRef(null);
  const previewWrapperRef = useRef(null);
  const previewContainerRef = useRef(null);
  const bgFileRef = useRef(null);

  const [exporting, setExporting] = useState(false);
  const [customBg, setCustomBg] = useState(null);
  const [bgPickerOpen, setBgPickerOpen] = useState(false);
  const [savedBgs, setSavedBgs] = useState([]);
  const [bgLoading, setBgLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [theme, setTheme] = useState("shadow");
  const [colorOverrides, setColorOverrides] = useState({});
  const [cardOptions, setCardOptions] = useState({ ...DEFAULT_OPTIONS });

  const patchOption = (key, val) =>
    setCardOptions((prev) => ({ ...prev, [key]: val }));

  const backendUrl = config.backendUrl;
  const apiKey = getApiKey();

  // Keep the preview container height in sync with the scaled card
  useLayoutEffect(() => {
    const wrapper = previewWrapperRef.current;
    const container = previewContainerRef.current;
    if (!wrapper || !container) return;
    const sync = () => {
      container.style.height = `${wrapper.offsetHeight * PREVIEW_SCALE}px`;
    };
    sync();
    const observer = new ResizeObserver(sync);
    observer.observe(wrapper);
    return () => observer.disconnect();
  });

  const handleDownload = useCallback(async () => {
    if (!exportRef.current) return;
    setExporting(true);
    try {
      const dataUrl = await toPng(exportRef.current, {
        pixelRatio: 2,
        cacheBust: true,
      });
      const link = document.createElement("a");
      const slug =
        event.slug ||
        event.name
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, "");
      link.download = `${slug}_announcement.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Failed to export announcement:", err);
      alert("Failed to generate image. Check the console for details.");
    } finally {
      setExporting(false);
    }
  }, [event]);

  const fetchSavedBgs = useCallback(async () => {
    setBgLoading(true);
    try {
      const res = await fetch(
        `${backendUrl}/api/admin/announcement-backgrounds`,
        { headers: { apiKey } },
      );
      if (res.ok) setSavedBgs(await res.json());
    } catch (err) {
      console.error("Failed to fetch saved backgrounds:", err);
    } finally {
      setBgLoading(false);
    }
  }, [backendUrl, apiKey]);

  const handleOpenPicker = () => {
    setBgPickerOpen(true);
    fetchSavedBgs();
  };

  const handleBgFileChange = async (e) => {
    const raw = e.target.files?.[0];
    if (!raw) return;
    if (raw.size > 15 * 1024 * 1024) {
      alert("File is too large. Maximum size is 15 MB.");
      if (bgFileRef.current) bgFileRef.current.value = "";
      return;
    }
    setUploading(true);
    try {
      const file = await convertToWebP(raw);
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch(
        `${backendUrl}/api/admin/announcement-backgrounds/upload`,
        { method: "POST", headers: { apiKey }, body: fd },
      );
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.detail || "Upload failed");
      }
      const { url } = await res.json();
      setCustomBg(url);
      setSavedBgs((prev) => [{ url, original_filename: raw.name }, ...prev]);
      setBgPickerOpen(false);
    } catch (err) {
      alert(`Background upload failed: ${err.message}`);
    } finally {
      setUploading(false);
      if (bgFileRef.current) bgFileRef.current.value = "";
    }
  };

  const handleDeleteBg = useCallback(
    async (bgUrl, e) => {
      e.stopPropagation();
      if (
        !window.confirm("Delete this background image? This cannot be undone.")
      )
        return;
      try {
        const res = await fetch(
          `${backendUrl}/api/admin/announcement-backgrounds?url=${encodeURIComponent(bgUrl)}`,
          { method: "DELETE", headers: { apiKey } },
        );
        if (!res.ok) {
          const d = await res.json().catch(() => ({}));
          throw new Error(d.detail || "Delete failed");
        }
        setSavedBgs((prev) => prev.filter((b) => b.url !== bgUrl));
        if (customBg === bgUrl) setCustomBg(null);
      } catch (err) {
        alert(`Failed to delete background: ${err.message}`);
      }
    },
    [backendUrl, apiKey, customBg],
  );

  if (!isOpen || !event) return null;

  return (
    <>
      {/* Hidden full-size card — html-to-image capture target */}
      <div
        style={{
          position: "fixed",
          left: -9999,
          top: 0,
          zIndex: -1,
          pointerEvents: "none",
        }}
        aria-hidden="true"
      >
        <AnnouncementCard
          ref={exportRef}
          event={event}
          bgUrl={customBg}
          theme={theme}
          colorOverrides={colorOverrides}
        />
      </div>

      <AdminModal
        isOpen={isOpen}
        onClose={onClose}
        title="Announcement Preview"
        size="xl"
      >
        {/* Scaled live preview */}
        <div
          ref={previewContainerRef}
          style={{
            width: PREVIEW_WIDTH,
            overflow: "hidden",
            margin: "0 auto 20px",
            borderRadius: 8,
            border: "1px solid rgba(245,196,50,0.18)",
          }}
        >
          <div
            ref={previewWrapperRef}
            style={{
              width: CARD_WIDTH,
              transformOrigin: "top left",
              transform: `scale(${PREVIEW_SCALE})`,
            }}
          >
            <AnnouncementCard
              event={event}
              bgUrl={customBg}
              theme={theme}
              colorOverrides={colorOverrides}
              cardOptions={cardOptions}
            />
          </div>
        </div>

        {/* ── Theme + colour customisation panel ── */}
        {(() => {
          const activeThemeColors = THEMES[theme] ?? THEMES.shadow;
          const hasOverrides = Object.keys(colorOverrides).length > 0;

          return (
            <div className="mb-4 rounded-xl border border-gray-700 bg-gray-800/40 p-3 space-y-3">
              {/* Row 1 — theme presets */}
              <div>
                <p className="text-xs text-gray-400 mb-2 font-medium tracking-wide uppercase">
                  Overlay Theme
                </p>
                <div className="flex gap-2 flex-wrap">
                  {THEME_LIST.map((t) => {
                    const active = theme === t.id;
                    return (
                      <button
                        key={t.id}
                        onClick={() => {
                          setTheme(t.id);
                          setColorOverrides({});
                        }}
                        title={t.label}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all duration-150 ${
                          active
                            ? "border-transparent text-gray-900"
                            : "border-gray-600 bg-gray-800 text-gray-300 hover:border-gray-500 hover:text-white"
                        }`}
                        style={
                          active
                            ? { background: t.swatch, borderColor: t.swatch }
                            : {}
                        }
                      >
                        <span
                          className="w-2.5 h-2.5 rounded-full flex-shrink-0 border border-white/20"
                          style={{ background: t.swatch }}
                        />
                        {t.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-gray-700/60" />

              {/* Row 2 — per-colour pickers */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs text-gray-400 font-medium tracking-wide uppercase">
                    Colours
                  </p>
                  {hasOverrides && (
                    <button
                      onClick={() => setColorOverrides({})}
                      className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
                    >
                      ↩ Reset to theme
                    </button>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  {COLOR_KEYS.map(({ key, label, hint }) => {
                    const defaultColor = activeThemeColors[key] ?? "#ffffff";
                    const current = colorOverrides[key] ?? defaultColor;
                    const hexVal = toHex(current);
                    const isOverridden = !!colorOverrides[key];

                    return (
                      <label
                        key={key}
                        title={hint}
                        className="flex flex-col gap-1 cursor-pointer group"
                      >
                        <span
                          className={`text-xs ${isOverridden ? "text-yellow-400" : "text-gray-500"} transition-colors`}
                        >
                          {label}
                        </span>

                        {/* Visible swatch + hex — wraps the hidden input */}
                        <span
                          className={`flex items-center gap-1.5 px-2 py-1 rounded-lg border transition-all duration-150 bg-gray-900/60 group-hover:border-gray-400 ${
                            isOverridden
                              ? "border-yellow-500/60"
                              : "border-gray-600"
                          }`}
                        >
                          {/* Colour swatch */}
                          <span
                            className="w-4 h-4 rounded-sm flex-shrink-0 border border-white/10"
                            style={{ background: current }}
                          />
                          {/* Hex value */}
                          <span className="text-xs font-mono text-gray-300 leading-none">
                            {hexVal}
                          </span>
                        </span>

                        {/* Native colour picker — invisible but clickable via the label */}
                        <input
                          type="color"
                          value={hexVal}
                          onChange={(e) =>
                            setColorOverrides((prev) => ({
                              ...prev,
                              [key]: e.target.value,
                            }))
                          }
                          className="sr-only"
                        />
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })()}

        {/* ── Layout & Content panel ── */}
        <div className="mb-4 rounded-xl border border-gray-700 bg-gray-800/40 p-3 space-y-3">

          {/* Row 1: columns + font size */}
          <div className="grid grid-cols-2 gap-4">

            {/* Tables per row */}
            <div>
              <p className="text-xs text-gray-400 mb-2 font-medium tracking-wide uppercase">
                Tables per row
              </p>
              <div className="flex gap-1.5">
                {[1, 2, 3].map((n) => (
                  <button
                    key={n}
                    onClick={() => patchOption("tablesPerRow", n)}
                    className={`flex-1 py-1.5 rounded-lg border text-xs font-medium transition-all duration-150 ${
                      cardOptions.tablesPerRow === n
                        ? "bg-yellow-500 border-yellow-400 text-gray-900"
                        : "border-gray-600 bg-gray-800 text-gray-300 hover:border-gray-500 hover:text-white"
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>

            {/* Font size */}
            <div>
              <p className="text-xs text-gray-400 mb-2 font-medium tracking-wide uppercase">
                Table font size
              </p>
              <div className="flex gap-1.5">
                {[
                  { label: "S", value: 0.82, title: "Small" },
                  { label: "M", value: 1.0,  title: "Normal" },
                  { label: "L", value: 1.25, title: "Large" },
                ].map(({ label, value, title }) => (
                  <button
                    key={value}
                    onClick={() => patchOption("tableFontScale", value)}
                    title={title}
                    className={`flex-1 py-1.5 rounded-lg border text-xs font-medium transition-all duration-150 ${
                      cardOptions.tableFontScale === value
                        ? "bg-yellow-500 border-yellow-400 text-gray-900"
                        : "border-gray-600 bg-gray-800 text-gray-300 hover:border-gray-500 hover:text-white"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="border-t border-gray-700/60" />

          {/* Row 2: toggles */}
          <div className="flex flex-wrap gap-3">
            {[
              { key: "showVenue",  label: "Venue in header" },
              { key: "showBackup", label: "Backup players" },
            ].map(({ key, label }) => {
              const on = cardOptions[key];
              return (
                <button
                  key={key}
                  onClick={() => patchOption(key, !on)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all duration-150 ${
                    on
                      ? "bg-green-900/50 border-green-600 text-green-300"
                      : "bg-gray-800 border-gray-600 text-gray-500 hover:text-gray-300"
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${on ? "bg-green-400" : "bg-gray-600"}`} />
                  {label}
                </button>
              );
            })}
          </div>

          <div className="border-t border-gray-700/60" />

          {/* Row 3: title override */}
          <div>
            <p className="text-xs text-gray-400 mb-2 font-medium tracking-wide uppercase">
              Card title override
              <span className="ml-2 normal-case font-normal text-gray-600">
                (leave blank to use event name)
              </span>
            </p>
            <input
              type="text"
              value={cardOptions.titleOverride}
              onChange={(e) => patchOption("titleOverride", e.target.value)}
              placeholder={event.name}
              className="w-full px-3 py-1.5 rounded-lg border border-gray-600 bg-gray-900/60 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-yellow-500/60 transition-colors"
            />
          </div>
        </div>

        {/* Background picker panel */}
        {bgPickerOpen && (
          <div className="mb-4 rounded-xl border border-gray-700 bg-gray-800/60 p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-200">
                Choose Background
              </span>
              <button
                onClick={() => setBgPickerOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <input
              ref={bgFileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handleBgFileChange}
            />
            <button
              onClick={() => bgFileRef.current?.click()}
              disabled={uploading}
              className="flex items-center gap-2 w-full px-3 py-2 mb-4 rounded-lg border border-dashed border-gray-600 text-gray-400 hover:border-yellow-500 hover:text-yellow-400 text-sm transition-colors disabled:opacity-50"
            >
              <Upload className="w-4 h-4" />
              {uploading
                ? "Converting & uploading…"
                : "Upload new image (max 15 MB)"}
            </button>
            {bgLoading ? (
              <p className="text-xs text-gray-500 text-center py-4">Loading…</p>
            ) : savedBgs.length === 0 ? (
              <p className="text-xs text-gray-500 text-center py-4">
                No backgrounds saved yet — upload one above.
              </p>
            ) : (
              <div className="grid grid-cols-4 gap-2 max-h-44 overflow-y-auto">
                {savedBgs.map((bg, i) => (
                  <div
                    key={bg.url}
                    className={`group relative rounded overflow-hidden border-2 transition-colors ${customBg === bg.url ? "border-yellow-500" : "border-transparent hover:border-gray-500"}`}
                    style={{ aspectRatio: "16/9" }}
                  >
                    {/* Select area */}
                    <button
                      onClick={() => {
                        setCustomBg(bg.url);
                        setBgPickerOpen(false);
                      }}
                      title={bg.original_filename || `Background ${i + 1}`}
                      className="block w-full h-full"
                    >
                      <img
                        src={bg.url}
                        alt={bg.original_filename || `Background ${i + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>

                    {/* Delete button — appears on hover */}
                    <button
                      onClick={(e) => handleDeleteBg(bg.url, e)}
                      title="Delete this background"
                      className="absolute top-1 right-1 w-5 h-5 rounded flex items-center justify-center bg-black/70 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-900/80 hover:text-red-200"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            {customBg && (
              <button
                onClick={() => {
                  setCustomBg(null);
                  setBgPickerOpen(false);
                }}
                className="mt-3 text-xs text-gray-500 hover:text-gray-300 transition-colors"
              >
                ↩ Reset to default background
              </button>
            )}
          </div>
        )}

        {/* Action buttons */}
        <div className="flex justify-end gap-3">
          <AdminButton
            variant="secondary"
            onClick={handleOpenPicker}
            icon={ImageIcon}
          >
            {customBg ? "Change Background" : "Set Background"}
          </AdminButton>
          <AdminButton variant="secondary" onClick={onClose}>
            Close
          </AdminButton>
          <AdminButton
            onClick={handleDownload}
            disabled={exporting}
            icon={Download}
          >
            {exporting ? "Generating\u2026" : "Download PNG"}
          </AdminButton>
        </div>
      </AdminModal>
    </>
  );
};

AnnouncementModal.propTypes = {
  event: PropTypes.object,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default AnnouncementModal;
