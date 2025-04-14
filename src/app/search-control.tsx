"use client";

import IconLoop from "components/icons/loop";
import Input from "components/ui/input";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { applySearchParams } from "utils/urls";

export default function SearchControl() {
  const searchParams = useSearchParams();
  const searchValue = searchParams.get("search") ?? "";
  const [value, setValue] = useState(searchValue);

  useEffect(() => {
    const t = setTimeout(() => {
      applySearchParams({ search: value }, window.location.search);
    }, 300);
    return () => {
      clearTimeout(t);
    };
  }, [searchValue, value]);

  return (
    <Input
      before={<IconLoop className="text-weak m-2 ml-3" />}
      className="min-w-0 grow"
      onChange={(event) => {
        setValue(event.target.value);
      }}
      placeholder="Search keys"
      size="sm"
      type="search"
      value={value}
    />
  );
}
