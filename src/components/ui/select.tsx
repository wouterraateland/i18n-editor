import * as SelectPrimitive from "@radix-ui/react-select";
import clsx from "clsx";
import IconCaret from "components/icons/caret";
import IconCaretUpDown from "components/icons/caret-up-down";
import Button from "components/ui/button";
import type { ButtonSize } from "components/ui/utils";
import usePending from "hooks/use-pending";
import { forwardRef } from "react";
import type { NoInfer, Override } from "utils/types";

const Select = forwardRef(function Select<T extends string>(
  {
    caret = true,
    className,
    contentClassName,
    iconLeft,
    labelClassName,
    layout = "text",
    onChange,
    onFocus,
    options = [],
    outline = true,
    size = "sm",
    value,
    ...props
  }: Override<
    React.ComponentPropsWithRef<"button">,
    {
      caret?: boolean;
      contentClassName?: string;
      iconLeft?: React.ReactNode;
      labelClassName?: string;
      layout?: "text" | "icon";
      onChange(value: NoInfer<T>): unknown;
      onClick?:
        | ((event: React.MouseEvent<HTMLButtonElement>) => unknown)
        | undefined;
      onFocus?: () => unknown;
      outline?: boolean;
      options: Array<{
        description?: string;
        disabled?: boolean;
        icon?: React.ReactNode;
        label: string;
        fallbackLabel?: string;
        value: NoInfer<T>;
      }>;
      pending?: boolean;
      size: ButtonSize;
      value: T;
    }
  >,
  ref: React.ForwardedRef<HTMLButtonElement>,
) {
  const [pending, withPending] = usePending();

  return (
    <SelectPrimitive.Root
      onValueChange={withPending((value) => value && onChange(value as T))}
      value={value}
    >
      <SelectPrimitive.Trigger ref={ref} asChild>
        <Button
          {...props}
          className={clsx("notranslate", className)}
          iconLeft={
            options.find((option) => option.value === value)?.icon ?? iconLeft
          }
          iconRight={caret && <IconCaretUpDown />}
          iconRightClassName="text-weak group-hover/button:text-text"
          label={
            <>
              {options.find((option) => option.value === value)?.label || (
                <span className="text-weak">
                  {
                    options.find((option) => option.value === value)
                      ?.fallbackLabel
                  }
                </span>
              )}
              <span className="invisible absolute inset-0">
                <SelectPrimitive.Value />
              </span>
            </>
          }
          labelClassName={clsx("relative flex-grow text-left", labelClassName)}
          layout={layout}
          onFocus={onFocus}
          outline={outline}
          pending={pending}
          size={size}
          type="button"
        />
      </SelectPrimitive.Trigger>
      <SelectPrimitive.Portal>
        <SelectPrimitive.Content
          className={clsx(
            "relative z-50 max-h-screen rounded-xl ring theme-surface",
            contentClassName,
          )}
        >
          <SelectPrimitive.ScrollUpButton className="relative flex w-full justify-center rounded-t-xl p-1">
            <IconCaret direction="up" />
          </SelectPrimitive.ScrollUpButton>
          <SelectPrimitive.Viewport className="flex flex-col gap-1 p-1">
            {options.map((option) => (
              <SelectPrimitive.Item
                key={option.value}
                className="flex w-full cursor-pointer items-center gap-1 rounded-lg p-1 text-left transition-colors focus:bg-divider focus:outline-none data-[state=checked]:theme-primary-container"
                textValue={option.label}
                value={option.value}
              >
                {option.icon && <div className="m-1">{option.icon}</div>}
                <div
                  className={clsx(
                    "min-w-0 flex-grow pr-1.5",
                    !option.icon && "pl-1.5",
                  )}
                >
                  <SelectPrimitive.ItemText>
                    {option.label || (
                      <span className="text-weak">{option.fallbackLabel}</span>
                    )}
                  </SelectPrimitive.ItemText>
                  {option.description && (
                    <p className="text-sm text-weak">{option.description}</p>
                  )}
                </div>
              </SelectPrimitive.Item>
            ))}
          </SelectPrimitive.Viewport>
          <SelectPrimitive.ScrollDownButton className="relative flex w-full justify-center rounded-b-xl p-1">
            <IconCaret direction="down" />
          </SelectPrimitive.ScrollDownButton>
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  );
});

export default Select;
