"use server";

import { array, create, string, type, union } from "superstruct";
import { translationMappings } from "utils/translation-mappings";

const deepLSchema = union([
  type({
    translations: array(
      type({ detected_source_language: string(), text: string() }),
    ),
  }),
  type({ message: string() }),
]);

const deepLTranslate = async (
  text: Array<string>,
  params: Record<string, string>,
) => {
  const response = await fetch("https://api.deepl.com/v2/translate", {
    method: "POST",
    headers: {
      Authorization: `DeepL-Auth-Key ${process.env["DEEPL_API_KEY"]}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text, ...params }),
  });
  const data = create(await response.json(), deepLSchema);
  if ("message" in data) throw new Error(data.message);
  return data.translations.map((t) => t.text);
};

const googleTranslateSchema = type({
  data: type({ translations: array(type({ translatedText: string() })) }),
});

const googleTranslate = async (
  text: Array<string>,
  params: Record<string, string>,
) => {
  const response = await fetch(
    `https://translation.googleapis.com/language/translate/v2?key=${process.env["GOOGLE_TRANSLATE_API_KEY"]}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ q: text, ...params }),
    },
  );
  const result = create(await response.json(), googleTranslateSchema);
  return result.data.translations.map((t) => t.translatedText);
};

export const translateStrings = async (
  text: Array<string>,
  from: string,
  to: string,
) => {
  const map = translationMappings.find(
    (map) => map.from === from && map.to === to,
  );
  if (!map) throw new Error(`Unsupported translation: ${from} -> ${to}`);
  switch (map.provider) {
    case "DeepL":
      return deepLTranslate(text, map.params);
    case "GoogleTranslate":
      return googleTranslate(text, map.params);
  }
};
