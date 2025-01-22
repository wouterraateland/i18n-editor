import clsx from "clsx";

export default function TableControllerRoot({
  children,
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div
      className={clsx(
        "relative z-10 flex gap-1 border-b p-1 theme-surface print:hidden",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
