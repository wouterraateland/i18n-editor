"use client";

import { arrayMove } from "@dnd-kit/sortable";
import IconCheck from "components/icons/check";
import IconColumns from "components/icons/columns";
import Button from "components/ui/button";
import {
  PopoverContent,
  PopoverRoot,
  PopoverTrigger,
} from "components/ui/popover";
import SortableList from "components/ui/sortable-list";
import { useSearchParams } from "next/navigation";
import { firstBy } from "thenby";
import { applySearchParams } from "utils/urls";

export default function TableControllerLanguageControl({
  defaultLanguages,
  options,
}: {
  defaultLanguages: Array<string>;
  options: Array<{ id: string; label: string }>;
}) {
  const searchParams = useSearchParams();

  const languages = searchParams.has("languages")
    ? searchParams.getAll("languages")
    : defaultLanguages;

  return (
    <PopoverRoot modal>
      <PopoverTrigger asChild>
        <Button
          iconLeft={
            <IconColumns className="text-weak group-hover/button:text-text" />
          }
          label="Languages"
          labelClassName="max-md:hidden"
          size="sm"
          type="button"
        />
      </PopoverTrigger>
      <PopoverContent>
        <SortableList
          className="divide-y-0 border-y-0 px-2 py-1 sm:pl-8"
          items={options
            .slice()
            .sort(
              firstBy((o) =>
                !languages.includes(o.id)
                  ? languages.length
                  : languages.indexOf(o.id),
              ),
            )}
          onMove={(active_id, over_id) => {
            applySearchParams(
              {
                languages: arrayMove(
                  languages,
                  languages.findIndex((row) => row === active_id),
                  languages.findIndex((row) => row === over_id),
                ),
              },
              window.location.search,
            );
          }}
          renderItem={(item) => (
            <Button
              key={item.id}
              className="w-full"
              disabled={languages.length === 1 && languages.includes(item.id)}
              iconLeft={
                <div
                  className="group flex size-4 flex-shrink-0 items-center justify-center rounded-md bg-background text-xs text-weak outline-offset-2 ring-1 ring-inset ring-current transition-all hover:bg-divider hover:text-text focus:outline data-[state=checked]:text-surface data-[state=checked]:ring-8 data-[state=checked]:ring-primary"
                  data-state={
                    languages.includes(item.id) ? "checked" : "unchecked"
                  }
                >
                  <IconCheck className="stroke-[5px] group-data-[state=unchecked]:hidden" />
                </div>
              }
              label={item.label}
              labelClassName="flex-grow text-left"
              onClick={() => {
                applySearchParams(
                  {
                    languages: languages.includes(item.id)
                      ? languages.filter((c) => c !== item.id)
                      : [...languages, item.id],
                  },
                  window.location.search,
                );
              }}
              size="sm"
              type="button"
            />
          )}
        />
        <div className="sticky bottom-0 flex gap-1 border-t p-1 theme-surface">
          <Button
            className="flex-grow"
            label="None"
            onClick={() => {
              applySearchParams({ languages: [] }, window.location.search);
            }}
            outline
            size="sm"
            type="button"
          />
          <Button
            className="flex-grow"
            label="All"
            onClick={() => {
              applySearchParams(
                { languages: options.map((option) => option.id) },
                window.location.search,
              );
            }}
            outline
            size="sm"
            type="button"
          />
        </div>
      </PopoverContent>
    </PopoverRoot>
  );
}
