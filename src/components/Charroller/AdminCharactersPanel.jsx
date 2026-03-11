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
        <p className="text-red-400 text-sm">{t("charroller.feedback.error")}
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
            key={`${char.character_name}-${i}`}
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
