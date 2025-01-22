import { useCallback, useState } from "react";

export default function usePending() {
  const [pending, setPending] = useState(false);

  const withPending = useCallback(
    <A extends Array<unknown>>(f: undefined | ((...args: A) => unknown)) =>
      async (...args: A) => {
        setPending(true);
        try {
          return await f?.(...args);
        } finally {
          setPending(false);
        }
      },
    [],
  );

  return [pending, withPending] as const;
}
