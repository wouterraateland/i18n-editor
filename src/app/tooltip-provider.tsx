"use client";

import { Provider } from "@radix-ui/react-tooltip";

export default function TooltipProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Provider
      delayDuration={200}
      disableHoverableContent={true}
      skipDelayDuration={500}
    >
      {children}
    </Provider>
  );
}
