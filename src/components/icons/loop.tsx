import type { FillableIconProps } from "components/icons/icon";
import Icon from "components/icons/icon";

export default function IconLoop({ filled, ...props }: FillableIconProps) {
  return (
    <Icon viewBox="0 0 32 32" {...props}>
      <path
        d="M20 20a8 8 0 100-16 8 8 0 000 16zM4 28l10.34-10.34"
        fill={filled ? undefined : "none"}
      />
    </Icon>
  );
}
