import * as SelectPrimitive from "@radix-ui/react-select";
import IconCaret from "components/icons/caret";
import IconCaretUpDown from "components/icons/caret-up-down";
import Button from "components/ui/button";
import usePending from "hooks/use-pending";

export default function Select({
  onChange,
  options = [],
  value,
  ...props
}: {
  onChange(value: string): unknown;
  options: Array<{
    label: string;
    value: string;
  }>;
  value: string;
}) {
  const [pending, withPending] = usePending();

  return (
    <SelectPrimitive.Root onValueChange={withPending(onChange)} value={value}>
      <SelectPrimitive.Trigger asChild>
        <Button
          {...props}
          className="notranslate bg-background"
          iconRight={<IconCaretUpDown />}
          iconRightClassName="text-weak group-hover/button:text-text"
          label={
            <>
              {options.find((option) => option.value === value)?.label}
              <span className="invisible absolute inset-0">
                <SelectPrimitive.Value />
              </span>
            </>
          }
          labelClassName="relative grow text-left"
          outline
          pending={pending}
          size="sm"
          type="button"
        />
      </SelectPrimitive.Trigger>
      <SelectPrimitive.Portal>
        <SelectPrimitive.Content className="theme-surface ring-divider relative z-50 max-h-screen rounded-xl ring">
          <SelectPrimitive.ScrollUpButton className="relative flex w-full justify-center rounded-t-xl p-1">
            <IconCaret direction="up" />
          </SelectPrimitive.ScrollUpButton>
          <SelectPrimitive.Viewport className="flex flex-col gap-1 p-1">
            {options.map((option) => (
              <SelectPrimitive.Item
                key={option.value}
                className="focus:bg-divider data-[state=checked]:theme-info-container flex cursor-pointer rounded-lg px-2.5 py-1 text-left transition-colors focus:outline-hidden"
                textValue={option.label}
                value={option.value}
              >
                <SelectPrimitive.ItemText>
                  {option.label}
                </SelectPrimitive.ItemText>
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
}
