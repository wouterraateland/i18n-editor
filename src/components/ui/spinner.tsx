"use client";

export default function Spinner() {
  return (
    <span
      ref={(node) =>
        node?.style.setProperty("--spinner-delay", `${-(Date.now() % 1000)}ms`)
      }
      className="size-4 animate-spin rounded-full border-[1.5px] border-current border-r-transparent leading-none [animation-delay:var(--spinner-delay)]"
    />
  );
}
