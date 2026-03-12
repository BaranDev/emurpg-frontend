import { forwardRef } from "react";
import PropTypes from "prop-types";
import gameBg from "../../assets/images/announcement-bg-game.jpg";
import generalBg from "../../assets/images/announcement-bg-general.jpg";

// ── Design tokens ─────────────────────────────────────────────────────────────
const CARD_WIDTH = 1080;
const GOLD = "#F5C842";
const GOLD_DIM = "rgba(245,196,50,0.65)";
const GOLD_RULE = "rgba(245,196,50,0.38)";
const GOLD_BORDER = "rgba(245,196,50,0.25)";
const HEADER_BG = "rgba(8,4,2,0.90)";
const TABLE_BG = "rgba(18,8,4,0.68)";
const WARM_WHITE = "#EDE8DC";
const WARM_WHITE_DIM = "rgba(237,232,220,0.72)";
const CINZEL = "Cinzel, 'Times New Roman', serif";
const SPECTRAL = "Spectral, Georgia, serif";

// ── Helpers ───────────────────────────────────────────────────────────────────
function formatDate(dateStr) {
  if (!dateStr) return "";
  const [y, m, d] = dateStr.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString("en-GB", {
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

// ── Sub-components ────────────────────────────────────────────────────────────
function GoldRule() {
  return (
    <div style={{ height: 1, background: GOLD_RULE, margin: "0 36px" }} />
  );
}

function CardHeader({ isGame }) {
  return (
    <div
      style={{
        background: HEADER_BG,
        padding: "22px 44px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <div
        style={{
          fontFamily: CINZEL,
          fontSize: 14,
          letterSpacing: "0.32em",
          color: GOLD_DIM,
          textTransform: "uppercase",
        }}
      >
        EMU RPG CLUB
      </div>
      <div
        style={{
          fontFamily: CINZEL,
          fontSize: 11,
          letterSpacing: "0.2em",
          color: GOLD,
          textTransform: "uppercase",
          padding: "5px 14px",
          border: `1px solid ${GOLD_BORDER}`,
          borderRadius: 4,
        }}
      >
        {isGame ? "Game Event" : "General Event"}
      </div>
    </div>
  );
}

function HeroSection({ event, dateDisplay }) {
  return (
    <div style={{ padding: "60px 72px", textAlign: "center" }}>
      <h1
        style={{
          fontFamily: CINZEL,
          fontWeight: 700,
          fontSize: 52,
          color: GOLD,
          margin: "0 0 28px",
          lineHeight: 1.18,
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}
      >
        {event.name}
      </h1>

      <div
        style={{
          fontFamily: SPECTRAL,
          fontSize: 20,
          color: WARM_WHITE,
          marginBottom: 10,
        }}
      >
        {"\uD83D\uDCC5"}&nbsp; {dateDisplay}
      </div>

      {(event.start_time || event.end_time) && (
        <div
          style={{
            fontFamily: SPECTRAL,
            fontSize: 18,
            color: WARM_WHITE_DIM,
            marginBottom: 10,
          }}
        >
          {"\uD83D\uDD50"}&nbsp;{" "}
          {[event.start_time, event.end_time].filter(Boolean).join(" \u2013 ")}
        </div>
      )}

      {event.venue_name && (
        <div
          style={{
            fontFamily: SPECTRAL,
            fontSize: 18,
            color: WARM_WHITE_DIM,
          }}
        >
          {"\uD83D\uDCCD"}&nbsp; {event.venue_name}
        </div>
      )}
    </div>
  );
}

function TableCard({ table }) {
  const players = table.approved_players || [];
  return (
    <div
      style={{
        flex: "1 1 0",
        minWidth: 0,
        background: TABLE_BG,
        border: `1px solid ${GOLD_BORDER}`,
        borderRadius: 12,
        padding: "22px 20px",
      }}
    >
      <div
        style={{
          fontFamily: CINZEL,
          fontWeight: 700,
          fontSize: 14,
          color: GOLD,
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          marginBottom: 8,
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
          lineHeight: 1.4,
        }}
      >
        {table.game_name}
      </div>

      <div
        style={{
          fontFamily: SPECTRAL,
          fontSize: 13,
          color: GOLD_DIM,
          fontStyle: "italic",
          marginBottom: 14,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {table.game_master}
      </div>

      <div
        style={{
          borderTop: "1px solid rgba(245,196,50,0.14)",
          paddingTop: 12,
        }}
      >
        {players.length === 0 ? (
          <div
            style={{
              fontFamily: SPECTRAL,
              fontSize: 13,
              color: "rgba(237,232,220,0.35)",
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
                fontFamily: SPECTRAL,
                fontSize: 14,
                color: WARM_WHITE,
                marginBottom: 6,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              &middot; {p.name}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

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

  return (
    <div style={{ padding: "40px 32px" }}>
      <div
        style={{
          fontFamily: CINZEL,
          fontSize: 12,
          letterSpacing: "0.28em",
          color: "rgba(245,196,50,0.55)",
          textTransform: "uppercase",
          textAlign: "center",
          marginBottom: 28,
        }}
      >
        ✦&nbsp; Tables &nbsp;✦
      </div>

      {rows.map((row, ri) => (
        <div
          key={ri}
          style={{
            display: "flex",
            gap: 20,
            marginBottom: ri < rows.length - 1 ? 20 : 0,
          }}
        >
          {row.map((table, ci) => (
            <TableCard key={table.slug || `${ri}-${ci}`} table={table} />
          ))}
          {row.length < 3 &&
            Array.from({ length: 3 - row.length }).map((_, si) => (
              <div key={`sp-${si}`} style={{ flex: "1 1 0", minWidth: 0 }} />
            ))}
        </div>
      ))}
    </div>
  );
}

function GeneralContent({ clubs }) {
  if (!clubs || clubs.length === 0) return null;

  return (
    <div style={{ padding: "48px 56px" }}>
      <div
        style={{
          fontFamily: CINZEL,
          fontSize: 12,
          letterSpacing: "0.28em",
          color: "rgba(245,196,50,0.55)",
          textTransform: "uppercase",
          textAlign: "center",
          marginBottom: 28,
        }}
      >
        ✦&nbsp; Participating Clubs &nbsp;✦
      </div>
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
              borderRadius: 8,
              background: TABLE_BG,
            }}
          >
            {club}
          </div>
        ))}
      </div>
    </div>
  );
}

function CardFooter() {
  return (
    <div
      style={{
        background: HEADER_BG,
        padding: "18px 44px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <div
        style={{
          fontFamily: CINZEL,
          fontSize: 13,
          color: GOLD_DIM,
          letterSpacing: "0.1em",
        }}
      >
        emurpg.emu.edu.tr
      </div>
      <div style={{ fontFamily: CINZEL, fontSize: 16, color: GOLD_RULE }}>
        ✦
      </div>
      <div
        style={{
          fontFamily: CINZEL,
          fontSize: 13,
          color: GOLD_DIM,
          letterSpacing: "0.1em",
        }}
      >
        @emurpgclub
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
const AnnouncementCard = forwardRef(function AnnouncementCard({ event }, ref) {
  const isGame = event.event_type !== "general";
  const bg = isGame ? gameBg : generalBg;
  const dateDisplay = buildDateDisplay(event.start_date, event.end_date);

  return (
    <div
      ref={ref}
      style={{
        width: CARD_WIDTH,
        position: "relative",
        overflow: "hidden",
        background: "#0A0402",
      }}
    >
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

      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.80) 100%)",
          zIndex: 1,
        }}
      />

      <div style={{ position: "relative", zIndex: 2 }}>
        <CardHeader isGame={isGame} />
        <GoldRule />
        <HeroSection event={event} dateDisplay={dateDisplay} />
        <GoldRule />
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
};

CardHeader.propTypes = { isGame: PropTypes.bool.isRequired };
HeroSection.propTypes = {
  event: PropTypes.object.isRequired,
  dateDisplay: PropTypes.string.isRequired,
};
TableCard.propTypes = { table: tableShape.isRequired };
GameContent.propTypes = { tableDetails: PropTypes.arrayOf(tableShape) };
GeneralContent.propTypes = { clubs: PropTypes.arrayOf(PropTypes.string) };

export default AnnouncementCard;
