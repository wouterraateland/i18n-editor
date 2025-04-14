import type { Locale, Usage } from "app/utils";
import { traverseLocales, unformatKey } from "app/utils";
import { useMemo } from "react";

export default function useForest(
  defaultLanguage: string,
  languages: Array<string>,
  locales: Array<Locale>,
  usage: Usage,
) {
  return useMemo(() => {
    const forest = traverseLocales(locales, "", defaultLanguage, usage);

    const emptyValue = languages.reduce<
      Record<string, { value: string; warnings: Array<string> }>
    >(
      (acc, language) => ({
        ...acc,
        [language]: { value: "", warnings: [] },
      }),
      {},
    );

    outer: for (const key in usage) {
      const parts = key.split(/\.|:/);
      if (!key.includes(":")) parts.unshift("translation");
      for (let i = 1; i < parts.length; i++)
        parts[i] = `${parts[i - 1]}${i === 1 ? ":" : "."}${parts[i]}`.replace(
          "translation:",
          "",
        );
      const lastPart = parts.pop();
      if (!lastPart) continue;
      let current = forest;
      for (const part of parts) {
        const node = current.find((node) => node.kFormatted === part);
        if (!node) {
          const k = unformatKey(part);
          if (k) {
            const next = {
              k,
              kFormatted: part,
              children: [],
            };
            current.push(next);
            current = next.children;
          }
        } else if ("children" in node) current = node.children;
        else continue outer;
      }
      const k = unformatKey(lastPart);
      if (
        k &&
        !current.some((tree) => tree.kFormatted.replace(/_.*/, "") === lastPart)
      )
        current.push({
          k,
          kFormatted: lastPart,
          usage: usage[lastPart] ?? 0,
          translations: { ...emptyValue },
        });
    }

    return forest;
  }, [defaultLanguage, languages, locales, usage]);
}
