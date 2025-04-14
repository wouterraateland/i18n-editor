import clsx from "clsx";
import IconCheck from "components/icons/check";
import Spinner from "components/ui/spinner";
import { useEffect, useRef, useState } from "react";
import { identity } from "utils/functions";

export default function AutoSavingInput<T>({
  className,
  description,
  hash = identity,
  indicatorPosition = "top",
  label,
  value,
  onSave,
  render,
  saveDelay = 3000,
  savedIndicatorDuration = 2000,
}: {
  className?: string | undefined;
  description?: React.ReactNode;
  hash?: (value: T) => unknown;
  indicatorPosition?: "top" | "bottom" | "left" | "right" | "none";
  label?: React.ReactNode;
  value: T;
  onSave(value: T): unknown;
  render(props: {
    value: T;
    onChange(value: T): void;
    onBlur(): void;
  }): React.ReactNode;
  saveDelay?: number;
  savedIndicatorDuration?: number;
}) {
  const saveRef = useRef(onSave);
  saveRef.current = onSave;
  const innerValueRef = useRef(value);
  const outerValueRef = useRef(value);
  outerValueRef.current = value;
  const saveDelayRef = useRef(saveDelay);
  saveDelayRef.current = saveDelay;
  const saveTimeoutRef = useRef(setTimeout(() => {}));
  const savedIndicatorDurationRef = useRef(savedIndicatorDuration);
  savedIndicatorDurationRef.current = savedIndicatorDuration;
  const hashRef = useRef(hash);
  hashRef.current = hash;

  const [updates, forceUpdate] = useState(0);
  const [state, setState] = useState("idle" as "idle" | "saving" | "saved");

  useEffect(() => {
    if (hashRef.current(value) === hashRef.current(innerValueRef.current))
      return;
    innerValueRef.current = value;
    forceUpdate((x) => x + 1);
  }, [value]);

  useEffect(() => {
    return () => {
      if (
        hashRef.current(outerValueRef.current) !==
        hashRef.current(innerValueRef.current)
      )
        saveRef.current(innerValueRef.current);
    };
  }, []);

  useEffect(() => {
    if (
      hashRef.current(outerValueRef.current) ===
      hashRef.current(innerValueRef.current)
    )
      return;

    saveTimeoutRef.current = setTimeout(async () => {
      setState("saving");
      await saveRef.current(innerValueRef.current);
      setState("saved");
    }, saveDelayRef.current);

    return () => {
      clearTimeout(saveTimeoutRef.current);
    };
  }, [updates]);

  useEffect(() => {
    if (state !== "saved") return;
    const t = setTimeout(() => {
      setState("idle");
    }, savedIndicatorDurationRef.current);
    return () => {
      clearTimeout(t);
    };
  }, [state]);

  const indicator = (
    <>
      {(indicatorPosition === "left" || indicatorPosition === "right") && (
        <div
          className={clsx(
            "bg-weak col-start-1 row-start-1 m-1 size-2 rounded-full transition-opacity",
            (hash(value) === hash(innerValueRef.current) ||
              state === "saving") &&
              "opacity-0",
          )}
        />
      )}
      <div
        className={clsx(
          "text-weak col-start-1 row-start-1 flex items-center gap-1 justify-self-end text-sm transition-opacity",
          hash(value) === hash(innerValueRef.current) && "opacity-0",
        )}
      >
        <div
          className={clsx(
            "flex transition-opacity",
            state !== "saving" && "opacity-0",
          )}
        >
          <Spinner />
        </div>
        {indicatorPosition === "left" || indicatorPosition === "right"
          ? null
          : "Unsaved changes"}
      </div>
      <div
        className={clsx(
          "text-primary col-start-1 row-start-1 flex items-center gap-1 justify-self-end text-sm transition-opacity",
          (hash(value) !== hash(innerValueRef.current) || state === "idle") &&
            "opacity-0",
        )}
      >
        <IconCheck />{" "}
        {indicatorPosition === "left" || indicatorPosition === "right"
          ? null
          : "Saved"}
      </div>
    </>
  );

  const input = render({
    value: innerValueRef.current,
    onChange(value) {
      innerValueRef.current = value;
      forceUpdate((x) => x + 1);
    },
    async onBlur() {
      if (
        hashRef.current(outerValueRef.current) ===
        hashRef.current(innerValueRef.current)
      )
        return;

      clearTimeout(saveTimeoutRef.current);
      setState("saving");
      await saveRef.current(innerValueRef.current);
      setState("saved");
    },
  });

  return (
    <div className={clsx("space-y-1", className)}>
      {(label || description || indicatorPosition === "top") && (
        <div>
          <div className="flex flex-wrap">
            {label && <p className="text-dimmed">{label}</p>}
            {indicatorPosition === "top" && (
              <div className="ml-auto grid">{indicator}</div>
            )}
          </div>
          {description && <p className="text-weak text-sm">{description}</p>}
        </div>
      )}
      {indicatorPosition === "left" || indicatorPosition === "right" ? (
        <div className="flex">
          {indicatorPosition === "left" && (
            <div className="m-2 grid self-end">{indicator}</div>
          )}
          {input}
          {indicatorPosition === "right" && (
            <div className="m-2 grid self-end">{indicator}</div>
          )}
        </div>
      ) : (
        input
      )}
      {indicatorPosition === "bottom" && (
        <div className="ml-auto grid">{indicator}</div>
      )}
    </div>
  );
}
