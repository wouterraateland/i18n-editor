"use client";

import type { UniqueIdentifier } from "@dnd-kit/core";
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import clsx from "clsx";
import IconDragHandle from "components/icons/drag-handle";
import Button from "components/ui/button";
import { useLayoutEffect, useState } from "react";

function Item({
  children,
  disabled,
  id,
  interactive,
  size,
}: {
  children: React.ReactNode;
  disabled: boolean;
  id: string;
  interactive: boolean;
  size: "responsive" | "wide" | "small";
}) {
  const { attributes, listeners, setNodeRef, transform, transition, active } =
    useSortable({ id });

  return (
    <div
      ref={setNodeRef}
      className={clsx("grid", active?.id === id && "relative z-10")}
      style={
        disabled
          ? {}
          : {
              transform: `translate(${transform?.x ?? 0}px, ${
                transform?.y ?? 0
              }px)`,
              transition,
            }
      }
    >
      {!disabled && (
        <Button
          className={clsx(
            "col-start-1 row-start-1 -ml-1.5 -mr-1 text-weak transition-all hover:text-text",
            interactive ? "py-2" : "py-1",
            size === "responsive" && "sm:-ml-7",
            size === "wide" && "-ml-7",
            active?.id === id ? "cursor-grabbing shadow-md" : "cursor-grab",
          )}
          iconLeft={<IconDragHandle />}
          iconLeftClassName="self-start mr-auto"
          size="xs"
          suppressHydrationWarning
          type="button"
          {...attributes}
          {...listeners}
        />
      )}
      <div
        className={clsx(
          "relative col-start-1 row-start-1 min-w-0 py-1",
          !interactive && "pointer-events-none",
          !disabled && size === "responsive" && "max-sm:ml-6",
          !disabled && size === "small" && "ml-6",
        )}
      >
        {children}
      </div>
    </div>
  );
}

export default function SortableList<T extends { id: string }>({
  className,
  disabled = false,
  interactive = true,
  items,
  onMove,
  renderItem,
  size = "responsive",
}: {
  className?: string | undefined;
  disabled?: boolean;
  interactive?: boolean;
  items: Array<T>;
  onMove(active_id: UniqueIdentifier, over_id: UniqueIdentifier): unknown;
  renderItem(item: T, i: number): React.ReactNode;
  size?: "responsive" | "wide" | "small";
}) {
  const [optimisticItems, setOptimisticItems] = useState(items);
  useLayoutEffect(() => {
    setOptimisticItems(items);
  }, [items]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { delay: 50, tolerance: 50 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  if (optimisticItems.length === 0) return null;

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragEnd={async ({ active, over }) => {
        if (!over || active.id === over.id) return;
        setOptimisticItems((items) =>
          arrayMove(
            items,
            items.findIndex((row) => row.id === active.id),
            items.findIndex((row) => row.id === over.id),
          ),
        );
        await onMove(active.id, over.id);
      }}
      sensors={sensors}
    >
      <SortableContext
        items={optimisticItems}
        strategy={verticalListSortingStrategy}
      >
        <div className={clsx("divide-y border-y", className)}>
          {optimisticItems.map((item, i) => {
            const children = renderItem(item, i);
            return children ? (
              <Item
                key={item.id}
                disabled={disabled}
                id={item.id}
                interactive={interactive}
                size={size}
              >
                {children}
              </Item>
            ) : null;
          })}
        </div>
      </SortableContext>
    </DndContext>
  );
}
