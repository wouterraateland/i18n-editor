export type Tree = {
  children?: Array<Tree>;
  k: string;
  kFormatted: string;
  translations?: Record<string, { value: unknown; warnings: Array<string> }>;
  usage?: number;
};

export type Forest = Array<Tree>;

export const forestFilter = (
  forest: Forest,
  predicate: (node: Tree) => boolean,
): Forest =>
  forest.flatMap((tree) => {
    if ("children" in tree) {
      const children = forestFilter(tree.children, predicate);
      if (children.length === 0) return [];

      return [{ ...tree, children }];
    }
    if (predicate(tree)) return [tree];
    return [];
  });

export const forestCount = (forest: Forest): number =>
  forest.reduce((acc, tree) => {
    if ("children" in tree) return acc + forestCount(tree.children);
    return acc + 1;
  }, 0);

export const forestFlatten = (forest: Forest): Array<Tree> =>
  forest.flatMap((tree) => {
    if ("children" in tree) return [tree, ...forestFlatten(tree.children)];
    return [tree];
  });
