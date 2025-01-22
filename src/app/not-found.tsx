import IconHome from "components/icons/home";
import IconUndo from "components/icons/undo";
import ThemedBody from "components/themed-body";
import LinkButton from "components/ui/link-button";

export default function NotFound() {
  return (
    <html>
      <ThemedBody className="flex min-h-[100dvh] flex-col items-center justify-center gap-2 p-4 text-center">
        <IconHome className="text-6xl opacity-50" filled />
        <h3 className="font-heading text-balance text-xl font-bold leading-tight">
          Nothing here
        </h3>
        <LinkButton
          className="mt-4 theme-surface"
          href="/"
          iconLeft={<IconUndo />}
          label="Back home"
          outline
          size="sm"
        />
      </ThemedBody>
    </html>
  );
}
