/**
 * CharrollerResults - Low Priority Button Tests
 *
 * TDD: Tests written FIRST. All tests must fail before implementation.
 *
 * Covers (LOW priority):
 *   4c. Search filter - filter roll rows in Combat/Spells tab
 *   About tab         - render character backstory, traits, etc.
 */

import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CharrollerResults from "../components/Charroller/CharrollerResults";
import { makeDnd5eCharacter, seedLocalStorage } from "./fixtures/charroller";

const renderCharroller = (overrides = {}) => {
  const char = makeDnd5eCharacter(overrides);
  seedLocalStorage(char);
  return { char, ...render(<CharrollerResults characterData={char} />) };
};

// ─── 4c. Search Filter ────────────────────────────────────────────────────────

describe("Search filter in Combat tab", () => {
  beforeEach(() => localStorage.clear());

  it("renders a search input in the Combat tab", () => {
    renderCharroller();
    // Default tab is combat. The search input should be present.
    expect(screen.getByPlaceholderText(/search/i)).toBeInTheDocument();
  });

  it("filters roll rows to only show matches when user types", async () => {
    const user = userEvent.setup();
    renderCharroller({
      roll_list: [
        { roll_name: "Longsword Attack", dice: "1d20+7", category: "attack" },
        { roll_name: "Torch Throw", dice: "1d20+2", category: "attack" },
        { roll_name: "Longsword Damage", dice: "1d8+4", category: "damage" },
      ],
    });

    const searchInput = screen.getByPlaceholderText(/search/i);
    await user.type(searchInput, "longsword");

    expect(screen.getAllByText("Longsword Attack").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Longsword Damage").length).toBeGreaterThan(0);
    expect(screen.queryAllByText("Torch Throw").length).toBe(0);
  });

  it("clears the filter when search is empty", async () => {
    const user = userEvent.setup();
    renderCharroller({
      roll_list: [
        { roll_name: "Longsword Attack", dice: "1d20+7", category: "attack" },
        { roll_name: "Torch Throw", dice: "1d20+2", category: "attack" },
      ],
    });

    const searchInput = screen.getByPlaceholderText(/search/i);
    await user.type(searchInput, "longsword");
    await user.clear(searchInput);

    expect(screen.getAllByText("Longsword Attack").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Torch Throw").length).toBeGreaterThan(0);
  });
});

// ─── About Tab ────────────────────────────────────────────────────────────────

describe("About tab", () => {
  beforeEach(() => localStorage.clear());

  it("renders an ABOUT tab button", () => {
    renderCharroller();
    expect(screen.getByRole("button", { name: /about/i })).toBeInTheDocument();
  });

  it("shows character backstory when ABOUT tab is clicked", async () => {
    const user = userEvent.setup();
    renderCharroller({
      backstory:
        "Aldric was born in a small mining village in the Ironhold Mountains.",
    });

    await user.click(screen.getByRole("button", { name: /about/i }));

    expect(screen.getByText(/Aldric was born/i)).toBeInTheDocument();
  });

  it("shows character alignment when ABOUT tab is clicked", async () => {
    const user = userEvent.setup();
    renderCharroller({ alignment: "Lawful Good" });

    await user.click(screen.getByRole("button", { name: /about/i }));

    expect(screen.getByText(/Lawful Good/i)).toBeInTheDocument();
  });

  it("shows character background when ABOUT tab is clicked", async () => {
    const user = userEvent.setup();
    renderCharroller({ background: "Soldier" });

    await user.click(screen.getByRole("button", { name: /about/i }));

    expect(screen.getByText(/Soldier/i)).toBeInTheDocument();
  });

  it("shows empty state when no About data available", async () => {
    const user = userEvent.setup();
    renderCharroller({
      backstory: undefined,
      alignment: undefined,
      background: undefined,
    });

    await user.click(screen.getByRole("button", { name: /about/i }));

    expect(
      screen.getByText(/no background|no about|no information/i),
    ).toBeInTheDocument();
  });
});
