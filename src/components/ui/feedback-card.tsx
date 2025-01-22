import clsx from "clsx";
import IconCheck from "components/icons/check";
import IconError from "components/icons/error";
import IconInfo from "components/icons/info";
import IconWarn from "components/icons/warn";

export function FeedbackCard({
  action,
  children,
  className,
  variant = null,
  ...props
}: React.ComponentPropsWithoutRef<"div"> & {
  action?: React.ReactNode;
  variant?: "primary" | "warning" | "error" | "info" | null;
}) {
  return (
    <div
      className={clsx(
        "flex items-start gap-4 rounded-l rounded-r-xl border-l-4 p-4",
        variant === "primary" && "border-l-primary theme-primary-container",
        variant === "warning" && "border-l-warning theme-warning-container",
        variant === "error" && "border-l-error theme-error-container",
        variant === "info" && "border-l-info theme-info-container",
        variant === null && "inverse border-l-weak theme-surface",
        className,
      )}
      {...props}
    >
      {variant === "primary" && <IconCheck className="text-xl text-primary" />}
      {variant === "warning" && <IconWarn className="text-xl text-warning" />}
      {variant === "error" && <IconError className="text-xl text-error" />}
      {variant === "info" && <IconInfo className="text-xl text-info" />}
      <div
        className={clsx("min-w-0 flex-grow break-words", !action && "pr-1.5")}
      >
        {children}
      </div>
      {action}
    </div>
  );
}
