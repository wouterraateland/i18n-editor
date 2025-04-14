"use client";

import { deleteI18nKey, updateI18nKey, updateI18nValues } from "app/actions";
import { unformatKey } from "app/utils";
import clsx from "clsx";
import IconBin from "components/icons/bin";
import IconPen from "components/icons/pen";
import IconSparkle from "components/icons/sparkle";
import Button from "components/ui/button";
import CopyButton from "components/ui/copy-button";
import { queryCacheSet } from "utils/fetchers";
import { translateStrings } from "utils/translations";
import type { Tree } from "utils/trees";

export default function EditorRow({
  defaultLanguage,
  languages,
  row,
}: {
  defaultLanguage: string;
  languages: Array<string>;
  row: Tree;
}) {
  if ("translations" in row)
    return (
      <>
        <div
          className="group/row theme-surface ring-divider sticky left-0 z-10 flex items-start gap-1 p-1 ring"
          style={{ gridColumnStart: "key" }}
        >
          <div className="flex grow items-center gap-1">
            <pre className="px-1.5">{row.k[row.k.length - 1]}</pre>
            <div
              className={clsx(
                "rounded-md px-1 text-xs font-bold",
                row.usage === 0 ? "theme-background" : "theme-info-container",
              )}
            >
              {row.usage}x
            </div>
          </div>
          <CopyButton
            className="shrink-0 opacity-0 group-focus-within/row:opacity-100 group-hover/row:opacity-100"
            size="xs"
            text={row.kFormatted}
          />
          <Button
            className="text-error shrink-0 opacity-0 group-focus-within/row:opacity-100 group-hover/row:opacity-100"
            iconLeft={<IconBin />}
            onClick={async () => {
              queryCacheSet("locales", await deleteI18nKey(row.k));
            }}
            size="xs"
            type="button"
          />
          <Button
            className="shrink-0 opacity-0 group-focus-within/row:opacity-100 group-hover/row:opacity-100"
            iconLeft={
              <IconPen className="text-weak group-hover/button:text-text" />
            }
            onClick={async () => {
              const key = unformatKey(
                prompt(`Rename ${row.kFormatted}`, row.kFormatted),
              );
              if (!key) return;
              queryCacheSet("locales", await updateI18nKey(row.k, key));
            }}
            size="xs"
            type="button"
          />
          <Button
            className="text-error shrink-0 opacity-0 group-focus-within/row:opacity-100 group-hover/row:opacity-100"
            iconLeft={
              <IconSparkle className="text-weak group-hover/button:text-text" />
            }
            onClick={async () => {
              const translations = Array<{
                key: Array<string>;
                language: string;
                value: string;
              }>();
              for (const language of languages) {
                if (language === defaultLanguage) continue;
                if (row.translations?.[language]?.value) continue;

                translations.push({
                  key: row.k,
                  language,
                  value: await translateStrings(
                    [row.translations?.[defaultLanguage]?.value as string],
                    defaultLanguage,
                    language,
                  ).then((translations) => translations[0] ?? ""),
                });
              }
              if (translations.length === 0) return;
              queryCacheSet("locales", await updateI18nValues(translations));
            }}
            size="xs"
            title="Translate"
            type="button"
          />
        </div>
        {languages.map((language) => {
          const translation = row.translations?.[language];
          const value =
            typeof translation?.value === "string"
              ? translation.value
              : JSON.stringify(translation?.value);

          return (
            <textarea
              key={language}
              className={clsx(
                "hover:bg-divider ring-divider [field-sizing:content] min-w-64 resize-none px-2.5 py-1 ring",
                !translation?.value
                  ? "theme-error-container"
                  : translation.warnings.length > 0
                    ? "theme-warning-container"
                    : "theme-background",
              )}
              defaultValue={value}
              onBlur={async (event) => {
                if (event.target.value === translation?.value) return;
                queryCacheSet(
                  "locales",
                  await updateI18nValues([
                    { key: row.k, language, value: event.target.value },
                  ]),
                );
              }}
              style={{ gridColumnStart: language }}
            />
          );
        })}
      </>
    );

  return (
    <div className="col-span-full grid grid-cols-subgrid gap-px">
      <div
        className="theme-background ring-divider sticky col-span-full flex ring"
        style={{
          top: `${row.k.length * 2}rem`,
          paddingLeft: `${Math.max(0, row.k.length - 2)}rem`,
          zIndex: 20 - row.k.length,
        }}
      >
        <pre className="text-weak sticky left-0 px-2.5 py-1">
          {row.k.length > 1 && "└ "}
          {row.k[row.k.length - 1]}
        </pre>
      </div>
      {"children" in row &&
        row.children.map((child) => (
          <EditorRow
            key={child.kFormatted}
            defaultLanguage={defaultLanguage}
            languages={languages}
            row={child}
          />
        ))}
    </div>
  );
}
