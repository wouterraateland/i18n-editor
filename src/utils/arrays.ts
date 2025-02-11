export const chunkBy = <T>(array: Array<T>, size: number): Array<Array<T>> =>
  Array.from({ length: Math.ceil(array.length / size) }, (_, i) =>
    array.slice(i * size, i * size + size),
  );
