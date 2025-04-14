"use client";

import LanguageControl from "app/language-control";
import OrganizeButton from "app/organize-button";
import SearchControl from "app/search-control";
import { sentenceCase } from "change-case";
import Select from "components/ui/select";
import { useSearchParams } from "next/navigation";
import type { Forest } from "utils/trees";
import { forestCount } from "utils/trees";
import { applySearchParams } from "utils/urls";

export default function EditorHeader({
  defaultLanguage,
  filtered,
  forest,
  languages,
}: {
  defaultLanguage: string;
  filtered: Forest;
  forest: Forest;
  languages: Array<string>;
}) {
  const searchParams = useSearchParams();
  const status = searchParams.get("status") || "all";
  const totalCount = forestCount(forest);
  const filteredCount = forestCount(filtered);

  return (
    <div className="border-divider theme-surface relative z-10 flex gap-1 border-b p-1 print:hidden">
      <SearchControl />
      <Select
        onChange={(status) => {
          applySearchParams({ status }, window.location.search);
        }}
        options={[
          { label: "All", value: "all" },
          { label: "Unused", value: "unused" },
          { label: "Translated", value: "translated" },
          { label: "Untranslated", value: "untranslated" },
          { label: "Any mismatch", value: "mismatch" },
          { label: "Component mismatch", value: "component-mismatch" },
          { label: "Variable mismatch", value: "variable-mismatch" },
          { label: "Line mismatch", value: "line-mismatch" },
          { label: "Identical", value: "identical" },
        ]}
        value={status}
      />
      <LanguageControl
        defaultLanguages={[defaultLanguage]}
        options={languages.map((id) => ({ id, label: sentenceCase(id) }))}
      />
      <p className="px-2.5 py-1">
        {filteredCount < totalCount
          ? `${filteredCount} / ${totalCount}`
          : totalCount}{" "}
        keys
      </p>
      <OrganizeButton />
    </div>
  );
}
