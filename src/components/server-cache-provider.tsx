"use client";

import { createContext, use } from "react";
import { queryCache } from "utils/fetchers";

export const ServerCacheContext = createContext<Record<string, unknown>>({});

export default function ServerCacheProvider({
  children,
  queries,
}: {
  children: React.ReactNode;
  queries: Record<string, unknown>;
}) {
  const parentContext = use(ServerCacheContext);

  for (const [key, data] of Object.entries(queries)) {
    const store = queryCache.get(key);
    if (store.get().data === undefined)
      store.set({
        data,
        error: null,
        loadedAt: Date.now(),
        promise: undefined,
      });
  }

  return (
    <ServerCacheContext value={{ ...parentContext, ...queries }}>
      {children}
    </ServerCacheContext>
  );
}
