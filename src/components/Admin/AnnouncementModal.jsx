import { useRef, useState, useCallback, useLayoutEffect } from "react";
import PropTypes from "prop-types";
import { toPng } from "html-to-image";
import { Download, Image as ImageIcon, Upload, X } from "lucide-react";
import AdminModal from "./shared/AdminModal";
import AdminButton from "./shared/AdminButton";
import AnnouncementCard from "./AnnouncementCard";
import { config } from "../../config";
import { getApiKey } from "../../utils/auth";

// The card is 1080px wide. We scale it to fit comfortably inside the modal.
const CARD_WIDTH    = 1080;
const PREVIEW_WIDTH = 680;
const PREVIEW_SCALE = PREVIEW_WIDTH / CARD_WIDTH;

const AnnouncementModal = ({ event, isOpen, onClose }) => {
  const exportRef          = useRef(null);
  const previewWrapperRef  = useRef(null);
  const previewContainerRef = useRef(null);
  const bgFileRef          = useRef(null);

  const [exporting, setExporting]       = useState(false);
  const [customBg, setCustomBg]         = useState(null);   // R2 URL or null
  const [bgPickerOpen, setBgPickerOpen] = useState(false);
  const [savedBgs, setSavedBgs]         = useState([]);
  const [bgLoading, setBgLoading]       = useState(false);
  const [uploading, setUploading]       = useState(false);

  const backendUrl = config.backendUrl;
  const apiKey     = getApiKey();

  // Keep the preview container height in sync with the card's natural height
  // multiplied by the scale factor. transform: scale() doesn't affect layout,
  // so without this the container stays at the card's full unscaled height.
  useLayoutEffect(() => {
    const wrapper   = previewWrapperRef.current;
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
        event.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
      link.download = `${slug}_announcement.png`;
      link.href     = dataUrl;
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
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch(
        `${backendUrl}/api/admin/announcement-backgrounds/upload`,
        { method: "POST", headers: { apiKey }, body: fd },
      );
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.detail || "Upload failed");
      }
      const { url } = await res.json();
      setCustomBg(url);
      setSavedBgs((prev) => [{ url, original_filename: file.name }, ...prev]);
      setBgPickerOpen(false);
    } catch (err) {
      alert(`Background upload failed: ${err.message}`);
    } finally {
      setUploading(false);
      if (bgFileRef.current) bgFileRef.current.value = "";
    }
  };

  if (!isOpen || !event) return null;

  return (
    <>
      {/* Hidden full-size card used as the html-to-image capture target */}
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
        <AnnouncementCard ref={exportRef} event={event} bgUrl={customBg} />
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
            margin: "0 auto 24px",
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
            <AnnouncementCard event={event} bgUrl={customBg} />
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

            {/* Upload new */}
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
              {uploading ? "Uploading…" : "Upload new image (JPEG / PNG / WebP, max 15 MB)"}
            </button>

            {/* Saved gallery */}
            {bgLoading ? (
              <p className="text-xs text-gray-500 text-center py-4">Loading…</p>
            ) : savedBgs.length === 0 ? (
              <p className="text-xs text-gray-500 text-center py-4">
                No backgrounds saved yet — upload one above.
              </p>
            ) : (
              <div className="grid grid-cols-4 gap-2 max-h-44 overflow-y-auto">
                {savedBgs.map((bg, i) => (
                  <button
                    key={bg.url}
                    onClick={() => { setCustomBg(bg.url); setBgPickerOpen(false); }}
                    title={bg.original_filename || `Background ${i + 1}`}
                    className={`relative rounded overflow-hidden border-2 transition-colors ${
                      customBg === bg.url
                        ? "border-yellow-500"
                        : "border-transparent hover:border-gray-500"
                    }`}
                    style={{ aspectRatio: "16/9" }}
                  >
                    <img
                      src={bg.url}
                      alt={bg.original_filename || `Background ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Reset to default */}
            {customBg && (
              <button
                onClick={() => { setCustomBg(null); setBgPickerOpen(false); }}
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
  event:   PropTypes.object,
  isOpen:  PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default AnnouncementModal;
