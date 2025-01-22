"use client";

import clsx from "clsx";
import useStore from "hooks/use-store";
import { useEffect, useState } from "react";
import { getVisibleTheme, themeStore } from "utils/darkmode";

const clientThemeCode = `(() => {
  const storedTheme = localStorage.getItem("i18n-editor.theme");
  const visibleTheme = storedTheme === "dark" || storedTheme === "light"
    ? storedTheme
    : ("matchMedia" in window && window.matchMedia("(prefers-color-scheme: dark)").matches)
      ? "dark"
      : "light";
  if (!document.body.classList.contains(visibleTheme))
    document.body.classList.add(visibleTheme);
})();`;

export default function ThemedBody({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const theme = useStore(themeStore);

  const [notchSide, setNotchSide] = useState(null as "left" | "right" | null);

  useEffect(() => {
    const updateNotchSide = (type: OrientationType) => {
      if (type === "landscape-primary") setNotchSide("left");
      else if (type === "landscape-secondary") setNotchSide("right");
      else if (type === "portrait-primary") setNotchSide(null);
    };

    try {
      updateNotchSide(screen.orientation.type);
    } catch (e) {
      console.log("Screen orientation not supported");
    }

    try {
      const abortController = new AbortController();
      screen.orientation.addEventListener(
        "change",
        (event) => {
          const orientation = event.target as ScreenOrientation;
          updateNotchSide(orientation.type);
        },
        { signal: abortController.signal },
      );
      return () => {
        abortController.abort();
      };
    } catch (e) {
      console.log("Screen orientation not supported");
    }
    return;
  });

  return (
    <body
      className={clsx(
        "antialiased theme-background",
        notchSide === "left" && "ml-[env(safe-area-inset-left)]",
        notchSide === "right" && "mr-[env(safe-area-inset-right)]",
        className,
        typeof window !== "object"
          ? undefined
          : getVisibleTheme(theme) === "dark"
            ? "dark"
            : "light",
      )}
    >
      <script dangerouslySetInnerHTML={{ __html: clientThemeCode }} />
      {children}
    </body>
  );
}
