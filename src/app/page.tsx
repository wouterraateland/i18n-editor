import { i18nGetUsage, loadLocales } from "app/actions";
import Editor from "app/editor";

export const revalidate = 0;

export default async function Page() {
  const locales = await loadLocales();
  const usage = await i18nGetUsage();

  return <Editor initialLocales={locales} initialUsage={usage} />;
}
