"use client";

export default function Spinner() {
  return (
    <span
      ref={(node) =>
        node?.style.setProperty("--spinner-delay", `${-(Date.now() % 1000)}ms`)
      }
      className="animate-spin rounded-full border-[1.5px] border-current border-r-transparent p-1 leading-none [animation-delay:var(--spinner-delay)]"
    />
  );
}
