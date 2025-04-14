"use client";

import * as PopoverPrimitive from "@radix-ui/react-popover";
import clsx from "clsx";
import LoadingState from "components/loading-state";
import { Suspense } from "react";

export function PopoverContent({
  children,
  className,
  ...props
}: PopoverPrimitive.PopoverContentProps) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        className="group/content pointer-events-none! z-50 flex min-h-[calc(50vh-0.5*var(--radix-popper-anchor-height,0px))] max-w-[calc(100vw-2rem)] flex-col justify-center focus-visible:outline-hidden data-[side=bottom]:justify-start data-[side=top]:justify-end print:hidden!"
        collisionPadding={4}
        sideOffset={8}
        sticky="always"
        {...props}
      >
        <div
          className={clsx(
            "theme-surface group-data-[state=closed]/content:animate-fade-out group-data-[state=open]/content:animate-fade-in ring-divider pointer-events-auto max-h-(--radix-popper-available-height) max-w-full overflow-auto rounded-xl shadow-md ring focus-visible:outline-hidden",
            className,
          )}
        >
          <Suspense fallback={<LoadingState />}>{children}</Suspense>
        </div>
      </PopoverPrimitive.Content>
    </PopoverPrimitive.Portal>
  );
}

export const PopoverRoot = PopoverPrimitive.Root;
export const PopoverTrigger = PopoverPrimitive.Trigger;
