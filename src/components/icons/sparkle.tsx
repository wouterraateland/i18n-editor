import type { FillableIconProps } from "components/icons/icon";
import Icon from "components/icons/icon";

export default function IconSparkle({ filled, ...props }: FillableIconProps) {
  return (
    <Icon viewBox="0 0 32 32" {...props}>
      <path
        d="M24 12a6.32 6.32 0 0 0-4-4 6.32 6.32 0 0 0 4-4 6.32 6.32 0 0 0 4 4 6.32 6.32 0 0 0-4 4ZM12.22 26.03 12 28l-.22-1.97A9.13 9.13 0 0 0 4 18a9.13 9.13 0 0 0 7.78-8.03L12 8l.22 1.97A9.13 9.13 0 0 0 20 18a9.13 9.13 0 0 0-7.78 8.03Z"
        fill={filled ? undefined : "none"}
      />
    </Icon>
  );
}
