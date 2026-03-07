import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, act, fireEvent } from "@testing-library/react";
import HomePage from "../pages/HomePage";
import i18n from "../i18n";

const stripMotionProps = ({
  whileHover,
  whileTap,
  transition,
  initial,
  animate,
  ...props
}) => props;

vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }) => (
      <div {...stripMotionProps(props)}>{children}</div>
    ),
    h1: ({ children, ...props }) => (
      <h1 {...stripMotionProps(props)}>{children}</h1>
    ),
    p: ({ children, ...props }) => (
      <p {...stripMotionProps(props)}>{children}</p>
    ),
    button: ({ children, ...props }) => (
      <button {...stripMotionProps(props)}>{children}</button>
    ),
  },
}));

vi.mock("../components", async () => {
  const React = await import("react");
  const { useTranslation } = await import("react-i18next");

  const passthrough = ({ children }) => <div>{children}</div>;

  // Minimal Navbar mock that renders the language globe like the real one
  const NavbarMock = ({ onLanguageSwitch }) => {
    const { t, i18n } = useTranslation();
    return (
      <nav>
        <button
          onClick={() => {
            const next = i18n.language === "en" ? "tr" : "en";
            if (onLanguageSwitch) onLanguageSwitch(next);
          }}
          aria-label={t("navbar.language")}
        >
          Globe
        </button>
      </nav>
    );
  };

  return {
    SocialButton: passthrough,
    GameMasterCard: passthrough,
    SectionTitle: passthrough,
    Navbar: NavbarMock,
    InstagramGrid: passthrough,
    FireButton: ({ onClick, text }) => (
      <button onClick={onClick}>{text}</button>
    ),
    MainFooter: passthrough,
    HomePageEventList: passthrough,
  };
});

vi.mock("../components/ParallaxBackground", () => ({
  default: () => null,
}));

describe("HomePage hero language globe", () => {
  const originalIntersectionObserver = globalThis.IntersectionObserver;
  const originalFetch = globalThis.fetch;

  beforeEach(async () => {
    vi.useFakeTimers();

    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [],
    });

    globalThis.IntersectionObserver = class {
      observe() {}
      disconnect() {}
      unobserve() {}
    };

    localStorage.setItem("selectedLanguage", "en");
    await i18n.changeLanguage("en");
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    globalThis.IntersectionObserver = originalIntersectionObserver;
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it("toggles the language from the main screen globe", async () => {
    const onLanguageSwitch = vi.fn((language) => i18n.changeLanguage(language));

    render(<HomePage onLanguageSwitch={onLanguageSwitch} />);
    act(() => {
      vi.advanceTimersByTime(1500);
    });

    const globeButton = screen.getByRole("button", {
      name: /language/i,
    });

    fireEvent.click(globeButton);
    expect(onLanguageSwitch).toHaveBeenNthCalledWith(1, "tr");

    fireEvent.click(globeButton);
    expect(onLanguageSwitch).toHaveBeenNthCalledWith(2, "en");
  });
});
