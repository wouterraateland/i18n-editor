"use server";

import { array, create, object, string, union } from "superstruct";

const deepLLanguages: Record<string, string> = {
  "be-BY": "RU",
  "cs-CZ": "CS",
  "da-DK": "DA",
  "de-DE": "DE",
  "en-US": "EN-US",
  en: "EN-US",
  "es-ES": "ES",
  "eu-ES": "ES",
  "fr-FR": "FR",
  "hu-HU": "HU",
  "it-IT": "IT",
  "ja-JP": "JA",
  "lt-LT": "LT",
  "nl-NL": "NL",
  nl: "NL",
  "nn-NO": "NB",
  "pt-BR": "PT",
  "ro-RO": "RO",
  "ru-RU": "RU",
  "sk-SK": "SK",
  "uk-UA": "UK",
};

const schema = union([
  object({
    translations: array(
      object({ detected_source_language: string(), text: string() }),
    ),
  }),
  object({ message: string() }),
]);

export const deepLTranslate = async (text: Array<string>, to: string) => {
  const target_lang = deepLLanguages[to];
  if (!target_lang) throw new Error(`Unsupported language: ${to}`);
  const response = await fetch("https://api.deepl.com/v2/translate", {
    method: "POST",
    headers: {
      Authorization: `DeepL-Auth-Key ${process.env["DEEPL_API_KEY"]}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text, target_lang }),
  });
  const data = create(await response.json(), schema);
  if ("message" in data) throw new Error(data.message);
  return data.translations.map((t) => t.text);
};
