import type { Forest, Tree } from "utils/trees";

export type Locale = { data: Record<string, unknown>; language: string };
export type Usage = Record<string, number>;

export enum TranslationWarning {
  ComponentMismatch,
  Identical,
  LineMismatch,
  VariableMismatch,
}

export const unformatKey = (key: string | null) => {
  if (!key) return null;
  if (!key.includes(":")) return `translation.${key}`.split(".");
  return key.split(/[.:]/);
};

export const traverseLocales = (
  slices: Array<{
    data: Record<string, unknown> | undefined;
    language: string;
  }>,
  prefix: Array<string>,
  defaultLanguage: string,
  usage: Usage,
): Forest => {
  const forest = new Array<Tree>();
  const obj = slices.find(({ language }) => language === defaultLanguage)?.data;
  if (!obj) return forest;

  for (const key in obj) {
    const k = [...prefix, key];
    const kFormatted = k
      .join(".")
      .replace(".", ":")
      .replace("translation:", "");

    if (
      typeof obj[key] === "object" &&
      obj[key] !== null &&
      !Array.isArray(obj[key])
    )
      forest.push({
        k,
        kFormatted,
        children: traverseLocales(
          slices.map(({ data, language }) => ({
            data: data?.[key] as Record<string, unknown> | undefined,
            language,
          })),
          k,
          defaultLanguage,
          usage,
        ),
      });
    else {
      const translations = slices.reduce<
        Record<string, { value: unknown; warnings: Array<TranslationWarning> }>
      >(
        (acc, { data, language }) => ({
          ...acc,
          [language]: { value: data?.[key] ?? "", warnings: [] },
        }),
        {},
      );
      const defaultTranslation = translations[defaultLanguage];
      const defaultVariables = new Set(
        typeof defaultTranslation?.value === "string"
          ? (defaultTranslation.value.match(/{{[^}]+}}/g)?.slice() ?? [])
          : [],
      );
      const defaultComponents = new Set(
        typeof defaultTranslation?.value === "string"
          ? (defaultTranslation.value.match(/<[^>]+>/g)?.slice() ?? [])
          : [],
      );
      for (const [language, translation] of Object.entries(translations))
        if (!translation.value) continue;
        else {
          const variables = new Set(
            typeof translation.value === "string"
              ? (translation.value.match(/{{[^}]+}}/g)?.slice() ?? [])
              : [],
          );
          const components = new Set(
            typeof translation.value === "string"
              ? (translation.value.match(/<[^>]+>/g)?.slice() ?? [])
              : [],
          );
          if (variables.symmetricDifference(defaultVariables).size > 0)
            translation.warnings.push(TranslationWarning.VariableMismatch);
          if (components.symmetricDifference(defaultComponents).size > 0)
            translation.warnings.push(TranslationWarning.ComponentMismatch);
          if (
            language !== defaultLanguage &&
            translation.value === defaultTranslation?.value
          )
            translation.warnings.push(TranslationWarning.Identical);
          if (
            language !== defaultLanguage &&
            typeof defaultTranslation?.value === "string" &&
            typeof translation.value === "string" &&
            translation.value &&
            translation.value.split("\n").length !==
              defaultTranslation.value.split("\n").length
          )
            translation.warnings.push(TranslationWarning.LineMismatch);
        }

      forest.push({
        k,
        kFormatted,
        usage: usage[kFormatted.replace(/_.*/, "")] ?? 0,
        translations,
      });
    }
  }
  return forest;
};
