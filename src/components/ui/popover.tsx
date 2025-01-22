"use client";

import * as PopoverPrimitive from "@radix-ui/react-popover";
import clsx from "clsx";
import LoadingState from "components/loading-state";
import ErrorBoundary from "components/ui/error-boundary";
import { Suspense } from "react";
import {
  popperContentClassName,
  popperContentWrapperClassName,
} from "utils/ui";

export function PopoverContent({
  children,
  className,
  ...props
}: PopoverPrimitive.PopoverContentProps) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        className={popperContentWrapperClassName}
        collisionPadding={4}
        sideOffset={8}
        sticky="always"
        {...props}
      >
        <div className={clsx(popperContentClassName, className)}>
          <ErrorBoundary>
            <Suspense fallback={<LoadingState />}>{children}</Suspense>
          </ErrorBoundary>
        </div>
      </PopoverPrimitive.Content>
    </PopoverPrimitive.Portal>
  );
}

export const PopoverRoot = PopoverPrimitive.Root;
export const PopoverTrigger = PopoverPrimitive.Trigger;
