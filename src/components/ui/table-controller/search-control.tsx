"use client";

import IconLoop from "components/icons/loop";
import AutoSavingInput from "components/ui/auto-saving-input";
import Input from "components/ui/input";
import { useSearchParams } from "next/navigation";
import { applySearchParams } from "utils/urls";

export default function TableControllerSearchControl({
  filter = "search",
  placeholder,
}: {
  filter?: string;
  placeholder: string;
}) {
  const searchParams = useSearchParams();

  return (
    <div className="-order-2 min-w-0 flex-grow">
      <AutoSavingInput
        indicatorPosition="none"
        onSave={(value) =>
          { applySearchParams({ [filter]: value }, window.location.search); }
        }
        render={({ onChange, ...props }) => (
          <Input
            {...props}
            before={<IconLoop className="m-2 ml-3 text-weak" />}
            onChange={(event) => { onChange(event.target.value); }}
            placeholder={placeholder}
            size="sm"
            type="search"
          />
        )}
        saveDelay={300}
        value={searchParams.get("search") ?? ""}
      />
    </div>
  );
}
