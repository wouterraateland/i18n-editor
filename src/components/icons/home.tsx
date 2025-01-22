import type { FillableIconProps } from "components/icons/icon";
import Icon from "components/icons/icon";

export default function IconHome({ filled, ...props }: FillableIconProps) {
  return (
    <Icon viewBox="0 0 32 32" {...props}>
      <path
        d="M28 28V14L16 4 4 14v14h8v-6a4 4 0 1 1 8 0v6h8Z"
        fill={filled ? undefined : "none"}
      />
    </Icon>
  );
}
