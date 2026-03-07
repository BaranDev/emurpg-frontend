/**
 * CharrollerResults - Medium Priority Button Tests
 *
 * TDD: Tests written FIRST. All tests must fail before implementation.
 *
 * Covers (MEDIUM priority):
 *   2d. Short Rest - roll hit die + CON mod, heal currentHP (capped at maxHP)
 *   2e. Long Rest  - restore full HP, reset tempHP, reset usedSpellSlots & death saves
 *   4a. Inventory tab - render equipment list items
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, within, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CharrollerResults from "../components/Charroller/CharrollerResults";
import { makeDnd5eCharacter, seedLocalStorage } from "./fixtures/charroller";

// ─── Helpers ─────────────────────────────────────────────────────────────────

const renderCharroller = (overrides = {}) => {
  const char = makeDnd5eCharacter(overrides);
  seedLocalStorage(char);
  return { char, ...render(<CharrollerResults characterData={char} />) };
};

/** Helper: change the currentHP input to a specific value. */
const setHPTo = (hpValue) => {
  const hpInputs = screen.getAllByRole("spinbutton");
  // currentHP is the first spinbutton, maxHP second, tempHP third
  fireEvent.change(hpInputs[0], { target: { value: String(hpValue) } });
};

const getTempHPInput = () => screen.getAllByRole("spinbutton")[2];
const getCurrentHPValue = () =>
  parseInt(screen.getAllByRole("spinbutton")[0].value);

// ─── 2d. Short Rest ───────────────────────────────────────────────────────────

describe("Short Rest button", () => {
  beforeEach(() => {
    localStorage.clear();
    // floor(0.5*10)+1 = 6 for d10 hit die (Fighter); floor(0.5*20)+1 = 11 for d20
    vi.spyOn(Math, "random").mockReturnValue(0.5);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders a Short Rest button", () => {
    renderCharroller();
    expect(
      screen.getByRole("button", { name: /short rest/i }),
    ).toBeInTheDocument();
  });

  it("increases currentHP when clicked (character is injured)", async () => {
    const user = userEvent.setup();
    renderCharroller();

    // Set current HP to 30 (injured - maxHP is 45)
    setHPTo(30);
    expect(getCurrentHPValue()).toBe(30);

    await user.click(screen.getByRole("button", { name: /short rest/i }));

    // HP should increase (d10+CON mod roll > 0)
    expect(getCurrentHPValue()).toBeGreaterThan(30);
  });

  it("does not exceed maxHP after Short Rest", async () => {
    const user = userEvent.setup();
    renderCharroller();

    // HP starts at maxHP (45). Rest at full health.
    await user.click(screen.getByRole("button", { name: /short rest/i }));

    expect(getCurrentHPValue()).toBeLessThanOrEqual(45);
  });
});

// ─── 2e. Long Rest ────────────────────────────────────────────────────────────

describe("Long Rest button", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("renders a Long Rest button", () => {
    renderCharroller();
    expect(
      screen.getByRole("button", { name: /long rest/i }),
    ).toBeInTheDocument();
  });

  it("restores currentHP to maxHP after Long Rest", async () => {
    const user = userEvent.setup();
    renderCharroller();

    // Injure the character
    setHPTo(10);
    expect(getCurrentHPValue()).toBe(10);

    await user.click(screen.getByRole("button", { name: /long rest/i }));

    expect(getCurrentHPValue()).toBe(45); // maxHP from fixture
  });

  it("resets tempHP to 0 after Long Rest", async () => {
    const user = userEvent.setup();
    renderCharroller();

    // Give character some temp HP
    fireEvent.change(getTempHPInput(), { target: { value: "8" } });

    await user.click(screen.getByRole("button", { name: /long rest/i }));

    expect(parseInt(getTempHPInput().value)).toBe(0);
  });
});

// ─── 4a. Inventory Tab ────────────────────────────────────────────────────────

describe("Inventory tab", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("renders an INVENTORY tab button", () => {
    renderCharroller();
    expect(
      screen.getByRole("button", { name: /inventory/i }),
    ).toBeInTheDocument();
  });

  it("shows character equipment items when INVENTORY tab is clicked", async () => {
    const user = userEvent.setup();
    renderCharroller({
      equipment: ["Longsword", "Chain Mail", "Shield"],
    });

    await user.click(screen.getByRole("button", { name: /inventory/i }));

    expect(screen.getByText("Longsword")).toBeInTheDocument();
    expect(screen.getByText("Chain Mail")).toBeInTheDocument();
    expect(screen.getByText("Shield")).toBeInTheDocument();
  });

  it("shows an empty state message when character has no equipment", async () => {
    const user = userEvent.setup();
    renderCharroller({ equipment: [] });

    await user.click(screen.getByRole("button", { name: /inventory/i }));

    expect(
      screen.getByText(/no items|empty inventory|no equipment/i),
    ).toBeInTheDocument();
  });
});
