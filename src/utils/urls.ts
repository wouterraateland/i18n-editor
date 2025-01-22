import type { ReadonlyURLSearchParams } from "next/navigation";

const buildSearchParams = (
  params: Record<
    string,
    Array<string> | string | number | boolean | null | undefined
  >,
  current?: string | URLSearchParams | ReadonlyURLSearchParams,
) => {
  const searchParams = new URLSearchParams(current);
  for (const [key, value] of Object.entries(params)) {
    searchParams.delete(key);
    if (Array.isArray(value))
      for (const item of value) searchParams.append(key, item);
    else if (value !== undefined) searchParams.set(key, String(value));
  }
  return searchParams;
};

export const applySearchParams = (
  params: Record<
    string,
    Array<string> | string | number | boolean | null | undefined
  >,
  searchParams?: string | URLSearchParams,
  method: "push" | "replace" = "replace",
) => {
  try {
    history[method === "push" ? "pushState" : "replaceState"](
      {},
      "",
      `${window.location.pathname}?${buildSearchParams(params, searchParams)}`,
    );
  } catch (error) {
    console.log(error);
  }
};
