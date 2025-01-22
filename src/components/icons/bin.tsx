import type { FillableIconProps } from "components/icons/icon";
import Icon from "components/icons/icon";

export default function IconBin({ filled, ...props }: FillableIconProps) {
  return (
    <Icon viewBox="0 0 32 32" {...props}>
      <path
        d="M23 8v18a2 2 0 0 1-2 2H11a2 2 0 0 1-2-2V8h0m11-4h-8m14 4H6"
        fill={filled ? undefined : "none"}
      />
    </Icon>
  );
}
