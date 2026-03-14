import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import AnnouncementCard from "../components/Admin/AnnouncementCard";

vi.mock("../assets/images/announcement-bg-game.jpg", () => ({
  default: "game-bg.jpg",
}));
vi.mock("../assets/images/announcement-bg-general.jpg", () => ({
  default: "general-bg.jpg",
}));
vi.mock("../assets/logo/LOGO_WHITE.png", () => ({ default: "logo-white.png" }));
vi.mock("lucide-react", () => ({
  Calendar: ({ size, color }) => (
    <svg data-testid="icon-calendar" style={{ width: size, color }} />
  ),
  Clock: ({ size, color }) => (
    <svg data-testid="icon-clock" style={{ width: size, color }} />
  ),
  MapPin: ({ size, color }) => (
    <svg data-testid="icon-mappin" style={{ width: size, color }} />
  ),
}));

const gameEvent = {
  name: "EMURPG Spring 2026",
  event_type: "game",
  start_date: "2026-04-01",
  end_date: "2026-04-01",
  start_time: "10:00",
  end_time: "18:00",
  venue_name: "Kaleiçi Pasaj",
  clubs: [],
  tableDetails: [
    {
      slug: "table-1",
      game_name: "Curse of Strahd",
      game_master: "Baran",
      approved_players: [{ name: "Alice" }, { name: "Bob" }],
    },
    {
      slug: "table-2",
      game_name: "Lost Mine of Phandelver",
      game_master: "Deha",
      approved_players: [{ name: "Charlie" }],
    },
  ],
};

const generalEvent = {
  name: "Inter-Club Gathering",
  event_type: "general",
  start_date: "2026-05-10",
  end_date: "2026-05-10",
  venue_name: "Main Hall",
  clubs: ["EMURPG", "Chess Club", "Drama Club"],
  tableDetails: [],
};

describe("AnnouncementCard", () => {
  it("renders header with club name", () => {
    render(<AnnouncementCard event={gameEvent} />);
    expect(screen.getByText(/EMURPG CLUB/i)).toBeInTheDocument();
  });

  it("renders event name in hero section", () => {
    render(<AnnouncementCard event={gameEvent} />);
    expect(screen.getByText("EMURPG Spring 2026")).toBeInTheDocument();
  });

  it("renders venue name when provided", () => {
    render(<AnnouncementCard event={gameEvent} />);
    expect(screen.getByText(/Kaleiçi Pasaj/)).toBeInTheDocument();
  });

  it("renders table cards for game events", () => {
    render(<AnnouncementCard event={gameEvent} />);
    expect(screen.getByText(/Curse of Strahd/i)).toBeInTheDocument();
    expect(screen.getByText(/Alice/)).toBeInTheDocument();
  });

  it("shows Game Night badge for game type", () => {
    render(<AnnouncementCard event={gameEvent} />);
    expect(screen.getByText("Game Night")).toBeInTheDocument();
  });

  it("shows Club Event badge for general type", () => {
    render(<AnnouncementCard event={generalEvent} />);
    expect(screen.getByText("Club Event")).toBeInTheDocument();
  });

  it("renders clubs section for general events", () => {
    render(<AnnouncementCard event={generalEvent} />);
    expect(screen.getByText("EMURPG")).toBeInTheDocument();
    expect(screen.getByText("Chess Club")).toBeInTheDocument();
  });

  it("renders footer with website and social handle", () => {
    render(<AnnouncementCard event={gameEvent} />);
    expect(screen.getByText(/emurpg\.com/)).toBeInTheDocument();
    expect(screen.getByText(/@emurpgclub/)).toBeInTheDocument();
  });

  it("handles missing optional fields gracefully", () => {
    const minimal = {
      name: "Minimal Event",
      event_type: "game",
      start_date: "2026-06-01",
      end_date: "2026-06-01",
    };
    expect(() => render(<AnnouncementCard event={minimal} />)).not.toThrow();
  });

  it("formats a date range correctly", () => {
    const rangeEvent = { ...gameEvent, end_date: "2026-04-02" };
    render(<AnnouncementCard event={rangeEvent} />);
    expect(
      screen.getByText(/1 April 2026 \u2013 2 April 2026/),
    ).toBeInTheDocument();
  });
});
