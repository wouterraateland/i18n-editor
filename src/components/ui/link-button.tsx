"use client";

import clsx from "clsx";
import {
  TooltipContent,
  TooltipRoot,
  TooltipTrigger,
} from "components/ui/tooltip";
import type { ButtonSize } from "components/ui/utils";
import type { LinkProps } from "next/link";
import Link from "next/link";
import { forwardRef } from "react";
import type { Override } from "utils/types";

const LinkButton = forwardRef<
  HTMLAnchorElement,
  Omit<
    Override<
      React.ComponentPropsWithRef<"a">,
      LinkProps & {
        disabled?: boolean;
        fallbackLabel?: React.ReactNode;
        iconLeft?: React.ReactNode;
        iconLeftClassName?: string | undefined;
        iconRight?: React.ReactNode;
        iconRightClassName?: string | undefined;
        label?: React.ReactNode;
        labelClassName?: string | undefined;
        layout?: "text" | "icon";
        outline?: boolean;
        side?: "left" | "right" | "top" | "bottom";
        size: ButtonSize;
      }
    >,
    "children"
  >
>(function LinkButton(
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
    outline = false,
    side = "top",
    size,
    title,
    ...props
  },
  ref,
) {
  const renderLabel = label || fallbackLabel;
  const renderTitle =
    title || (typeof renderLabel === "string" ? renderLabel : undefined);

  const inner = (
    <Link
      ref={ref}
      className={clsx(
        "group/button inline-flex min-w-0 cursor-pointer items-center justify-center rounded-lg outline-offset-1 transition-colors hover:bg-divider",
        disabled && "pointer-events-none opacity-50",
        outline && "ring ring-inset hover:ring-current",
        !label && fallbackLabel && "text-weak hover:text-text",
        size === "sm" && "gap-x-1 p-1",
        size === "md" && "gap-x-2 p-2",
        size === "lg" && "gap-x-3 p-3",
        size === "xl" && "gap-x-4 p-4",
        className,
      )}
      title={renderTitle}
      {...props}
    >
      {iconLeft ? (
        <span
          className={clsx("m-1 inline-flex empty:hidden", iconLeftClassName)}
        >
          {iconLeft}
        </span>
      ) : null}
      {layout === "text" && renderLabel ? (
        <span
          className={clsx(
            "min-w-0 truncate first:pl-1.5 last:pr-1.5",
            labelClassName,
          )}
        >
          {renderLabel}
        </span>
      ) : null}
      {iconRight ? (
        <span
          className={clsx(
            layout === "text" || !iconLeft
              ? "m-1 inline-flex empty:hidden"
              : "absolute -translate-y-3 translate-x-3 scale-50",
            iconRightClassName,
          )}
        >
          {iconRight}
        </span>
      ) : null}
    </Link>
  );

  return renderTitle && layout === "icon" ? (
    <TooltipRoot>
      <TooltipTrigger asChild>{inner}</TooltipTrigger>
      <TooltipContent side={side}>{renderTitle}</TooltipContent>
    </TooltipRoot>
  ) : (
    inner
  );
});

export default LinkButton;
