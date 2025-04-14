export const createCache = <P, T>(
  serialize: (params: P) => string,
  buildValue: (params: P) => T,
) => {
  const cache = {} as Record<string, T>;
  return {
    get(params: P) {
      const cacheKey = serialize(params);
      const cached = cache[cacheKey];
      if (cached) return cached;
      const value = buildValue(params);
      cache[cacheKey] = value;
      return value;
    },
    cache,
  };
};
