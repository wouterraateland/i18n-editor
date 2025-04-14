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
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import clsx from "clsx";
import IconDragHandle from "components/icons/drag-handle";
import Button from "components/ui/button";

function Item({ children, id }: { children: React.ReactNode; id: string }) {
  const { attributes, listeners, setNodeRef, transform, transition, active } =
    useSortable({ id });

  return (
    <div
      ref={setNodeRef}
      className={clsx("flex gap-1", active?.id === id && "relative z-10")}
      style={{ translate: `0px, ${transform?.y ?? 0}px`, transition }}
    >
      <Button
        className={clsx(
          "flex-shrink-0 transition-all",
          active?.id === id ? "cursor-grabbing shadow-md" : "cursor-grab",
        )}
        iconLeft={<IconDragHandle className="text-weak hover:text-text" />}
        size="xs"
        suppressHydrationWarning
        type="button"
        {...attributes}
        {...listeners}
      />
      <div className="min-w-0 flex-grow">{children}</div>
    </div>
  );
}

export default function SortableList<T extends { id: string }>({
  items,
  onMove,
  renderItem,
}: {
  items: Array<T>;
  onMove(active_id: UniqueIdentifier, over_id: UniqueIdentifier): unknown;
  renderItem(item: T, i: number): React.ReactNode;
}) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { delay: 50, tolerance: 50 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  if (items.length === 0) return null;

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragEnd={async ({ active, over }) => {
        if (!over || active.id === over.id) return;
        await onMove(active.id, over.id);
      }}
      sensors={sensors}
    >
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        {items.map((item, i) => {
          const children = renderItem(item, i);
          return children ? (
            <Item key={item.id} id={item.id}>
              {children}
            </Item>
          ) : null;
        })}
      </SortableContext>
    </DndContext>
  );
}
