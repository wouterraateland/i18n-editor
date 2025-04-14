import clsx from "clsx";

export type IconProps = React.ComponentPropsWithoutRef<"svg">;
export type FillableIconProps = { filled?: boolean } & IconProps;

export default function Icon({ className, ...props }: IconProps) {
  return (
    <svg
      className={clsx(
        "h-[1em] shrink-0 fill-current stroke-current stroke-[3px] [stroke-linecap:round] [stroke-linejoin:round]",
        className,
      )}
      {...props}
    />
  );
}
