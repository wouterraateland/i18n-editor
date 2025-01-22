import type { IconProps } from "components/icons/icon";
import Icon from "components/icons/icon";

export default function IconDragHandle(props: IconProps) {
  return (
    <Icon viewBox="0 0 32 32" {...props}>
      <path
        d="M20 27a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm-10 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm10-10a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm-10 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM20 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM10 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"
        fill="none"
      />
    </Icon>
  );
}
