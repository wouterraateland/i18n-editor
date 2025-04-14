import { createCache } from "utils/caching";
import { createStore } from "utils/stores";

export const queryCache = createCache(
  (key: string) => key,
  () =>
    createStore({
      data: undefined as unknown,
      error: null as Error | null,
      loadedAt: 0,
      promise: undefined as Promise<unknown> | undefined,
    }),
);

export const queryCacheSet = (key: string, data: unknown) => {
  queryCache.get(key).set({
    data,
    error: null,
    loadedAt: Date.now(),
    promise: undefined,
  });
};
