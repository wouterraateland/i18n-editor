import { storageAvailable } from "utils/local-storage";

type Subscription<T> = (state: T) => void;

export const createStore = <T>(initialData: T) => {
  let data = initialData;
  const subscriptions = new Set<Subscription<T>>();

  const set = (next: T) => {
    data = next;
    for (const subscription of subscriptions) subscription(data);
  };

  return {
    get: () => data,
    set,
    setSilent(next: T) {
      data = next;
    },
    update(updater: (state: T) => T) {
      const next = updater(data);
      if (next !== data) set(next);
    },
    subscriptions,
    subscribe(subscription: Subscription<T>) {
      subscriptions.add(subscription);
      return () => {
        subscriptions.delete(subscription);
      };
    },
  };
};

export type Store<T> = ReturnType<typeof createStore<T>>;

export const createLocalStorageStore = <T>(
  key: string,
  parse: (s: string | null) => T,
  stringify: (state: T) => string,
) => {
  const fullKey = `i18n-editor.${key}`;

  const storedData = storageAvailable("localStorage")
    ? localStorage.getItem(fullKey)
    : null;
  const store = createStore(parse(storedData));

  const update = (updater: (state: T) => T) => {
    store.update(updater);
    if (storageAvailable("localStorage"))
      localStorage.setItem(fullKey, stringify(store.get()));
  };

  const set = (data: T) => {
    store.set(data);
    if (storageAvailable("localStorage"))
      localStorage.setItem(fullKey, stringify(store.get()));
  };

  if (storageAvailable("localStorage") && storedData === null) set(parse(null));

  return { ...store, update, set };
};
