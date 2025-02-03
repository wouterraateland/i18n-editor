import "styles.css";

import TooltipProvider from "app/tooltip-provider";
import ThemedBody from "components/themed-body";
import type { Metadata } from "next";

export const revalidate = 0;

export const metadata: Metadata = {
  title: "I18n Editor",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <TooltipProvider>
      <html lang="en-US">
        <ThemedBody className="flex h-[100dvh] flex-col">{children}</ThemedBody>
      </html>
    </TooltipProvider>
  );
}
