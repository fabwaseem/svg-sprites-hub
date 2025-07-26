"use client";

import { IconCard } from "@/components/sprite/IconCard";
import { IconCardSkeleton } from "@/components/sprite/IconCardSkeleton";
import { IconSearchBar } from "@/components/sprite/IconSearchBar";
import { useIcons } from "@/hooks/useIcons";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useEffect, useMemo, useCallback, useState, useRef, memo } from "react";
import { useInView } from "react-intersection-observer";
import { useQueryState } from "nuqs";
import { Suspense } from "react";
import { useDebounce } from "use-debounce";
import { Icon } from "@prisma/client";

// Custom virtualization hook that uses intersection observer
function useVirtualization(items: Icon[]) {
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 50 });
  const containerRef = useRef<HTMLDivElement>(null);
  const sentinelRefs = useRef<Map<number, HTMLDivElement>>(new Map());

  // Calculate items per row based on screen size
  const getItemsPerRow = useCallback(() => {
    if (typeof window === "undefined") return 4;
    const width = window.innerWidth;
    if (width < 640) return 2;
    if (width < 768) return 3;
    if (width < 1024) return 4;
    if (width < 1280) return 6;
    return 8;
  }, []);

  const [itemsPerRow, setItemsPerRow] = useState(getItemsPerRow());

  useEffect(() => {
    const handleResize = () => setItemsPerRow(getItemsPerRow());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [getItemsPerRow]);

  // Create intersection observer for each sentinel
  useEffect(() => {
    // Observer for expanding upward (when scrolling up)
    const topObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(
              entry.target.getAttribute("data-index") || "0"
            );
            setVisibleRange((prev) => ({
              start: Math.max(0, Math.min(prev.start, index - 20)),
              end: prev.end,
            }));
          }
        });
      },
      { rootMargin: "200px 0px 0px 0px" }
    );

    // Observer for expanding downward (when scrolling down)
    const bottomObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(
              entry.target.getAttribute("data-index") || "0"
            );
            setVisibleRange((prev) => ({
              start: prev.start,
              end: Math.min(items.length, Math.max(prev.end, index + 50)),
            }));
          }
        });
      },
      { rootMargin: "0px 0px 200px 0px" }
    );

    // Observe sentinels
    sentinelRefs.current.forEach((element, index) => {
      if (index <= visibleRange.start + 10) {
        topObserver.observe(element);
      }
      if (index >= visibleRange.end - 10) {
        bottomObserver.observe(element);
      }
    });

    return () => {
      topObserver.disconnect();
      bottomObserver.disconnect();
    };
  }, [items.length, visibleRange]);

  const setSentinelRef = useCallback(
    (index: number, element: HTMLDivElement | null) => {
      if (element) {
        element.setAttribute("data-index", index.toString());
        sentinelRefs.current.set(index, element);
      } else {
        sentinelRefs.current.delete(index);
      }
    },
    []
  );

  // Reset range when items change (e.g., new search)
  useEffect(() => {
    setVisibleRange({ start: 0, end: 50 });
  }, [items.length]);

  return {
    containerRef,
    visibleRange,
    setSentinelRef,
    itemsPerRow,
    totalRows: Math.ceil(items.length / itemsPerRow),
  };
}

// Memoized IconCard to prevent unnecessary re-renders
const MemoizedIconCard = memo(IconCard);

// Memoized animated icon item component
const AnimatedIconItem = memo(
  ({ icon, index }: { icon: Icon; index: number }) => (
    <motion.div
      key={icon.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.05, 0.3) }} // Cap delay at 0.3s
    >
      <MemoizedIconCard icon={icon} />
    </motion.div>
  )
);

AnimatedIconItem.displayName = "AnimatedIconItem";

// Virtualized row component
interface VirtualRowProps {
  rowIndex: number;
  icons: Icon[];
  itemsPerRow: number;
  isVisible: boolean;
  setSentinelRef: (index: number, element: HTMLDivElement | null) => void;
}

const VirtualRow = memo(
  ({
    rowIndex,
    icons,
    itemsPerRow,
    isVisible,
    setSentinelRef,
  }: VirtualRowProps) => {
    const startIndex = rowIndex * itemsPerRow;
    const rowIcons = icons.slice(startIndex, startIndex + itemsPerRow);

    return (
      <div
        ref={(el) => setSentinelRef(startIndex, el)}
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4 mb-4"
        style={{ minHeight: "120px" }}
      >
        {isVisible
          ? rowIcons.map((icon, iconIndex) => (
              <AnimatedIconItem
                key={icon.id}
                icon={icon}
                index={startIndex + iconIndex}
              />
            ))
          : // Placeholder to maintain layout
            Array.from({ length: rowIcons.length }).map((_, i) => (
              <div
                key={`placeholder-${startIndex + i}`}
                className="aspect-square bg-transparent"
              />
            ))}
        {/* Fill empty slots in the last row */}
        {rowIcons.length < itemsPerRow &&
          Array.from({ length: itemsPerRow - rowIcons.length }).map((_, i) => (
            <div key={`empty-${startIndex + rowIcons.length + i}`} />
          ))}
      </div>
    );
  }
);

VirtualRow.displayName = "VirtualRow";

function IconsPageContent() {
  const [search] = useQueryState("search", { defaultValue: "" });
  const [debouncedSearch] = useDebounce(search, 300);

  const queryOptions = useMemo(
    () => ({
      search: debouncedSearch || undefined,
      sortBy: "createdAt" as const,
      sortOrder: "desc" as const,
      pageSize: 100,
    }),
    [debouncedSearch]
  );

  const { data, isLoading, isFetching, fetchNextPage, hasNextPage } =
    useIcons(queryOptions);

  // Intersection observer for infinite scroll
  const { ref, inView } = useInView({
    triggerOnce: false,
    threshold: 0,
    rootMargin: "400px",
  });

  const handleFetchNextPage = useCallback(() => {
    if (inView && hasNextPage && !isFetching) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetching, fetchNextPage]);

  useEffect(() => {
    handleFetchNextPage();
  }, [handleFetchNextPage]);

  const allIcons = useMemo(
    () => data?.pages.flatMap((page) => page.icons) || [],
    [data?.pages]
  );

  // Use custom virtualization
  const { containerRef, visibleRange, setSentinelRef, itemsPerRow, totalRows } =
    useVirtualization(allIcons);

  const skeletonCount = useMemo(
    () => Array.from({ length: isLoading ? 24 : 8 }),
    [isLoading]
  );

  return (
    <main className="min-h-screen pt-16 bg-background">
      {/* Header */}
      <section className="py-12 bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl sm:text-5xl font-display font-bold text-primary mb-4 text-balance"
          >
            Browse All Icons
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance"
          >
            Explore thousands of individual SVG icons. Search and download the
            perfect icons for your project.
          </motion.p>
        </div>
      </section>

      {/* Search */}
      <IconSearchBar />

      {/* Icons Grid */}
      <section className="px-4 py-8 max-w-7xl mx-auto">
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
            {skeletonCount.map((_, i) => (
              <IconCardSkeleton key={`loading-${i}`} />
            ))}
          </div>
        ) : allIcons.length > 0 ? (
          <div ref={containerRef}>
            {Array.from({ length: totalRows }).map((_, rowIndex) => {
              const isVisible =
                rowIndex >= Math.floor(visibleRange.start / itemsPerRow) &&
                rowIndex <= Math.floor(visibleRange.end / itemsPerRow);

              return (
                <VirtualRow
                  key={rowIndex}
                  rowIndex={rowIndex}
                  icons={allIcons}
                  itemsPerRow={itemsPerRow}
                  isVisible={isVisible}
                  setSentinelRef={setSentinelRef}
                />
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-lg text-muted-foreground font-semibold">
              No icons found.
            </p>
            <p className="text-muted-foreground">Try adjusting your search.</p>
          </div>
        )}

        {/* Single loading indicator for both infinite scroll and fetching */}
        {(hasNextPage || isFetching) && !isLoading && (
          <div ref={ref} className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground">
              Loading more icons...
            </span>
          </div>
        )}

        {/* End message */}
        {!hasNextPage && allIcons.length > 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              You&apos;ve reached the end! 🎉 Check back later for new icons.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}

export default function IconsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <IconsPageContent />
    </Suspense>
  );
}
