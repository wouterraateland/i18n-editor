import "styles.css";

import TooltipProvider from "app/tooltip-provider";
import ThemedBody from "components/themed-body";

export const revalidate = 0;

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <TooltipProvider>
      <html lang="en-US">
        <ThemedBody className="flex h-[100dvh] flex-col">{children}</ThemedBody>
      </html>
    </TooltipProvider>
  );
}
