import type { FillableIconProps } from "components/icons/icon";
import Icon from "components/icons/icon";

export default function IconInfo({ filled, ...props }: FillableIconProps) {
  return (
    <Icon viewBox="0 0 32 32" {...props}>
      <path
        d="M4 16a12 12 0 1 1 24 0 12 12 0 0 1-24 0Zm12-.5V21m0-9.5V11"
        fill={filled ? undefined : "none"}
      />
    </Icon>
  );
}
