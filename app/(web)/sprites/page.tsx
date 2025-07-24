"use client";

import { SearchAndFilters } from "@/components/sprite/SearchAndFilters";
import { SpriteCard } from "@/components/sprite/SpriteCard";
import { SpriteCardSkeleton } from "@/components/sprite/SpriteCardSkeleton";
import { useSprites } from "@/hooks/useSprites";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { useQueryState } from "nuqs";
import { Suspense } from "react";

function SpritesPageContent() {
  // Use nuqs for search params
  const [search] = useQueryState("search");
  const [category] = useQueryState("category");
  const [tagsRaw] = useQueryState("tags", {
    history: "replace",
    parse: (v) => (typeof v === "string" ? v.split(",").filter(Boolean) : []),
    serialize: (v) => (Array.isArray(v) ? v.join(",") : ""),
    defaultValue: [],
  });
  const tags = Array.isArray(tagsRaw) ? tagsRaw : [];
  const [page] = useQueryState("page", {
    history: "replace",
    defaultValue: 1,
    parse: Number,
    serialize: String,
  });
  const [sortBy] = useQueryState("sortBy", {
    history: "replace",
    defaultValue: "createdAt",
  });
  const [sortOrder] = useQueryState("sortOrder", {
    history: "replace",
    defaultValue: "desc",
  });

  const { data, isLoading, isFetching, fetchNextPage, hasNextPage } =
    useSprites({
      search: search || undefined,
      category: category || undefined,
      tags: tags.length ? tags : undefined,
      page: page || 1,
      sortBy: sortBy as "createdAt" | "downloadCount",
      sortOrder: sortOrder as "asc" | "desc",
      pageSize: 12,
    });

  const { ref, inView } = useInView({ triggerOnce: false, threshold: 0 });

  useEffect(() => {
    if (inView && hasNextPage && !isFetching) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetching, fetchNextPage]);

  const sprites = data?.pages.flatMap((page) => page.sprites) || [];

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
            Browse All Sprites
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance"
          >
            Discover thousands of professionally crafted SVG sprites. Filter by
            category, search by keywords, and find the perfect icons for your
            project.
          </motion.p>
        </div>
      </section>

      {/* Search and Filters */}
      <SearchAndFilters />

      {/* Sprites Grid */}
      <section className="px-4 py-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-6">
          {isLoading
            ? Array.from({ length: 9 }).map((_, i) => (
                <SpriteCardSkeleton key={i} />
              ))
            : sprites.map((sprite, index) => (
                <motion.div
                  key={sprite.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                >
                  <SpriteCard sprite={sprite} />
                </motion.div>
              ))}
          {/* Show skeletons when fetching next page */}
          {isFetching &&
            !isLoading &&
            Array.from({ length: 9 }).map((_, i) => (
              <SpriteCardSkeleton key={`fetching-${i}`} />
            ))}
        </div>
        {/* No results found */}
        {!isLoading && sprites.length === 0 && (
          <div className="text-center py-16">
            <p className="text-lg text-muted-foreground font-semibold">
              No results found.
            </p>
            <p className="text-muted-foreground">
              Try adjusting your search or filters.
            </p>
          </div>
        )}

        {/* Infinite scroll sentinel */}
        {hasNextPage && (
          <div ref={ref} className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground">
              Loading more sprites...
            </span>
          </div>
        )}

        {/* End message */}
        {!hasNextPage && sprites.length > 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              You&apos;ve reached the end! 🎉 Check back later for new sprites.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}

export default function SpritesPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SpritesPageContent />
    </Suspense>
  );
}
