import { describe, expect, it } from "vitest";

import {
  formatRegistrationCountdown,
  getRegistrationOpenAt,
  isRegistrationOpen,
} from "../utils/registrationCountdown";

describe("registration countdown helpers", () => {
  it("builds a registration datetime from start_date + hour", () => {
    const openAt = getRegistrationOpenAt({
      start_date: "2026-03-15",
      registration_start_hour: 9,
    });

    expect(openAt.getFullYear()).toBe(2026);
    expect(openAt.getMonth()).toBe(2);
    expect(openAt.getDate()).toBe(15);
    expect(openAt.getHours()).toBe(9);
    expect(openAt.getMinutes()).toBe(0);
  });

  it("prefers registration_start_date over event start_date", () => {
    const openAt = getRegistrationOpenAt({
      start_date: "2026-03-15",
      registration_start_date: "2026-03-14",
      registration_start_hour: 9,
    });

    expect(openAt.getDate()).toBe(14);
  });

  it("treats events without configured hour as open", () => {
    expect(
      isRegistrationOpen(
        { start_date: "2026-03-15", registration_start_hour: null },
        new Date("2026-03-15T01:00:00"),
      ),
    ).toBe(true);
  });

  it("returns false before registration opens", () => {
    expect(
      isRegistrationOpen(
        { start_date: "2026-03-15", registration_start_hour: 9 },
        new Date("2026-03-15T08:59:00"),
      ),
    ).toBe(false);
  });

  it("formats a countdown string", () => {
    const target = new Date("2026-03-15T10:00:00");
    const label = formatRegistrationCountdown(target, new Date("2026-03-14T08:30:00"));
    expect(label).toBe("1d 1h 30m");
  });
});
