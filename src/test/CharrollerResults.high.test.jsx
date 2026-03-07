/**
 * CharrollerResults - High Priority Button Tests
 *
 * TDD: Tests are written FIRST. All tests in this file must fail before
 * any implementation code is written.
 *
 * Covers (HIGH priority):
 *   1a. Inspiration button - toggle boolean in trackers
 *   1b. Initiative button  - roll 1d20 + DEX mod, display result
 *   3b. Ability Check buttons - must roll actual d20, not hardcoded 10
 *   3c. Saving Throw buttons  - must roll actual d20, not hardcoded 10
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CharrollerResults from "../components/Charroller/CharrollerResults";
import { makeDnd5eCharacter, seedLocalStorage } from "./fixtures/charroller";

// ─── Test helpers ─────────────────────────────────────────────────────────────

const renderCharroller = (overrides = {}) => {
  const char = makeDnd5eCharacter(overrides);
  seedLocalStorage(char);
  return render(<CharrollerResults characterData={char} />);
};

// ─── 1a. Inspiration Button ───────────────────────────────────────────────────

describe("Inspiration button", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("renders an Inspiration button", () => {
    renderCharroller();
    expect(
      screen.getByRole("button", { name: /inspiration/i }),
    ).toBeInTheDocument();
  });

  it("is inactive by default (no accent background, no aria-pressed true)", () => {
    renderCharroller();
    const btn = screen.getByRole("button", { name: /inspiration/i });
    expect(btn).toHaveAttribute("aria-pressed", "false");
  });

  it("becomes active when clicked (aria-pressed becomes true)", async () => {
    const user = userEvent.setup();
    renderCharroller();
    const btn = screen.getByRole("button", { name: /inspiration/i });
    await user.click(btn);
    expect(btn).toHaveAttribute("aria-pressed", "true");
  });

  it("toggles back to inactive on second click", async () => {
    const user = userEvent.setup();
    renderCharroller();
    const btn = screen.getByRole("button", { name: /inspiration/i });
    await user.click(btn);
    await user.click(btn);
    expect(btn).toHaveAttribute("aria-pressed", "false");
  });
});

// ─── 1b. Initiative Button ────────────────────────────────────────────────────

describe("Initiative button", () => {
  beforeEach(() => {
    localStorage.clear();
    // Fix Math.random so we can predict the d20 result
    vi.spyOn(Math, "random").mockReturnValue(0.9); // floor(0.9*20)+1 = 19
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders an Initiative button", () => {
    renderCharroller();
    expect(
      screen.getByRole("button", { name: /initiative/i }),
    ).toBeInTheDocument();
  });

  it("shows the rolled initiative result after clicking", async () => {
    const user = userEvent.setup();
    // DEX Check has dice "1d20+2" so DEX mod is +2. With mocked d20=19 => 19+2=21
    renderCharroller();
    const btn = screen.getByRole("button", { name: /initiative/i });
    await user.click(btn);
    // The result should appear somewhere in the document
    expect(screen.getByText(/21/)).toBeInTheDocument();
  });

  it("adds the initiative roll to roll history", async () => {
    const user = userEvent.setup();
    renderCharroller();
    await user.click(screen.getByRole("button", { name: /initiative/i }));
    // Roll history toggle should expose the entry
    const historyBtn = screen.getByTestId("roll-history-toggle");
    await user.click(historyBtn);
    expect(screen.getByText(/initiative/i)).toBeInTheDocument();
  });
});

// ─── 3b/3c. Ability Check and Saving Throw Buttons ───────────────────────────

describe("Ability Check buttons roll actual d20 instead of hardcoded 10", () => {
  beforeEach(() => {
    localStorage.clear();
    // Mock random to return 0.5 => floor(0.5*20)+1 = 11
    vi.spyOn(Math, "random").mockReturnValue(0.5);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("Strength Ability Check result is d20 roll + modifier, not hardcoded 10 + modifier", async () => {
    const user = userEvent.setup();
    renderCharroller();

    // Click the Strength Ability button (+3 modifier from fixtures)
    // With mocked d20=11, total should be 11+3=14, NOT the old 10+3=13
    const abilityBtn = screen.getByRole("button", {
      name: /strength.*ability/i,
    });
    await user.click(abilityBtn);

    // Reveal history
    await user.click(screen.getByTestId("roll-history-toggle"));
    const history = screen.getByTestId("roll-history");
    expect(within(history).getByText("14")).toBeInTheDocument();
  });

  it("Strength Ability Check does NOT produce old hardcoded result", async () => {
    const user = userEvent.setup();
    renderCharroller();

    const abilityBtn = screen.getByRole("button", {
      name: /strength.*ability/i,
    });
    await user.click(abilityBtn);

    await user.click(screen.getByTestId("roll-history-toggle"));
    const history = screen.getByTestId("roll-history");
    // Old result would have been 10+3=13
    expect(within(history).queryByText("13")).not.toBeInTheDocument();
  });
});

describe("Saving Throw buttons roll actual d20 instead of hardcoded 10", () => {
  beforeEach(() => {
    localStorage.clear();
    // Mock random: floor(0.5*20)+1 = 11
    vi.spyOn(Math, "random").mockReturnValue(0.5);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("Strength Save result is d20 roll + save modifier, not hardcoded 10 + modifier", async () => {
    const user = userEvent.setup();
    renderCharroller();

    // STR Save has modifier +5. With d20=11 => total 11+5=16, NOT old 10+5=15
    const saveBtn = screen.getByRole("button", { name: /strength.*save/i });
    await user.click(saveBtn);

    await user.click(screen.getByTestId("roll-history-toggle"));
    const history = screen.getByTestId("roll-history");
    expect(within(history).getByText("16")).toBeInTheDocument();
  });
});
