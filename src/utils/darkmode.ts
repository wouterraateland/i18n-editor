import { createLocalStorageStore } from "utils/stores";

type Theme = "light" | "dark" | "system";

export const themeStore = createLocalStorageStore(
  "theme",
  (s) =>
    s === "light"
      ? ("light" as Theme)
      : s === "dark"
        ? ("dark" as Theme)
        : ("system" as Theme),
  (s) => s,
);

export const getVisibleTheme = (theme: Theme) => {
  if (theme === "system")
    return typeof window === "object" &&
      "matchMedia" in window &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  return theme;
};
