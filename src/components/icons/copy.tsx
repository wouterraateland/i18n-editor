import type { IconProps } from "components/icons/icon";
import Icon from "components/icons/icon";

export default function IconCopy(props: IconProps) {
  return (
    <Icon viewBox="0 0 32 32" {...props}>
      <path d="M6.5 25H5V2h15v1.5M10 30V7h15v23H10z" fill="none" />
    </Icon>
  );
}
