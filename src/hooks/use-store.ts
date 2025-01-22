import { useSyncExternalStore } from "react";
import type { Store } from "utils/stores";

export default function useStore<T>(store: Store<T>): T;
export default function useStore<T, S>(
  store: Store<T>,
  selector: (state: T) => S,
): S;
export default function useStore<T, S>(
  store: Store<T>,
  selector?: (state: T) => S,
): S {
  return useSyncExternalStore(
    (s) => store.subscribe(s),
    selector ? () => selector(store.get()) : (store.get as unknown as () => S),
    selector ? () => selector(store.get()) : (store.get as unknown as () => S),
  );
}
