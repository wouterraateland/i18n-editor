"use client";

import clsx from "clsx";
import IconCheck from "components/icons/check";
import IconCopy from "components/icons/copy";
import Button from "components/ui/button";
import type { ButtonSize } from "components/ui/utils";
import { useEffect, useRef, useState } from "react";
import { copyTextToClipboard } from "utils/strings";

export default function CopyButton({
  size = "sm",
  text,
  ...props
}: {
  outline?: boolean;
  size?: ButtonSize;
  text: string;
} & React.ComponentPropsWithoutRef<"button">) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  const [copied, setCopied] = useState(false);

  useEffect(() => {
    clearTimeout(timeoutRef.current);
    setCopied(false);
    return () => {
      clearTimeout(timeoutRef.current);
    };
  }, [text]);

  return (
    <Button
      {...props}
      iconLeft={
        <div className="grid">
          <IconCheck
            className={clsx(
              "col-start-1 row-start-1 text-primary transition-opacity",
              copied || "opacity-0",
            )}
          />
          <IconCopy
            className={clsx(
              "col-start-1 row-start-1 text-weak transition-opacity group-hover/button:text-text",
              copied && "opacity-0",
            )}
          />
        </div>
      }
      layout="icon"
      onClick={async () => {
        await copyTextToClipboard(text);
        setCopied(true);
        timeoutRef.current = setTimeout(() => {
          setCopied(false);
        }, 2000);
      }}
      {...(copied ? { open: true } : {})}
      size={size}
      title={copied ? "Copied" : "Copy to clipboard"}
      type="button"
    />
  );
}
