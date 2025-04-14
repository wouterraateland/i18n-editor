"use client";

import clsx from "clsx";
import Spinner from "components/ui/spinner";
import {
  TooltipContent,
  TooltipRoot,
  TooltipTrigger,
} from "components/ui/tooltip";
import type { ButtonSize } from "components/ui/utils";
import usePending from "hooks/use-pending";
import { forwardRef } from "react";
import type { Override } from "utils/types";

const Button = forwardRef<
  HTMLButtonElement,
  Omit<
    Override<
      React.ComponentPropsWithRef<"button">,
      {
        fallbackLabel?: React.ReactNode;
        iconLeft?: React.ReactNode;
        iconLeftClassName?: string | undefined;
        iconRight?: React.ReactNode;
        iconRightClassName?: string | undefined;
        label?: React.ReactNode;
        labelClassName?: string | undefined;
        layout?: "text" | "icon";
        onClick?:
          | ((event: React.MouseEvent<HTMLButtonElement>) => unknown)
          | undefined;
        open?: boolean;
        outline?: boolean;
        pending?: boolean;
        side?: "left" | "top" | "right" | "bottom";
        size: ButtonSize;
        type: "button" | "submit" | "reset";
      }
    >,
    "children"
  >
>(function Button(
  {
    className,
    disabled = false,
    fallbackLabel,
    iconLeft,
    iconLeftClassName,
    iconRight,
    iconRightClassName,
    label,
    labelClassName,
    layout = "text",
    onClick,
    outline = false,
    open,
    pending = false,
    side = "top",
    size,
    title,
    ...props
  },
  ref,
) {
  const [pendingState, withPending] = usePending();
  const renderPending = pending || pendingState;
  const renderIconLeft = renderPending ? <Spinner /> : iconLeft;
  const renderLabel = label || fallbackLabel;
  const renderTitle =
    title || (typeof renderLabel === "string" ? renderLabel : undefined);

  const inner = (
    <button
      {...props}
      ref={ref}
      aria-label={renderTitle}
      className={clsx(
        "group/button inline-flex min-w-0 cursor-pointer items-center justify-center whitespace-nowrap rounded-lg outline-offset-1 transition-colors hover:bg-divider disabled:pointer-events-none disabled:opacity-50 data-[state=open]:bg-divider data-[state=open]:outline",
        !label && fallbackLabel && "text-weak hover:text-text",
        outline && "ring ring-inset hover:ring-current",
        size === "sm" && "gap-x-1 p-1",
        size === "md" && "gap-x-2 p-2",
        size === "lg" && "gap-x-3 p-3",
        size === "xl" && "gap-x-4 p-4",
        className,
      )}
      disabled={disabled || renderPending}
      onClick={withPending(onClick)}
    >
      {renderIconLeft ? (
        <div
          className={clsx(
            "pointer-events-none m-1 inline-flex empty:hidden",
            iconLeftClassName,
          )}
        >
          {renderIconLeft}
        </div>
      ) : null}
      {layout === "text" && renderLabel ? (
        <div
          className={clsx(
            "pointer-events-none min-w-0 truncate first:pl-1.5 last:pr-1.5",
            labelClassName,
          )}
        >
          {renderLabel}
        </div>
      ) : null}
      {iconRight ? (
        <div
          className={clsx(
            "pointer-events-none empty:hidden",
            layout === "text" || !iconLeft
              ? "m-1 inline-flex"
              : "absolute -translate-y-3 translate-x-3 scale-50",
            iconRightClassName,
          )}
        >
          {iconRight}
        </div>
      ) : null}
    </button>
  );

  const tooltipContent = layout === "icon" ? title || renderLabel : title;

  return tooltipContent ? (
    <TooltipRoot {...(open !== undefined ? { open } : {})}>
      <TooltipTrigger asChild>{inner}</TooltipTrigger>
      <TooltipContent side={side}>{tooltipContent}</TooltipContent>
    </TooltipRoot>
  ) : (
    inner
  );
});

export default Button;
