import type { Forest } from "utils/trees";
import { forestFilter } from "utils/trees";

export default function useFiltered(
  forest: Forest,
  search: string,
  status: string,
  visibleLanguages: Array<string>,
) {
  return forestFilter(forest, (node) => {
    if (!node.kFormatted.includes(search)) return false;
    const { translations } = node;
    if (!translations) return true;

    switch (status) {
      case "translated":
        return visibleLanguages.every(
          (language) => translations[language]?.value,
        );
      case "untranslated":
        return visibleLanguages.some(
          (language) => !translations[language]?.value,
        );
      case "mismatch":
        return visibleLanguages.some(
          (language) => translations[language]?.warnings.length,
        );
      case "unused":
        return !node.usage;
      case "identical":
        return visibleLanguages.some((language) =>
          translations[language]?.warnings.includes("Identical"),
        );
      case "line-mismatch":
        return visibleLanguages.some((language) =>
          translations[language]?.warnings.includes("Line mismatch"),
        );
      case "variable-mismatch":
        return visibleLanguages.some((language) =>
          translations[language]?.warnings.includes("Variable mismatch"),
        );
      case "component-mismatch":
        return visibleLanguages.some((language) =>
          translations[language]?.warnings.includes("Component mismatch"),
        );
    }
    return true;
  });
}
