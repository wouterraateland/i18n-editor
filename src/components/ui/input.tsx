"use client";

import clsx from "clsx";
import type { ButtonSize } from "components/ui/utils";
import { buttonSizeClassNames } from "components/ui/utils";
import { useIsomorphicLayoutEffect } from "hooks/use-isomorphic-layout-effect";
import { forwardRef, useRef, useState } from "react";
import type { Override } from "utils/types";

function LengthIndicator({
  inputRef,
  maxLength,
}: {
  inputRef: React.MutableRefObject<HTMLInputElement | null>;
  maxLength: number;
}) {
  const [length, setLength] = useState(0);

  useIsomorphicLayoutEffect(() => {
    const input = inputRef.current;
    if (!input) return;
    const updateLength = () => {
      setLength(input.value.length);
    };

    updateLength();
    input.addEventListener("input", updateLength);
    return () => {
      input.removeEventListener("input", updateLength);
    };
  }, [inputRef]);

  return (
    <span className={length > maxLength ? "text-error" : "text-weak"}>
      {length} / {maxLength}
    </span>
  );
}

type InputProps = Override<
  React.ComponentPropsWithRef<"input">,
  { after?: React.ReactNode; before?: React.ReactNode; size?: ButtonSize }
>;

const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, size = "sm", before, after, maxLength, ...props },
  ref,
) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const beforeRef = useRef<HTMLDivElement | null>(null);
  const afterRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const ghostRef = useRef<HTMLDivElement | null>(null);

  useIsomorphicLayoutEffect(() => {
    const resize = () => {
      containerRef.current?.style.setProperty(
        "--w-before",
        `${beforeRef.current?.offsetWidth ?? 0}px`,
      );
      containerRef.current?.style.setProperty(
        "--w-after",
        `${afterRef.current?.offsetWidth ?? 0}px`,
      );
    };

    resize();
    if (!("ResizeObserver" in window)) return;
    const resizeObserver = new ResizeObserver(resize);

    const before = beforeRef.current;
    if (before) resizeObserver.observe(before);
    const after = afterRef.current;
    if (after) resizeObserver.observe(after);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  useIsomorphicLayoutEffect(() => {
    const input = inputRef.current;
    const ghost = ghostRef.current;
    if (!input || !ghost) return;

    const updateGhost = () => {
      const text =
        input.value.length === 0 ? (props.placeholder ?? " ") : input.value;

      if (ghost.textContent === text) return;
      ghost.textContent = text;
    };

    updateGhost();
    input.addEventListener("input", updateGhost);
    input.addEventListener("change", updateGhost);
    const i = setInterval(updateGhost, 100);

    return () => {
      input.removeEventListener("input", updateGhost);
      input.removeEventListener("change", updateGhost);
      clearInterval(i);
    };
  }, [props.placeholder, props.value]);

  return (
    <div
      ref={containerRef}
      className={clsx(
        "theme-background after:ring-divider relative flex max-w-full min-w-0 rounded-lg after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:ring after:-outline-offset-1 after:outline-[#3b82f6] after:transition-shadow after:content-[''] after:ring-inset focus-within:after:outline hover:after:ring-current",
        props.disabled && "pointer-events-none",
        className,
      )}
    >
      {before && (
        <div
          ref={beforeRef}
          className={clsx(
            "pointer-events-none relative z-10 mr-auto flex shrink-0 items-center",
            typeof before === "string" && buttonSizeClassNames[size],
            typeof before === "string" && "pr-0",
          )}
        >
          {before}
        </div>
      )}
      <div className="relative grid min-w-0 grow overflow-clip">
        <div
          ref={ghostRef}
          className={clsx(
            "invisible whitespace-pre empty:before:content-['-']",
            buttonSizeClassNames[size],
            before && "pl-0",
            (maxLength || after) && "pr-0",
          )}
        >
          {`${props.value}` ||
            `${props.defaultValue}` ||
            `${props.placeholder}` ||
            " "}
        </div>
        <input
          ref={(node) => {
            if (ref)
              if (typeof ref === "function") ref(node);
              else ref.current = node;
            inputRef.current = node;
          }}
          className={clsx(
            "placeholder:text-weak absolute inset-0 appearance-none rounded-lg bg-transparent leading-6 focus:outline-hidden disabled:pointer-events-none disabled:opacity-50",
            before && "-ml-(--w-before) pl-(--w-before)",
            (maxLength || after) && "-mr-(--w-after) pr-(--w-after)",
            buttonSizeClassNames[size],
          )}
          {...props}
        />
      </div>
      {after ? (
        <div
          ref={afterRef}
          className={clsx(
            "pointer-events-none relative z-10 ml-auto flex shrink-0 items-center",
            typeof after === "string" && buttonSizeClassNames[size],
            typeof after === "string" && "pl-0",
          )}
        >
          {after}
        </div>
      ) : maxLength ? (
        <div
          ref={afterRef}
          className={clsx(
            "pointer-events-none relative ml-auto shrink-0",
            buttonSizeClassNames[size],
          )}
        >
          <LengthIndicator inputRef={inputRef} maxLength={maxLength} />
        </div>
      ) : null}
    </div>
  );
});

export default Input;
