import type { FillableIconProps } from "components/icons/icon";
import Icon from "components/icons/icon";

export default function IconWarn({ filled, ...props }: FillableIconProps) {
  return (
    <Icon viewBox="0 2 32 32" {...props}>
      {filled ? (
        <path
          d="M16.67 2.51c.3.15.53.38.67.67l12.07 24.15a1.5 1.5 0 0 1-1.34 2.17H3.93a1.5 1.5 0 0 1-1.34-2.17L14.66 3.18a1.5 1.5 0 0 1 2.01-.67ZM16 21.5c-.83 0-1.5.67-1.5 1.5v.5a1.5 1.5 0 0 0 3 0V23c0-.83-.67-1.5-1.5-1.5Zm0-8.5c-.83 0-1.5.67-1.5 1.5V19a1.5 1.5 0 0 0 3 0v-4.5c0-.83-.67-1.5-1.5-1.5Z"
          stroke="none"
        />
      ) : (
        <path d="M4 28 16 4l12 24H4Zm12-14V18m0 5V23" fill="none" />
      )}
    </Icon>
  );
}
