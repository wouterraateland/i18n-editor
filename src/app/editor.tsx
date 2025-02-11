"use client";

import {
  deleteI18nKey,
  getI18nUsage,
  organizeLocales,
  updateI18nKey,
  updateI18nValues,
} from "app/actions";
import { sentenceCase } from "change-case";
import clsx from "clsx";
import IconBin from "components/icons/bin";
import IconPen from "components/icons/pen";
import IconRandom from "components/icons/random";
import IconSparkle from "components/icons/sparkle";
import Button from "components/ui/button";
import CopyButton from "components/ui/copy-button";
import TableControllerColumnControl from "components/ui/table-controller/column-control";
import TableControllerRoot from "components/ui/table-controller/root";
import TableControllerSearchControl from "components/ui/table-controller/search-control";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { chunkBy } from "utils/arrays";
import { deepLTranslate } from "utils/deepl";
import type { Forest, Tree } from "utils/trees";
import { forestCount, forestFilter, forestFlatten } from "utils/trees";

const defaultLanguage = process.env.NEXT_PUBLIC_DEFAULT_LANGUAGE!;

const unformatKey = (key: string | null) => {
  if (!key) return "";
  if (!key.includes(":")) return `translation.${key}`;
  return key.replace(":", ".");
};

function Row({
  languages,
  row,
  setLocales,
}: {
  languages: Array<string>;
  row: Tree;
  setLocales: (
    locales: Array<{ data: Record<string, unknown>; language: string }>,
  ) => void;
}) {
  if ("value" in row) {
    const defaultValue = row.value[defaultLanguage];
    const defaultVariables = new Set(
      typeof defaultValue === "string"
        ? (defaultValue.match(/{{[^}]+}}/g)?.slice() ?? [])
        : [],
    );

    return (
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
        {languages.map((language) => {
          const value = row.value?.[language];
          const variables = new Set(
            typeof value === "string"
              ? (value.match(/{{[^}]+}}/g)?.slice() ?? [])
              : [],
          );

          return (
            <button
              key={language}
              className={clsx(
                "px-2.5 py-1 text-left align-top ring hover:bg-divider",
                value
                  ? // @ts-expect-error Symmetric difference is not defined
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
                    variables.symmetricDifference(defaultVariables).size > 0
                    ? "theme-warning-container"
                    : "theme-background"
                  : "theme-error-container",
              )}
              onClick={async () => {
                const newValue = prompt(
                  `${row.kFormatted} in ${language}`,
                  typeof value === "string" ? value : JSON.stringify(value),
                );
                if (newValue === null) return;
                await updateI18nValues([
                  { key: row.k, language, value: newValue },
                ]).then(setLocales);
              }}
              style={{ gridColumnStart: language }}
              type="button"
            >
              {typeof value === "string" ? value : JSON.stringify(value)}
            </button>
          );
        })}
      </>
    );
  }

  const parts = row.k.split(".");

  return (
    <div className="col-span-full grid grid-cols-subgrid gap-px">
      <div
        className="sticky col-span-full flex ring theme-background"
        style={{
          top: `${parts.length * 2}rem`,
          paddingLeft: `${Math.max(0, parts.length - 2)}rem`,
          zIndex: 20 - parts.length,
        }}
      >
        <pre className="sticky left-0 px-2.5 py-1 text-weak">
          {parts.length > 1 && "└ "}
          {parts.pop()}
        </pre>
      </div>
      {"children" in row &&
        row.children.map((child) => (
          <Row
            key={child.k}
            languages={languages}
            row={child}
            setLocales={setLocales}
          />
        ))}
    </div>
  );
}

const traverseLocales = (
  slices: Array<{
    data: Record<string, unknown> | undefined;
    language: string;
  }>,
  prefix: string,
  usage: Record<string, number>,
): Forest => {
  const forest = new Array<Tree>();
  const obj = slices.find(({ language }) => language === defaultLanguage)?.data;
  if (!obj) return forest;

  for (const key in obj) {
    const k = `${prefix}${key}`;
    const kFormatted = k.replace(".", ":").replace("translation:", "");

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
          `${prefix}${key}.`,
          usage,
        ),
      });
    else
      forest.push({
        k,
        kFormatted,
        usage: usage[kFormatted.replace(/_.*/, "")] ?? 0,
        value: slices.reduce<Record<string, unknown>>(
          (acc, { data, language }) => ({
            ...acc,
            [language]: data?.[key] ?? "",
          }),
          {},
        ),
      });
  }
  return forest;
};

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

  const languages = useMemo(
    () =>
      initialLocales
        .map(({ language }) => language)
        .sort((a, b) =>
          a === defaultLanguage
            ? -1
            : b === defaultLanguage
              ? 1
              : a.localeCompare(b),
        ),
    [initialLocales],
  );

  const forest = useMemo(() => {
    const forest = traverseLocales(locales, "", usage);

    const emptyValue = languages.reduce<Record<string, string>>(
      (acc, language) => ({
        ...acc,
        [language]: "",
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
          const next = {
            k: unformatKey(part),
            kFormatted: part,
            children: [],
          };
          current.push(next);
          current = next.children;
        } else if ("children" in node) current = node.children;
        else continue outer;
      }
      if (
        !current.some((tree) => tree.kFormatted.replace(/_.*/, "") === lastPart)
      )
        current.push({
          k: unformatKey(lastPart),
          kFormatted: lastPart,
          usage: usage[lastPart] ?? 0,
          value: { ...emptyValue },
        });
    }

    return forest;
  }, [languages, locales, usage]);

  const searchParams = useSearchParams();
  const columns = searchParams.has("columns")
    ? searchParams
        .getAll("columns")
        .filter((column) => languages.includes(column))
    : [defaultLanguage];

  const search = searchParams.get("search") ?? "";
  const filtered = forestFilter(
    forest,
    (node) =>
      node.kFormatted.includes(search) &&
      (!("value" in node) || !node.value["it-IT"]),
  );
  const totalCount = forestCount(forest);
  const filteredCount = forestCount(filtered);

  return (
    <>
      <TableControllerRoot>
        <TableControllerSearchControl placeholder="Search keys" />
        <TableControllerColumnControl
          defaultColumns={[defaultLanguage]}
          options={languages.map((id) => ({ id, label: sentenceCase(id) }))}
        />
        <p className="px-2.5 py-1">
          {filteredCount < totalCount
            ? `${filteredCount} / ${totalCount}`
            : totalCount}{" "}
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
        className="grid min-h-0 min-w-0 gap-px overflow-auto border-b"
        style={{
          gridTemplateColumns: ["key", ...columns]
            .map((column) => `[${column}] minmax(min-content, 1fr)`)
            .join(" "),
        }}
      >
        <div
          className="sticky left-0 top-0 z-40 flex gap-1 bg-surface p-1 ring"
          style={{ gridColumnStart: "key" }}
        >
          <p className="pl-1.5">Key</p>
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
            className="sticky top-0 z-30 flex items-center gap-1 bg-surface p-1 ring"
            style={{ gridColumnStart: language }}
          >
            <p className="pl-1.5">{sentenceCase(language)}</p>
            <Button
              iconLeft={
                <IconSparkle className="text-weak group-hover/button:text-text" />
              }
              onClick={async () => {
                const nonTranslated = forestFilter(
                  filtered,
                  (node) => !("value" in node) || !node.value[language],
                );
                const rows = forestFlatten(nonTranslated).filter(
                  (row) =>
                    "value" in row &&
                    typeof row.value[defaultLanguage] === "string",
                );
                for (const chunk of chunkBy(rows, 100)) {
                  const translations = await deepLTranslate(
                    chunk.map((row) => row.value?.[defaultLanguage] as string),
                    language,
                  );
                  await updateI18nValues(
                    chunk.map((row, i) => ({
                      key: row.k,
                      language,
                      value: translations[i] ?? "",
                    })),
                  ).then(setLocales);
                }
              }}
              size="xs"
              title="Translate"
              type="button"
            />
          </div>
        ))}
        {filtered.map((tree) => (
          <Row
            key={tree.k}
            languages={columns}
            row={tree}
            setLocales={setLocales}
          />
        ))}
      </div>
    </>
  );
}
