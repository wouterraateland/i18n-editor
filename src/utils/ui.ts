export const popperContentWrapperClassName =
  "group/content flex flex-col !pointer-events-none z-50 min-h-[calc(50vh-0.5*var(--radix-popper-anchor-height,0px))] max-w-[calc(100vw-2rem)] justify-center data-[side=bottom]:justify-start data-[side=top]:justify-end focus-visible:outline-none print:!hidden";

export const popperContentClassName =
  "pointer-events-auto max-h-[--radix-popper-available-height] max-w-full overflow-auto rounded-xl ring shadow-md theme-surface focus-visible:outline-none group-data-[state=closed]/content:animate-fade-out group-data-[state=open]/content:animate-fade-in";
