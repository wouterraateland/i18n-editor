"use client";

import { arrayMove } from "@dnd-kit/sortable";
import { sentenceCase } from "change-case";
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

export default function TableControllerColumnControl({
  defaultColumns,
  options,
}: {
  defaultColumns: Array<string>;
  options: Array<{ id: string; label: string }> | Array<string>;
}) {
  const searchParams = useSearchParams();

  const columns = searchParams.has("columns")
    ? searchParams.getAll("columns")
    : defaultColumns;

  return (
    <PopoverRoot modal>
      <PopoverTrigger asChild>
        <Button
          iconLeft={
            <IconColumns className="text-weak group-hover/button:text-text" />
          }
          label="Columns"
          labelClassName="max-md:hidden"
          size="sm"
          type="button"
        />
      </PopoverTrigger>
      <PopoverContent>
        <SortableList
          className="divide-y-0 border-y-0 px-2 py-1 sm:pl-8"
          items={options
            .map((option) =>
              typeof option === "string"
                ? { id: option, label: sentenceCase(option) }
                : option,
            )
            .sort(
              firstBy((o) =>
                !columns.includes(o.id)
                  ? columns.length
                  : columns.indexOf(o.id),
              ),
            )}
          onMove={(active_id, over_id) => {
            applySearchParams(
              {
                columns: arrayMove(
                  columns,
                  columns.findIndex((row) => row === active_id),
                  columns.findIndex((row) => row === over_id),
                ),
              },
              window.location.search,
            );
          }}
          renderItem={(item) => (
            <Button
              key={item.id}
              className="w-full"
              disabled={columns.length === 1 && columns.includes(item.id)}
              iconLeft={
                <div
                  className="group flex size-4 flex-shrink-0 items-center justify-center rounded-md bg-background text-xs text-weak outline-offset-2 ring-1 ring-inset ring-current transition-all hover:bg-divider hover:text-text focus:outline data-[state=checked]:text-surface data-[state=checked]:ring-8 data-[state=checked]:ring-primary"
                  data-state={
                    columns.includes(item.id) ? "checked" : "unchecked"
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
                    columns: columns.includes(item.id)
                      ? columns.filter((c) => c !== item.id)
                      : [...columns, item.id],
                  },
                  window.location.search,
                );
              }}
              size="sm"
              type="button"
            />
          )}
        />
      </PopoverContent>
    </PopoverRoot>
  );
}
