"use client";

import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import clsx from "clsx";

export function TooltipContent({
  className,
  children,
  ...props
}: TooltipPrimitive.TooltipContentProps) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        className={clsx(
          "pointer-events-none z-[300] max-w-[calc(100vw-1rem)] gap-x-2 rounded-md px-3 py-1 text-left theme-inverse-surface data-[state=closed]:animate-fade-out-still data-[state=delayed-open]:animate-fade-in data-[state=instant-open]:animate-fade-in-still",
          className,
        )}
        {...props}
      >
        {children}
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  );
}

export const TooltipRoot = TooltipPrimitive.Root;
export const TooltipTrigger = TooltipPrimitive.Trigger;
