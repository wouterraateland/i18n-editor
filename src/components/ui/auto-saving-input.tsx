import { useEffect, useRef, useState } from "react";
import { identity } from "utils/functions";

export default function AutoSavingInput<T>({
  hash = identity,
  onSave,
  render,
  saveDelay = 3000,
  value,
}: {
  hash?: (value: T) => unknown;
  onSave(value: T): unknown;
  render(props: {
    value: T;
    onChange(value: T): void;
    onBlur(): void;
  }): React.ReactNode;
  saveDelay?: number;
  value: T;
}) {
  const saveRef = useRef(onSave);
  saveRef.current = onSave;
  const innerValueRef = useRef(value);
  const outerValueRef = useRef(value);
  outerValueRef.current = value;
  const saveDelayRef = useRef(saveDelay);
  saveDelayRef.current = saveDelay;
  const saveTimeoutRef = useRef(setTimeout(() => {}));
  const hashRef = useRef(hash);
  hashRef.current = hash;

  const [updates, forceUpdate] = useState(0);

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
      await saveRef.current(innerValueRef.current);
    }, saveDelayRef.current);

    return () => {
      clearTimeout(saveTimeoutRef.current);
    };
  }, [updates]);

  return render({
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
      await saveRef.current(innerValueRef.current);
    },
  });
}
