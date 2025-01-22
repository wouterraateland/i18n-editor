import type { FillableIconProps } from "components/icons/icon";
import Icon from "components/icons/icon";

export default function IconPen({ filled, ...props }: FillableIconProps) {
  return (
    <Icon viewBox="0 0 32 32" {...props}>
      {filled && <path d="m22 4 6 6-5 5-6-6z" stroke="none" />}
      <path d="m22 4 6 6-18 18H4v-6L22 4Zm-5 5 6 6" fill="none" />
    </Icon>
  );
}
