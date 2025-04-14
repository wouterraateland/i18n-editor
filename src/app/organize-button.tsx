"use client";

import { organizeLocales } from "app/actions";
import Button from "components/ui/button";
import { queryCacheSet } from "utils/fetchers";

export default function OrganizeButton() {
  return (
    <Button
      label="Organize"
      onClick={async () => {
        queryCacheSet("locales", await organizeLocales());
      }}
      outline
      size="sm"
      type="button"
    />
  );
}
