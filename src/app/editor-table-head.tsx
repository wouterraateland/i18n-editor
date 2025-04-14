import { getI18nUsage, updateI18nValues } from "app/actions";
import { sentenceCase } from "change-case";
import IconRandom from "components/icons/random";
import IconSparkle from "components/icons/sparkle";
import Button from "components/ui/button";
import { chunkBy } from "utils/arrays";
import { queryCacheSet } from "utils/fetchers";
import { translationMappings } from "utils/translation-mappings";
import { translateStrings } from "utils/translations";
import type { Forest } from "utils/trees";
import { forestFilter, forestFlatten } from "utils/trees";

export default function EditorTableHead({
  defaultLanguage,
  filtered,
  visibleLanguages,
}: {
  defaultLanguage: string;
  filtered: Forest;
  visibleLanguages: Array<string>;
}) {
  return (
    <>
      <div
        className="bg-surface sticky top-0 left-0 z-40 flex gap-1 p-1 ring"
        style={{ gridColumnStart: "key" }}
      >
        <p className="pl-1.5">Key</p>
        <Button
          iconLeft={<IconRandom />}
          layout="icon"
          onClick={async () => {
            queryCacheSet("usage", await getI18nUsage());
          }}
          size="xs"
          title="Refresh"
          type="button"
        />
      </div>
      {visibleLanguages.map((language) => (
        <div
          key={language}
          className="bg-surface sticky top-0 z-30 flex items-center gap-1 p-1 ring"
          style={{ gridColumnStart: language }}
        >
          <p className="pl-1.5">{sentenceCase(language)}</p>
          {translationMappings.some(
            (map) => map.from === defaultLanguage && map.to === language,
          ) && (
            <Button
              iconLeft={
                <IconSparkle className="text-weak group-hover/button:text-text" />
              }
              onClick={async () => {
                const nonTranslated = forestFilter(
                  filtered,
                  (node) =>
                    !("translations" in node) ||
                    !node.translations[language]?.value,
                );
                const rows = forestFlatten(nonTranslated).filter(
                  (row) =>
                    "translations" in row &&
                    typeof row.translations[defaultLanguage]?.value ===
                      "string",
                );
                for (const chunk of chunkBy(rows, 100)) {
                  const translations = await translateStrings(
                    chunk.map(
                      (row) =>
                        row.translations?.[defaultLanguage]?.value as string,
                    ),
                    defaultLanguage,
                    language,
                  );
                  queryCacheSet(
                    "locales",
                    await updateI18nValues(
                      chunk.map((row, i) => ({
                        key: row.k,
                        language,
                        value: translations[i] ?? "",
                      })),
                    ),
                  );
                }
              }}
              size="xs"
              title="Translate"
              type="button"
            />
          )}
        </div>
      ))}
    </>
  );
}
