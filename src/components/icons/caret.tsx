import clsx from "clsx";
import type { FillableIconProps } from "components/icons/icon";
import Icon from "components/icons/icon";

const caretTransformClassNames = {
  left: "rotate-90",
  up: "rotate-180",
  right: "-rotate-90",
  down: undefined,
};

export default function IconCaret({
  direction = "down",
  className,
  filled,
  ...props
}: {
  direction?: "left" | "right" | "up" | "down";
} & FillableIconProps) {
  return (
    <Icon
      className={clsx(caretTransformClassNames[direction], className)}
      viewBox="0 0 32 32"
      {...props}
    >
      <path d="M28 10L16 22 4 10" fill={filled ? undefined : "none"} />
    </Icon>
  );
}
