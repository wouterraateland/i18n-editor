import { TranslationWarning } from "app/utils";
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
          translations[language]?.warnings.includes(
            TranslationWarning.Identical,
          ),
        );
      case "line-mismatch":
        return visibleLanguages.some((language) =>
          translations[language]?.warnings.includes(
            TranslationWarning.LineMismatch,
          ),
        );
      case "variable-mismatch":
        return visibleLanguages.some((language) =>
          translations[language]?.warnings.includes(
            TranslationWarning.VariableMismatch,
          ),
        );
      case "component-mismatch":
        return visibleLanguages.some((language) =>
          translations[language]?.warnings.includes(
            TranslationWarning.ComponentMismatch,
          ),
        );
    }
    return true;
  });
}
