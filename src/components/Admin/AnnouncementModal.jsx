import { useRef, useState, useCallback } from "react";
import PropTypes from "prop-types";
import { toPng } from "html-to-image";
import { Download } from "lucide-react";
import AdminModal from "./shared/AdminModal";
import AdminButton from "./shared/AdminButton";
import AnnouncementCard from "./AnnouncementCard";

// The card is 1080px wide. We scale it to fit comfortably inside the modal.
const CARD_WIDTH = 1080;
const PREVIEW_WIDTH = 680;
const PREVIEW_SCALE = PREVIEW_WIDTH / CARD_WIDTH;

const AnnouncementModal = ({ event, isOpen, onClose }) => {
  const exportRef = useRef(null);
  const [exporting, setExporting] = useState(false);

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
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Failed to export announcement:", err);
      alert("Failed to generate image. Check the console for details.");
    } finally {
      setExporting(false);
    }
  }, [event]);

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
        <AnnouncementCard ref={exportRef} event={event} />
      </div>

      <AdminModal
        isOpen={isOpen}
        onClose={onClose}
        title="Announcement Preview"
        size="xl"
      >
        {/* Scaled live preview */}
        <div
          style={{
            width: PREVIEW_WIDTH,
            // Height of the preview container must match the scaled card height.
            // We use overflow:hidden on the outer div and let the inner scaled
            // div determine its own natural height.
            overflow: "hidden",
            margin: "0 auto 24px",
            borderRadius: 8,
            border: "1px solid rgba(245,196,50,0.18)",
            // Establish a block-formatting context so the scaled child height
            // collapses correctly.
            display: "block",
          }}
        >
          <div
            style={{
              width: CARD_WIDTH,
              transformOrigin: "top left",
              transform: `scale(${PREVIEW_SCALE})`,
              // The element is CARD_WIDTH wide but scaled down.
              // We need the wrapper to shrink to the scaled height, so we set
              // the wrapper to `height: <scaled height>` via a wrapping trick:
              // using a negative margin-bottom equal to the unscaled excess.
            }}
          >
            <AnnouncementCard event={event} />
          </div>
        </div>

        <div className="flex justify-end gap-3">
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
