"use client";

import OrganizeButton from "app/organize-button";
import { sentenceCase } from "change-case";
import Select from "components/ui/select";
import TableControllerLanguageControl from "components/ui/table-controller/language-control";
import TableControllerRoot from "components/ui/table-controller/root";
import TableControllerSearchControl from "components/ui/table-controller/search-control";
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
    <TableControllerRoot>
      <TableControllerSearchControl placeholder="Search keys" />
      <Select
        className="bg-background"
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
        size="sm"
        value={status}
      />
      <TableControllerLanguageControl
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
    </TableControllerRoot>
  );
}
