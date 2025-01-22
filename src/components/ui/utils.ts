export const buttonSizeClassNames = {
  xs: "gap-x-1 px-2 py-0",
  sm: "gap-x-2 px-3 py-1",
  md: "gap-x-3 px-4 py-2",
  lg: "gap-x-4 px-6 py-3",
  xl: "gap-x-6 px-8 py-4",
};

export type ButtonSize = keyof typeof buttonSizeClassNames;
