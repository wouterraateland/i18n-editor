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

export default function LanguageControl({
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
        <div className="space-y-1 p-1">
          <SortableList
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
                    className="group bg-background text-weak hover:bg-divider hover:text-text data-[state=checked]:text-surface data-[state=checked]:ring-info flex size-4 shrink-0 items-center justify-center rounded-md text-xs ring-1 ring-current outline-offset-2 transition-all ring-inset focus:outline data-[state=checked]:ring-8"
                    data-state={
                      languages.includes(item.id) ? "checked" : "unchecked"
                    }
                  >
                    <IconCheck className="stroke-[5px] group-data-[state=unchecked]:hidden" />
                  </div>
                }
                label={item.label}
                labelClassName="grow text-left"
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
        </div>
        <div className="theme-surface border-divider sticky bottom-0 flex gap-1 border-t p-1">
          <Button
            className="grow"
            label="None"
            onClick={() => {
              applySearchParams({ languages: [] }, window.location.search);
            }}
            outline
            size="sm"
            type="button"
          />
          <Button
            className="grow"
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
