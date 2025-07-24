"use client";

import * as React from "react";
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";

import { cn } from "@/lib/utils";

function ScrollArea({
  className,
  children,
  fadeColors,
  ...props
}: React.ComponentProps<typeof ScrollAreaPrimitive.Root> & {
  fadeColors?: string;
}) {
  const viewportRef = React.useRef<HTMLDivElement>(null);
  const [hasScroll, setHasScroll] = React.useState(false);
  const [showTopFade, setShowTopFade] = React.useState(false);
  const [showBottomFade, setShowBottomFade] = React.useState(false);

  React.useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const checkScroll = () => {
      setHasScroll(el.scrollHeight > el.clientHeight);
      setShowTopFade(el.scrollTop > 0);
      setShowBottomFade(el.scrollTop + el.clientHeight < el.scrollHeight);
    };
    checkScroll();
    el.addEventListener("scroll", checkScroll);
    window.addEventListener("resize", checkScroll);
    // Observe content changes on the children, not the viewport itself
    const observer = new MutationObserver(checkScroll);
    Array.from(el.children).forEach((child) =>
      observer.observe(child, {
        childList: true,
        subtree: true,
        characterData: true,
      })
    );
    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
      observer.disconnect();
    };
  }, [children]);

  return (
    <ScrollAreaPrimitive.Root
      data-slot="scroll-area"
      className={cn("relative", className)}
      {...props}
    >
      {/* Top Gradient Overlay */}
      <div
        className={cn(
          "pointer-events-none absolute top-0 left-0 h-4 z-10 transition-all duration-300 bg-linear-to-b",
          hasScroll ? "w-[calc(100%-0.75rem)] right-3" : "w-full right-0",
          showTopFade ? "opacity-100 visible" : "opacity-0 invisible",
          fadeColors ? fadeColors : "from-muted/50 to-muted/80"
        )}
      />
      {/* Bottom Gradient Overlay */}
      <div
        className={cn(
          "pointer-events-none absolute bottom-0 left-0 h-4 z-10 transition-all duration-300 bg-linear-to-t",
          hasScroll ? "w-[calc(100%-0.75rem)] right-3" : "w-full right-0",
          showBottomFade ? "opacity-100 visible" : "opacity-0 invisible",
          fadeColors ? fadeColors : "from-muted/50 to-muted/80"
        )}
      />
      <ScrollAreaPrimitive.Viewport
        ref={viewportRef}
        data-slot="scroll-area-viewport"
        className={cn(
          "focus-visible:ring-ring/50 size-full rounded-[inherit] transition-[color,box-shadow] outline-none focus-visible:ring-[3px] focus-visible:outline-1",
          hasScroll ? "pr-3" : "pr-0"
        )}
        style={{ position: "relative" }}
      >
        {children}
      </ScrollAreaPrimitive.Viewport>
      <ScrollBar />
      <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
  );
}

function ScrollBar({
  className,
  orientation = "vertical",
  ...props
}: React.ComponentProps<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>) {
  return (
    <ScrollAreaPrimitive.ScrollAreaScrollbar
      data-slot="scroll-area-scrollbar"
      orientation={orientation}
      className={cn(
        "flex touch-none p-px transition-colors select-none",
        orientation === "vertical" &&
          "h-full w-2.5 border-l border-l-transparent",
        orientation === "horizontal" &&
          "h-2.5 flex-col border-t border-t-transparent",
        className
      )}
      {...props}
    >
      <ScrollAreaPrimitive.ScrollAreaThumb
        data-slot="scroll-area-thumb"
        className="bg-border relative flex-1 rounded-full"
      />
    </ScrollAreaPrimitive.ScrollAreaScrollbar>
  );
}

export { ScrollArea, ScrollBar };
