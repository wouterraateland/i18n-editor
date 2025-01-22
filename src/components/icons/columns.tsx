import type { FillableIconProps } from "components/icons/icon";
import Icon from "components/icons/icon";

export default function IconColumns({ filled, ...props }: FillableIconProps) {
  return (
    <Icon viewBox="0 0 32 32" {...props}>
      <path
        d="M11 26V6m10 0v20M2 6h28v20H2V6Z"
        fill={filled ? undefined : "none"}
      />
    </Icon>
  );
}
