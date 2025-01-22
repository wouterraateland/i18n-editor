"use client";

import {
  deleteI18nKey,
  getI18nUsage,
  organizeLocales,
  updateI18nKey,
  updateI18nValue,
} from "app/actions";
import { sentenceCase } from "change-case";
import clsx from "clsx";
import IconBin from "components/icons/bin";
import IconPen from "components/icons/pen";
import IconRandom from "components/icons/random";
import Button from "components/ui/button";
import CopyButton from "components/ui/copy-button";
import TableControllerColumnControl from "components/ui/table-controller/column-control";
import TableControllerRoot from "components/ui/table-controller/root";
import TableControllerSearchControl from "components/ui/table-controller/search-control";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

const unformatKey = (key: string | null) => {
  if (!key) return "";
  if (!key.includes(":")) return `translation.${key}`;
  return key.replace(":", ".");
};

type TRow = {
  k: string;
  kFormatted: string;
  usage: number | null;
  translations: Array<{ language: string; value: unknown }>;
};

function Row({
  languages,
  row,
  setLocales,
}: {
  languages: Array<string>;
  row: TRow;
  setLocales: (
    locales: Array<{ data: Record<string, unknown>; language: string }>,
  ) => void;
}) {
  return (
    <>
      {row.usage === null ? (
        <div
          className="sticky z-20 col-span-full flex ring theme-background"
          style={{ top: `${row.k.split(".").length * 2}rem` }}
        >
          <pre className="sticky left-0 px-2.5 py-1 font-bold">
            {row.k.split(".").pop()}
          </pre>
        </div>
      ) : (
        <>
          <div
            className="group/row sticky left-0 z-10 flex items-start gap-1 p-1 ring theme-surface"
            style={{ gridColumnStart: "key" }}
          >
            <div className="flex flex-grow items-center gap-1">
              <pre className="px-1.5">{row.k.split(".").pop()}</pre>
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
              className="opacity-0 group-hover/row:opacity-100"
              size="xs"
              text={row.kFormatted}
            />
            <Button
              className="text-error opacity-0 group-hover/row:opacity-100"
              iconLeft={<IconBin />}
              onClick={() => deleteI18nKey(row.k).then(setLocales)}
              size="xs"
              type="button"
            />
            <Button
              className="opacity-0 group-hover/row:opacity-100"
              iconLeft={
                <IconPen className="text-weak group-hover/button:text-text" />
              }
              onClick={async () => {
                const key = unformatKey(
                  prompt(`Rename ${row.kFormatted}`, row.kFormatted),
                );
                if (!key) return;
                await updateI18nKey(row.k, key).then(setLocales);
              }}
              size="xs"
              type="button"
            />
          </div>
          {row.translations
            .filter(({ language }) => languages.includes(language))
            .map(({ language, value }) => (
              <button
                key={language}
                className={clsx(
                  "max-w-sm px-2.5 py-1 text-left align-top ring hover:bg-divider",
                  value ? "theme-background" : "theme-error-container",
                )}
                onClick={async () => {
                  const newValue = prompt(
                    `${row.kFormatted} in ${language}`,
                    typeof value === "string" ? value : JSON.stringify(value),
                  );
                  if (!newValue) return;
                  await updateI18nValue(row.k, language, newValue).then(
                    setLocales,
                  );
                }}
                style={{ gridColumnStart: language }}
                type="button"
              >
                {typeof value === "string" ? value : JSON.stringify(value)}
              </button>
            ))}
        </>
      )}
    </>
  );
}

export default function Editor({
  initialLocales,
  initialUsage,
}: {
  initialLocales: Array<{
    data: Record<string, unknown>;
    language: string;
  }>;
  initialUsage: Record<string, number>;
}) {
  const [usage, setUsage] = useState(initialUsage);
  const [locales, setLocales] = useState(initialLocales);

  const rows = useMemo(() => {
    const rows = new Array<TRow>();

    const traverseLocales = (
      slices: Array<{
        data: Record<string, unknown> | undefined;
        language: string;
      }>,
      prefix: string,
    ) => {
      const obj = slices.find(
        ({ language }) => language === process.env.NEXT_PUBLIC_DEFAULT_LANGUAGE,
      )?.data;
      if (!obj) return;

      for (const key in obj) {
        const k = `${prefix}${key}`;
        const kFormatted = k.replace(".", ":").replace("translation:", "");

        if (
          typeof obj[key] === "object" &&
          obj[key] !== null &&
          !Array.isArray(obj[key])
        ) {
          rows.push({
            k,
            kFormatted,
            usage: null,
            translations: slices
              .map(({ language }) => ({ language, value: null }))
              .sort((a, b) =>
                a.language === process.env.NEXT_PUBLIC_DEFAULT_LANGUAGE
                  ? -1
                  : b.language === process.env.NEXT_PUBLIC_DEFAULT_LANGUAGE
                    ? 1
                    : a.language.localeCompare(b.language),
              ),
          });
          traverseLocales(
            slices.map(({ data, language }) => ({
              data: data?.[key] as Record<string, unknown> | undefined,
              language,
            })),
            `${prefix}${key}.`,
          );
        } else
          rows.push({
            k,
            kFormatted,
            usage: usage[kFormatted.replace(/_.*/, "")] ?? 0,
            translations: slices
              .map(({ data, language }) => ({
                language,
                value: data?.[key] ?? "",
              }))
              .sort((a, b) =>
                a.language === process.env.NEXT_PUBLIC_DEFAULT_LANGUAGE
                  ? -1
                  : b.language === process.env.NEXT_PUBLIC_DEFAULT_LANGUAGE
                    ? 1
                    : a.language.localeCompare(b.language),
              ),
          });
      }
    };
    traverseLocales(locales, "");

    return rows;
  }, [locales, usage]);

  const languages = initialLocales
    .map(({ language }) => language)
    .sort((a, b) =>
      a === process.env.NEXT_PUBLIC_DEFAULT_LANGUAGE
        ? -1
        : b === process.env.NEXT_PUBLIC_DEFAULT_LANGUAGE
          ? 1
          : a.localeCompare(b),
    );

  const searchParams = useSearchParams();
  const columns = searchParams.has("columns")
    ? searchParams
        .getAll("columns")
        .filter((column) => languages.includes(column))
    : languages;

  const query = searchParams.get("query") ?? "";
  const visibleRows = rows.filter((row) => row.kFormatted.includes(query));

  return (
    <>
      <TableControllerRoot>
        <TableControllerSearchControl placeholder="Search keys" />
        <TableControllerColumnControl
          defaultColumns={languages}
          options={languages.map((id) => ({ id, label: sentenceCase(id) }))}
        />
        <p className="px-2.5 py-1">
          {visibleRows.length < rows.length
            ? `${visibleRows.length} / ${rows.length}`
            : rows.length}{" "}
          keys
        </p>
        <Button
          label="Organize"
          onClick={() => organizeLocales().then(setLocales)}
          outline
          size="sm"
          type="button"
        />
      </TableControllerRoot>
      <div
        className="grid min-h-0 min-w-0 flex-grow gap-px overflow-auto border-t theme-surface"
        style={{
          gridTemplateColumns: ["key", ...columns]
            .map((column) => `[${column}] max-content`)
            .join(" "),
        }}
      >
        <div
          className="sticky left-0 top-0 z-20 flex gap-1 bg-surface p-1 text-weak ring"
          style={{ gridColumnStart: "key" }}
        >
          <p className="px-1.5">Key</p>
          <Button
            iconLeft={<IconRandom />}
            layout="icon"
            onClick={() => getI18nUsage().then(setUsage)}
            size="xs"
            title="Refresh"
            type="button"
          />
        </div>
        {columns.map((language) => (
          <div
            key={language}
            className="sticky top-0 z-10 bg-surface px-2.5 py-1 text-weak ring"
            style={{ gridColumnStart: language }}
          >
            {language}
          </div>
        ))}
        {visibleRows.map((row) => (
          <Row
            key={row.k}
            languages={columns}
            row={row}
            setLocales={setLocales}
          />
        ))}
      </div>
    </>
  );
}
