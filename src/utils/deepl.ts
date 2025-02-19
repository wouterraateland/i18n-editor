"use server";

import { array, create, string, type, union } from "superstruct";
import { deepLLanguages } from "utils/deepl-languages";

const schema = union([
  type({
    translations: array(
      type({ detected_source_language: string(), text: string() }),
    ),
  }),
  type({ message: string() }),
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
