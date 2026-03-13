import { forwardRef } from "react";
import PropTypes from "prop-types";
import { Calendar, Clock, MapPin } from "lucide-react";
import gameBg from "../../assets/images/announcement-bg-game.jpg";
import generalBg from "../../assets/images/announcement-bg-general.jpg";
import logoWhite from "../../assets/logo/LOGO_WHITE.png";

// ── Design tokens ─────────────────────────────────────────────────────────────
const CARD_WIDTH = 1080;
const GOLD = "#FFD426";
const GOLD_DIM = "rgba(255,212,38,0.56)";
const GOLD_RULE = "rgba(255,212,38,0.28)";
const GOLD_BORDER = "rgba(255,212,38,0.18)";
const CRIMSON = "#B91C34";
const HEADER_BG = "rgba(4,2,1,0.94)";
const TABLE_BG = "rgba(10,4,2,0.78)";
const WARM_WHITE = "#F5EFE0";
const WARM_WHITE_DIM = "rgba(245,239,224,0.60)";
const CINZEL = "Cinzel, 'Times New Roman', serif";
const SPECTRAL = "Spectral, Georgia, serif";

// ── Helpers ───────────────────────────────────────────────────────────────────
function formatDate(dateStr) {
  if (!dateStr) return "";
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function buildDateDisplay(start, end) {
  if (!start) return "";
  if (!end || start === end) return formatDate(start);
  return `${formatDate(start)} \u2013 ${formatDate(end)}`;
}

// ── Primitives ────────────────────────────────────────────────────────────────
function GoldRule() {
  return <div style={{ height: 1, background: GOLD_RULE, margin: "0 36px" }} />;
}

function HeraldRule() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
      }}
    >
      <div style={{ flex: 1, height: 1, background: GOLD_RULE }} />
      <div
        style={{
          fontFamily: CINZEL,
          fontSize: 11,
          color: GOLD_DIM,
          letterSpacing: "0.3em",
          userSelect: "none",
        }}
      >
        ✦
      </div>
      <div style={{ flex: 1, height: 1, background: GOLD_RULE }} />
    </div>
  );
}

function SectionLabel({ children }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 16,
        marginBottom: 28,
      }}
    >
      <div style={{ flex: 1, height: 1, background: GOLD_RULE }} />
      <div
        style={{
          fontFamily: CINZEL,
          fontSize: 10,
          letterSpacing: "0.36em",
          color: GOLD_DIM,
          textTransform: "uppercase",
          whiteSpace: "nowrap",
        }}
      >
        ✦ {children} ✦
      </div>
      <div style={{ flex: 1, height: 1, background: GOLD_RULE }} />
    </div>
  );
}

// ── Header ────────────────────────────────────────────────────────────────────
function CardHeader({ isGame }) {
  return (
    <div
      style={{
        background: HEADER_BG,
        padding: "14px 44px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      {/* Left: Logo + club name */}
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <img
          src={logoWhite}
          alt="EMU RPG"
          style={{
            height: 32,
            width: "auto",
            objectFit: "contain",
            opacity: 0.9,
          }}
        />
        <div
          style={{
            width: 1,
            height: 28,
            background: GOLD_RULE,
          }}
        />
        <div>
          <div
            style={{
              fontFamily: CINZEL,
              fontSize: 13,
              letterSpacing: "0.3em",
              color: GOLD,
              textTransform: "uppercase",
              lineHeight: 1.2,
            }}
          >
            EMURPG CLUB
          </div>
          <div
            style={{
              fontFamily: SPECTRAL,
              fontSize: 10,
              color: GOLD_DIM,
              letterSpacing: "0.12em",
              fontStyle: "italic",
              marginTop: 2,
            }}
          >
            Eastern Mediterranean University
          </div>
        </div>
      </div>

      {/* Right: Event type badge */}
      <div
        style={{
          fontFamily: CINZEL,
          fontSize: 10,
          letterSpacing: "0.24em",
          color: WARM_WHITE,
          textTransform: "uppercase",
          padding: "7px 20px",
          background: CRIMSON,
          borderRadius: 2,
          border: "1px solid rgba(185,28,52,0.6)",
          boxShadow: "0 0 18px rgba(185,28,52,0.35)",
        }}
      >
        {isGame ? "Game Night" : "Club Event"}
      </div>
    </div>
  );
}

// ── Hero ──────────────────────────────────────────────────────────────────────
function InfoRow({ icon: Icon, children }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "0 20px",
      }}
    >
      <Icon
        size={15}
        color={GOLD_DIM}
        strokeWidth={1.5}
        style={{ flexShrink: 0 }}
      />
      <span
        style={{
          fontFamily: SPECTRAL,
          fontSize: 17,
          color: WARM_WHITE,
          lineHeight: 1.3,
          whiteSpace: "nowrap",
        }}
      >
        {children}
      </span>
    </div>
  );
}

function MetaDivider() {
  return (
    <div
      style={{
        width: 1,
        height: 18,
        background: GOLD_RULE,
        flexShrink: 0,
      }}
    />
  );
}

function HeroSection({ event, dateDisplay }) {
  return (
    <div style={{ padding: "48px 80px 44px", textAlign: "center" }}>
      <div style={{ marginBottom: 22 }}>
        <HeraldRule />
      </div>

      <h1
        style={{
          fontFamily: CINZEL,
          fontWeight: 700,
          fontSize: 56,
          color: GOLD,
          margin: "0 0 20px",
          lineHeight: 1.12,
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
          letterSpacing: "0.04em",
          textShadow: "0 2px 24px rgba(255,212,38,0.20)",
        }}
      >
        {event.name}
      </h1>

      <div style={{ marginBottom: 26 }}>
        <HeraldRule />
      </div>

      {/* Event metadata — horizontal row with dividers */}
      <div
        style={{
          display: "inline-flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 0,
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {dateDisplay && <InfoRow icon={Calendar}>{dateDisplay}</InfoRow>}
        {(event.start_time || event.end_time) && (
          <>
            <MetaDivider />
            <InfoRow icon={Clock}>
              {[event.start_time, event.end_time]
                .filter(Boolean)
                .join(" \u2013 ")}
            </InfoRow>
          </>
        )}
        {event.venue_name && (
          <>
            <MetaDivider />
            <InfoRow icon={MapPin}>{event.venue_name}</InfoRow>
          </>
        )}
      </div>
    </div>
  );
}

// ── Table card ────────────────────────────────────────────────────────────────
function TableCard({ table, index }) {
  const players = table.approved_players || [];
  return (
    <div
      style={{
        flex: "1 1 0",
        minWidth: 0,
        background: TABLE_BG,
        border: `1px solid ${GOLD_BORDER}`,
        borderRadius: 6,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Crimson top accent */}
      <div style={{ height: 3, background: CRIMSON, flexShrink: 0 }} />

      <div style={{ padding: "16px 18px 20px" }}>
        {/* Table number */}
        <div
          style={{
            fontFamily: CINZEL,
            fontSize: 9,
            letterSpacing: "0.32em",
            color: GOLD_DIM,
            textTransform: "uppercase",
            marginBottom: 8,
          }}
        >
          Table {String(index + 1).padStart(2, "0")}
        </div>

        {/* Game name */}
        <div
          style={{
            fontFamily: CINZEL,
            fontWeight: 700,
            fontSize: 13,
            color: GOLD,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            marginBottom: 5,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            lineHeight: 1.35,
          }}
        >
          {table.game_name}
        </div>

        {/* GM name */}
        <div
          style={{
            fontFamily: SPECTRAL,
            fontSize: 12,
            color: WARM_WHITE_DIM,
            fontStyle: "italic",
            marginBottom: 13,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {table.game_master}
        </div>

        {/* Divider */}
        <div
          style={{
            height: 1,
            background: "rgba(255,212,38,0.12)",
            marginBottom: 11,
          }}
        />

        {/* Players — numbered, no bullets */}
        {players.length === 0 ? (
          <div
            style={{
              fontFamily: SPECTRAL,
              fontSize: 12,
              color: "rgba(245,239,224,0.28)",
              fontStyle: "italic",
            }}
          >
            No players
          </div>
        ) : (
          players.map((p, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: 9,
                paddingTop: i > 0 ? 5 : 0,
                marginTop: i > 0 ? 5 : 0,
                borderTop: i > 0 ? "1px solid rgba(255,212,38,0.06)" : "none",
              }}
            >
              <span
                style={{
                  fontFamily: CINZEL,
                  fontSize: 9,
                  color: GOLD_DIM,
                  letterSpacing: "0.05em",
                  flexShrink: 0,
                  minWidth: 16,
                  lineHeight: 1.6,
                }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <span
                style={{
                  fontFamily: SPECTRAL,
                  fontSize: 13,
                  color: WARM_WHITE,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  lineHeight: 1.5,
                }}
              >
                {p.name}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ── Backup players card ───────────────────────────────────────────────────────
function BackupPlayersCard({ players }) {
  if (!players || players.length === 0) return null;
  return (
    <div
      style={{
        background: TABLE_BG,
        border: `1px solid ${GOLD_BORDER}`,
        borderRadius: 6,
        overflow: "hidden",
        marginTop: 16,
      }}
    >
      {/* Amber accent bar — distinct from the crimson on table cards */}
      <div
        style={{
          height: 3,
          background: "rgba(255,212,38,0.55)",
          flexShrink: 0,
        }}
      />
      <div style={{ padding: "16px 24px 20px" }}>
        <div
          style={{
            fontFamily: CINZEL,
            fontSize: 10,
            letterSpacing: "0.32em",
            color: GOLD_DIM,
            textTransform: "uppercase",
            textAlign: "center",
            marginBottom: 14,
          }}
        >
          ✦ Backup Players ✦
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 28px" }}>
          {players.map((p, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: 8,
                minWidth: 160,
              }}
            >
              <span
                style={{
                  fontFamily: CINZEL,
                  fontSize: 9,
                  color: GOLD_DIM,
                  letterSpacing: "0.05em",
                  flexShrink: 0,
                  minWidth: 16,
                  lineHeight: 1.6,
                }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <span
                style={{
                  fontFamily: SPECTRAL,
                  fontSize: 13,
                  color: WARM_WHITE_DIM,
                  lineHeight: 1.5,
                }}
              >
                {p.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Game content ──────────────────────────────────────────────────────────────
function GameContent({ tableDetails }) {
  if (!tableDetails || tableDetails.length === 0) {
    return (
      <div
        style={{
          padding: "48px 44px",
          textAlign: "center",
          fontFamily: SPECTRAL,
          fontSize: 16,
          color: WARM_WHITE_DIM,
          fontStyle: "italic",
        }}
      >
        No tables registered yet.
      </div>
    );
  }

  const rows = [];
  for (let i = 0; i < tableDetails.length; i += 3) {
    rows.push(tableDetails.slice(i, i + 3));
  }

  // Collect all backup players across tables, deduplicated by name
  const seen = new Set();
  const allBackups = tableDetails
    .flatMap((t) => t.backup_players || [])
    .filter((p) => {
      if (seen.has(p.name)) return false;
      seen.add(p.name);
      return true;
    });

  return (
    <div style={{ padding: "36px 32px" }}>
      <SectionLabel>Registered Adventurers</SectionLabel>
      {rows.map((row, ri) => (
        <div
          key={ri}
          style={{
            display: "flex",
            gap: 16,
            marginBottom: ri < rows.length - 1 ? 16 : 0,
            alignItems: "stretch",
          }}
        >
          {row.map((table, ci) => (
            <TableCard
              key={table.slug || `${ri}-${ci}`}
              table={table}
              index={ri * 3 + ci}
            />
          ))}
          {row.length < 3 &&
            Array.from({ length: 3 - row.length }).map((_, si) => (
              <div key={`sp-${si}`} style={{ flex: "1 1 0", minWidth: 0 }} />
            ))}
        </div>
      ))}
      <BackupPlayersCard players={allBackups} />
    </div>
  );
}

// ── General content ───────────────────────────────────────────────────────────
function GeneralContent({ clubs }) {
  if (!clubs || clubs.length === 0) return null;
  return (
    <div style={{ padding: "48px 56px" }}>
      <SectionLabel>Participating Clubs</SectionLabel>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 14,
          justifyContent: "center",
        }}
      >
        {clubs.map((club, i) => (
          <div
            key={i}
            style={{
              fontFamily: CINZEL,
              fontSize: 16,
              color: GOLD,
              padding: "12px 28px",
              border: `1px solid ${GOLD_BORDER}`,
              borderRadius: 4,
              background: TABLE_BG,
              letterSpacing: "0.05em",
            }}
          >
            {club}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Footer ────────────────────────────────────────────────────────────────────
function CardFooter() {
  return (
    <div
      style={{
        background: HEADER_BG,
        padding: "14px 44px",
        display: "flex",
        alignItems: "center",
        gap: 20,
      }}
    >
      <div
        style={{
          fontFamily: CINZEL,
          fontSize: 11,
          color: GOLD_DIM,
          letterSpacing: "0.16em",
          textTransform: "uppercase",
        }}
      >
        emurpg.com
      </div>
      <div style={{ flex: 1, height: 1, background: GOLD_RULE }} />
      <div
        style={{
          fontFamily: CINZEL,
          fontSize: 11,
          color: GOLD_DIM,
          letterSpacing: "0.16em",
          textTransform: "uppercase",
        }}
      >
        @emurpgclub
      </div>
    </div>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────
const AnnouncementCard = forwardRef(function AnnouncementCard({ event, bgUrl }, ref) {
  const isGame = event.event_type !== "general";
  const bg = bgUrl || (isGame ? gameBg : generalBg);
  const dateDisplay = buildDateDisplay(event.start_date, event.end_date);

  return (
    <div
      ref={ref}
      style={{
        width: CARD_WIDTH,
        position: "relative",
        overflow: "hidden",
        background: "#050201",
      }}
    >
      {/* Background artwork */}
      <img
        src={bg}
        alt=""
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: 0,
        }}
      />

      {/* Dark gradient overlay — heavier at bottom so tables are always legible */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.50) 0%, rgba(0,0,0,0.72) 50%, rgba(0,0,0,0.88) 100%)",
          zIndex: 1,
        }}
      />

      <div style={{ position: "relative", zIndex: 2 }}>
        <CardHeader isGame={isGame} />
        <GoldRule />
        <HeroSection event={event} dateDisplay={dateDisplay} />
        {isGame ? (
          <GameContent tableDetails={event.tableDetails || []} />
        ) : (
          <GeneralContent clubs={event.clubs || []} />
        )}
        <GoldRule />
        <CardFooter />
      </div>
    </div>
  );
});

// ── PropTypes ─────────────────────────────────────────────────────────────────
const playerShape = PropTypes.shape({ name: PropTypes.string.isRequired });
const tableShape = PropTypes.shape({
  slug: PropTypes.string,
  game_name: PropTypes.string.isRequired,
  game_master: PropTypes.string.isRequired,
  approved_players: PropTypes.arrayOf(playerShape),
  backup_players: PropTypes.arrayOf(playerShape),
});

AnnouncementCard.propTypes = {
  event: PropTypes.shape({
    name: PropTypes.string.isRequired,
    event_type: PropTypes.string,
    start_date: PropTypes.string,
    end_date: PropTypes.string,
    start_time: PropTypes.string,
    end_time: PropTypes.string,
    venue_name: PropTypes.string,
    clubs: PropTypes.arrayOf(PropTypes.string),
    tableDetails: PropTypes.arrayOf(tableShape),
  }).isRequired,
  bgUrl: PropTypes.string,
};

CardHeader.propTypes = { isGame: PropTypes.bool.isRequired };
HeroSection.propTypes = {
  event: PropTypes.object.isRequired,
  dateDisplay: PropTypes.string.isRequired,
};
InfoRow.propTypes = {
  icon: PropTypes.elementType.isRequired,
  children: PropTypes.node.isRequired,
};
TableCard.propTypes = {
  table: tableShape.isRequired,
  index: PropTypes.number.isRequired,
};
GameContent.propTypes = { tableDetails: PropTypes.arrayOf(tableShape) };
GeneralContent.propTypes = { clubs: PropTypes.arrayOf(PropTypes.string) };
BackupPlayersCard.propTypes = { players: PropTypes.arrayOf(playerShape) };

export default AnnouncementCard;
