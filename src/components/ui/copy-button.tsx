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
  const timeoutRef = useRef(setTimeout(() => {}));

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
              "text-primary col-start-1 row-start-1 transition-opacity",
              copied || "opacity-0",
            )}
          />
          <IconCopy
            className={clsx(
              "text-weak group-hover/button:text-text col-start-1 row-start-1 transition-opacity",
              copied && "opacity-0",
            )}
          />
        </div>
      }
      layout="icon"
      onClick={async () => {
        await copyTextToClipboard(text);
        setCopied(true);
        clearTimeout(timeoutRef.current);
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
