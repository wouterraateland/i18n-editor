import type { IconProps } from "components/icons/icon";
import Icon from "components/icons/icon";

export default function IconCaretUpDown(props: IconProps) {
  return (
    <Icon viewBox="0 0 32 32" {...props}>
      <path d="M9,12 L16,5 L23,12 M9,20 L16,27 L23,20" fill="none" />
    </Icon>
  );
}
