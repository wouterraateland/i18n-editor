import type { FillableIconProps } from "components/icons/icon";
import Icon from "components/icons/icon";

export default function IconError({ filled, ...props }: FillableIconProps) {
  return (
    <Icon viewBox="0 0 32 32" {...props}>
      <path
        d="m11 28-7-7V11l7-7h10l7 7v10l-7 7H11Zm5-16.5V16m0 4.5V20"
        fill={filled ? undefined : "none"}
      />
    </Icon>
  );
}
