"use server";

import type { Locale, Usage } from "app/utils";
import { readdir, readFile, stat, writeFile } from "fs/promises";
import path from "path";

const sortObject = <T>(obj: T): T => {
  if (Array.isArray(obj)) return obj.map(sortObject) as T;
  if (typeof obj !== "object" || obj === null) return obj;

  return Object.fromEntries(
    Object.entries(obj)
      .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
      .map(([key, value]) => [key, sortObject(value)]),
  ) as T;
};

const removeEmpty = <T>(obj: T): T => {
  if (Array.isArray(obj)) return obj.map(removeEmpty) as T;
  if (typeof obj !== "object" || obj === null) return obj;

  return Object.fromEntries(
    Object.entries(obj).flatMap(([key, value]) => {
      const newValue = removeEmpty(value) as T[keyof T];
      return typeof newValue === "object" &&
        newValue !== null &&
        !Array.isArray(newValue) &&
        Object.keys(newValue).length === 0
        ? []
        : [[key, newValue]];
    }),
  ) as T;
};

export const loadLocales = async () => {
  const files = await readdir(process.env.LOCALE_DIR ?? "");
  const localeFiles = files.filter((file) => file.endsWith(".json"));

  return await Promise.all(
    localeFiles.map(async (file) => {
      const data = JSON.parse(
        await readFile(path.join(process.env.LOCALE_DIR ?? "", file), "utf-8"),
      ) as Record<string, unknown>;
      return { language: file.replace(".json", ""), data };
    }),
  );
};

export const getI18nUsage = async () => {
  const locales = await loadLocales();
  const defaultLocale = locales.find(
    ({ language }) => language === process.env.NEXT_PUBLIC_DEFAULT_LANGUAGE,
  );
  if (!defaultLocale) return {};

  const usage: Usage = {};
  const tRegex =
    /\Wt\("[a-z0-9-_:.]+"|\WtLocalized\("[a-z0-9-_:.]+"|i18nKey="[a-z0-9-_:.]+"/g;

  const traverseFiles = async (folderPath: string) => {
    try {
      const files = await readdir(folderPath);

      for (const file of files) {
        const filePath = path.join(folderPath, file);
        const stats = await stat(filePath);

        if (stats.isDirectory()) await traverseFiles(filePath);
        else if (file.endsWith(".ts") || file.endsWith(".tsx")) {
          const content = await readFile(filePath, "utf8");
          const matches =
            content.match(tRegex)?.map((match) =>
              match
                .replace(/\Wt\("/, "")
                .replace(/\WtLocalized\("/, "")
                .replace('i18nKey="', "")
                .replace('"', ""),
            ) ?? [];
          for (const match of matches) usage[match] = (usage[match] ?? 0) + 1;
        }
      }
    } catch (error) {
      console.error(error);
    }
  };
  await traverseFiles(process.env.SRC_DIR ?? "");

  return usage;
};

const saveLocales = async (locales: Array<Locale>) => {
  const dirname = process.env.LOCALE_DIR ?? "";
  await Promise.all(
    locales.map(({ language, data }) =>
      writeFile(
        path.join(dirname, `${language}.json`),
        JSON.stringify(data, null, 2),
      ),
    ),
  );
};

const findReplace = async (
  folderPath: string,
  searchText: string,
  replaceText: string,
) => {
  try {
    const files = await readdir(folderPath);

    for (const file of files) {
      const filePath = path.join(folderPath, file);
      const stats = await stat(filePath);

      if (stats.isDirectory())
        await findReplace(filePath, searchText, replaceText);
      else if (file.endsWith(".ts") || file.endsWith(".tsx")) {
        const content = await readFile(filePath, "utf8");

        const newContent = content.replace(
          new RegExp(searchText, "g"),
          replaceText,
        );

        if (content !== newContent) {
          await writeFile(filePath, newContent, "utf8");
          console.log(`Updated: ${filePath}`);
        }
      }
    }
  } catch (error) {
    console.error(error);
  }
};

export const organizeLocales = async () => {
  const locales = await loadLocales();
  const defaultLocale = locales.find(
    ({ language }) => language === process.env.NEXT_PUBLIC_DEFAULT_LANGUAGE,
  );
  if (!defaultLocale) return locales;

  const definedKeys = new Set<string>();
  const findKeys = (data: Record<string, unknown>, prefix: string) => {
    for (const [key, value] of Object.entries(data)) {
      const path = prefix ? `${prefix}.${key}` : key;
      if (typeof value === "object" && value !== null && !Array.isArray(value))
        findKeys(value as Record<string, unknown>, path);
      else definedKeys.add(path);
    }
  };
  findKeys(defaultLocale.data, "");

  const pruneKeys = (data: Record<string, unknown>, prefix: string) => {
    for (const key of Object.keys(data)) {
      const path = prefix ? `${prefix}.${key}` : key;
      if (
        typeof data[key] === "object" &&
        data[key] !== null &&
        !Array.isArray(data[key])
      )
        pruneKeys(data[key] as Record<string, unknown>, path);
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      else if (!definedKeys.has(path)) delete data[key];
    }
  };

  for (const locale of locales) {
    pruneKeys(locale.data, "");
    locale.data = removeEmpty(sortObject(locale.data));
  }

  await saveLocales(locales);

  return locales;
};

export const deleteI18nKey = async (parts: Array<string>) => {
  const locales = await loadLocales();
  const lastPart = parts.pop();

  if (lastPart)
    for (const { data } of locales) {
      let current: Record<string, unknown> | undefined = data;
      for (const part of parts)
        current = current?.[part] as Record<string, unknown> | undefined;

      if (current)
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete current[lastPart];
    }

  for (const locale of locales)
    locale.data = removeEmpty(sortObject(locale.data));

  await saveLocales(locales);

  return locales;
};

export const updateI18nKey = async (
  prev: Array<string>,
  next: Array<string>,
) => {
  const locales = await loadLocales();

  const lastPrevPart = prev.pop();
  const lastNextPart = next.pop();

  if (!lastPrevPart || !lastNextPart) return locales;

  for (const { data } of locales) {
    let current: Record<string, unknown> | undefined = data;
    for (const part of prev)
      current = current?.[part] as Record<string, unknown> | undefined;

    const prevValue = current?.[lastPrevPart];

    if (current)
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete current[lastPrevPart];

    if (!prevValue) continue;

    current = data;
    for (const part of next) {
      if (!current[part]) current[part] = {};
      current = current[part] as Record<string, unknown>;
    }
    current[lastNextPart] = prevValue;
  }

  for (const locale of locales)
    locale.data = removeEmpty(sortObject(locale.data));

  await saveLocales(locales);

  await findReplace(
    process.env.SRC_DIR ?? "",
    `"${prev.join(".").replace(".", ":").replace("translation:", "")}"`,
    `"${next.join(".").replace(".", ":").replace("translation:", "")}"`,
  );

  return locales;
};

export const updateI18nValues = async (
  entries: Array<{ key: Array<string>; language: string; value: string }>,
) => {
  const locales = await loadLocales();

  for (const { key, language, value } of entries) {
    const lastPrevPart = key.pop();
    if (!lastPrevPart) continue;

    for (const locale of locales) {
      if (locale.language !== language) continue;
      let current: Record<string, unknown> = locale.data;
      for (const part of key) {
        if (!current[part]) current[part] = {};
        current = current[part] as Record<string, unknown>;
      }
      current[lastPrevPart] = value;
    }
  }

  await saveLocales(locales);

  return locales;
};
