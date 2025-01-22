"use client";

import {
  i18nGetUsage,
  i18nOrganize,
  i18nRemoveKey,
  i18nRenameKey,
  i18nUpdateKey,
} from "app/actions";
import IconBin from "components/icons/bin";
import IconPen from "components/icons/pen";
import LoadingState from "components/loading-state";
import Button from "components/ui/button";
import CopyButton from "components/ui/copy-button";
import Input from "components/ui/input";
import useStore from "hooks/use-store";
import { Fragment, useDeferredValue, useEffect, useState } from "react";
import { createStore } from "utils/stores";

const localesStore =
  createStore(
    Array<{
      language: string;
      data: Record<string, unknown>;
    }>(),
  );
const usageStore = createStore({} as Record<string, number>);

const countLeafs = (obj: Record<string, unknown>): number => {
  let count = 0;

  for (const key in obj)
    if (typeof obj[key] === "object" && obj[key] !== null)
      count += countLeafs(obj[key] as Record<string, unknown>);
    else count++;

  return count;
};

const unformatKey = (key: string | null) => {
  if (!key) return "";
  if (!key.includes(":")) return `translation.${key}`;
  return key.replace(":", ".");
};

function Leaf({
  k,
  query,
  value,
}: {
  k: string;
  query: string;
  value: unknown;
}) {
  const kFormatted = k.replace(".", ":").replace("translation:", "");
  const usage = useStore(
    usageStore,
    (s) => s[kFormatted.replace(/_.*/, "")] ?? 0,
  );
  if (
    query &&
    !`"${kFormatted}"`.includes(query) &&
    !`"${value}"`.includes(query)
  )
    return null;
  return (
    <div className="flex flex-wrap gap-1 rounded-md p-1 even:theme-background">
      <div className="flex min-w-0 items-start gap-1">
        <Button
          className="flex-shrink-0 text-error"
          iconLeft={<IconBin />}
          onClick={() => i18nRemoveKey(k).then(localesStore.set)}
          size="xs"
          type="button"
        />
        <Button
          className="flex-shrink-0"
          iconLeft={<IconPen />}
          onClick={() =>
            i18nRenameKey(
              unformatKey(kFormatted),
              unformatKey(prompt(`Rename ${kFormatted}`, kFormatted)),
            ).then(localesStore.set)
          }
          size="xs"
          type="button"
        />
        <pre className="min-w-0">
          {kFormatted}
          <CopyButton size="xs" text={kFormatted} />
        </pre>
      </div>
      <div className="ml-auto flex min-w-0 justify-end gap-1">
        <p className="min-w-0">
          {typeof value === "string" ? value : JSON.stringify(value)}
        </p>
        {typeof value === "string" && (
          <Button
            className="flex-shrink-0"
            iconLeft={<IconPen />}
            onClick={async () => {
              const newValue = prompt(`Value for ${kFormatted}`, value);
              if (!newValue) return;
              await i18nUpdateKey(unformatKey(kFormatted), newValue).then(
                localesStore.set,
              );
            }}
            size="xs"
            type="button"
          />
        )}
        <p className="px-2">{usage}x</p>
      </div>
    </div>
  );
}

function Tree({
  data,
  prefix,
  query,
}: {
  data: Record<string, unknown>;
  prefix: string;
  query: string;
}) {
  return Object.entries(data).map(([key, value]) => {
    const currentKey = `${prefix}${key}`;
    return typeof value === "object" && !Array.isArray(value) ? (
      <Fragment key={key}>
        <Leaf k={currentKey} query={query} value={undefined} />
        <Tree
          data={value as Record<string, unknown>}
          prefix={`${currentKey}.`}
          query={query}
        />
      </Fragment>
    ) : (
      <Leaf key={key} k={currentKey} query={query} value={data[key]} />
    );
  });
}

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
  useEffect(() => {
    localesStore.set(initialLocales);
    usageStore.set(initialUsage);
  }, [initialLocales, initialUsage]);

  const locales = useStore(localesStore);
  const defaultLocale = locales.find(({ language }) => language === "en-US");

  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);

  return (
    <>
      <div className="flex gap-2 p-2 theme-surface">
        <Input
          className="flex-grow"
          onChange={(event) => {
            setQuery(event.target.value);
          }}
          placeholder="Search"
          value={query}
        />
        <Button
          className="theme-primary"
          label="Organize translations"
          onClick={() => i18nOrganize().then(localesStore.set)}
          size="sm"
          type="button"
        />
        <Button
          className="theme-primary"
          label="Refresh usage"
          onClick={() => i18nGetUsage().then(usageStore.set)}
          size="sm"
          type="button"
        />
        <p className="px-2.5 py-1">
          {countLeafs(defaultLocale?.data ?? {})} strings
        </p>
      </div>
      {defaultLocale ? (
        <div className="min-h-0 min-w-0 flex-grow overflow-auto border-t p-2 theme-surface">
          <Tree data={defaultLocale.data} prefix="" query={deferredQuery} />
        </div>
      ) : (
        <LoadingState />
      )}
    </>
  );
}
