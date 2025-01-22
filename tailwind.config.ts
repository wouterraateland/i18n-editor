import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

export default {
  content: ["./src/**/*.{ts,tsx}"],
  darkMode: "class", // false or 'media' or 'class'
  theme: {
    extend: {
      borderColor: {
        DEFAULT: "var(--color-divider)",
      },
      ringOpacity: {
        DEFAULT: "1",
      },
      ringWidth: {
        DEFAULT: "1px",
      },
      colors: {
        "error-container": "var(--color-error-container)",
        "info-container": "var(--color-info-container)",
        "inverse-primary": "var(--color-inverse-primary)",
        "inverse-surface": "var(--color-inverse-surface)",
        "primary-container": "var(--color-primary-container)",
        "warning-container": "var(--color-warning-container)",
        available: "var(--color-available)",
        background: "var(--color-background)",
        booked: "var(--color-booked)",
        closed: "var(--color-closed)",
        dimmed: "var(--color-text-dimmed)",
        divider: "var(--color-divider)",
        error: "var(--color-error)",
        info: "var(--color-info)",
        primary: "var(--color-primary)",
        surface: "var(--color-surface)",
        tentative: "var(--color-tentative)",
        text: "var(--color-text)",
        unavailable: "var(--color-unavailable)",
        warning: "var(--color-warning)",
        weak: "var(--color-text-weak)",
      },
      keyframes: {
        "fade-in": {
          from: {
            opacity: "0",
            transform: "translate(var(--origin-x, 0), var(--origin-y, 0))",
          },
          to: { opacity: "1", transform: "translate(0, 0)" },
        },
        "fade-in-still": { from: { opacity: "0" }, to: { opacity: "1" } },
        "fade-out-still": { from: { opacity: "1" }, to: { opacity: "0" } },
      },
      animation: {
        "fade-in": "fade-in 100ms ease-out",
        "fade-in-still": "fade-in-still 100ms ease-out",
        "fade-out-still": "fade-out-still 100ms ease-in",
      },
    },
  },
  plugins: [
    plugin(({ addUtilities }) => {
      addUtilities({
        ".hide-scrollbar": {
          "-ms-overflow-style": "none" /* IE and Edge */,
          "scrollbar-width": "none" /* Firefox */,
          "&::-webkit-scrollbar": { display: "none" },
        },
        ...[
          "background",
          "error-container",
          "error",
          "info-container",
          "info",
          "inverse-surface",
          "primary-container",
          "primary",
          "surface",
          "warning-container",
          "warning",
        ].reduce(
          (acc, theme) => ({
            ...acc,
            [`.theme-${theme}`]: {
              "--color-text": `var(--color-on-${theme})`,
              "--color-text-dimmed": `var(--color-on-${theme}-dimmed)`,
              "--color-text-weak": `var(--color-on-${theme}-weak)`,
              "--color-divider": `var(--color-${theme}-divider)`,
              backgroundColor: `var(--color-${theme})`,
              color: "var(--color-text)",
            },
          }),
          {},
        ),
      });
    }),
  ],
} satisfies Config;
