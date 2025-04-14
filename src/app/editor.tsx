"use client";

import { getI18nUsage, loadLocales } from "app/actions";
import EditorHeader from "app/editor-header";
import EditorRow from "app/editor-row";
import EditorTableHead from "app/editor-table-head";
import useFiltered from "app/use-filtered";
import useForest from "app/use-forest";
import { useQuery } from "hooks/use-query";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";

const defaultLanguage = process.env.NEXT_PUBLIC_DEFAULT_LANGUAGE!;

export default function Editor() {
  const usage = useQuery("usage", getI18nUsage);
  const locales = useQuery("locales", loadLocales);

  const languages = useMemo(
    () =>
      locales
        .map(({ language }) => language)
        .sort((a, b) =>
          a === defaultLanguage
            ? -1
            : b === defaultLanguage
              ? 1
              : a.localeCompare(b),
        ),
    [locales],
  );

  const forest = useForest(defaultLanguage, languages, locales, usage);

  const searchParams = useSearchParams();
  const visibleLanguages = searchParams.has("languages")
    ? searchParams
        .getAll("languages")
        .filter((language) => languages.includes(language))
    : [defaultLanguage];
  const search = searchParams.get("search") ?? "";
  const status = searchParams.get("status") || "all";
  const filtered = useFiltered(forest, search, status, visibleLanguages);

  return (
    <>
      <EditorHeader
        defaultLanguage={defaultLanguage}
        filtered={filtered}
        forest={forest}
        languages={languages}
      />
      <div
        className="border-divider grid min-h-0 min-w-0 gap-px overflow-auto border-b"
        style={{
          gridTemplateColumns: `[key] max-content ${visibleLanguages
            .map((column) => `[${column}] minmax(min-content, 1fr)`)
            .join(" ")}`,
        }}
      >
        <EditorTableHead
          defaultLanguage={defaultLanguage}
          filtered={filtered}
          visibleLanguages={visibleLanguages}
        />
        {filtered.map((tree) => (
          <EditorRow
            key={tree.kFormatted}
            defaultLanguage={defaultLanguage}
            languages={visibleLanguages}
            row={tree}
          />
        ))}
      </div>
    </>
  );
}
