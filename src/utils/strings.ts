export const copyTextToClipboard = async (text: string) => {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (typeof ClipboardItem && navigator.clipboard.write)
    await navigator.clipboard.write([
      new ClipboardItem({
        "text/plain": new Blob([text], { type: "text/plain" }),
      }),
    ]);
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  else if (typeof navigator !== "undefined" && navigator.clipboard)
    await navigator.clipboard.writeText(text);
};
