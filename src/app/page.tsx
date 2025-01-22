import { getI18nUsage, loadLocales } from "app/actions";
import Editor from "app/editor";

export const revalidate = 0;

export default async function Page() {
  const locales = await loadLocales();
  const usage = await getI18nUsage();

  return <Editor initialLocales={locales} initialUsage={usage} />;
}
