import { ServerCacheContext } from "components/server-cache-provider";
import useStore from "hooks/use-store";
import { use } from "react";
import { queryCache } from "utils/fetchers";

export function useQuery<T>(key: string, fetcher: () => Promise<T>) {
  const serverCache = use(ServerCacheContext);
  const store = queryCache.get(key);
  const state = useStore(store);

  if (state.error) throw state.error;
  if (
    state.loadedAt === 0 &&
    typeof window === "object" &&
    state.data === undefined
  ) {
    const cachedData = serverCache[key] as T | undefined;
    if (cachedData !== undefined) {
      store.set({
        data: cachedData,
        error: null,
        loadedAt: Date.now(),
        promise: undefined,
      });
      return cachedData;
    }
  }
  if (state.loadedAt === 0 && !state.promise) {
    state.promise = new Promise((resolve, reject) =>
      fetcher().then(
        (data) => {
          store.set({
            data,
            error: null,
            loadedAt: Date.now(),
            promise: undefined,
          });
          resolve(data);
        },
        (error: Error) => {
          store.update((s) => ({ ...s, error, loadedAt: Date.now() }));
          reject(error);
        },
      ),
    );

    // eslint-disable-next-line @typescript-eslint/no-throw-literal
    if (state.data === undefined) throw state.promise;
  }

  return state.data as T;
}
