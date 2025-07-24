"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Category, useCategories } from "@/hooks/useCategories";
import { PopularTag, usePopularTags } from "@/hooks/usePopularTags";
import { motion } from "framer-motion";
import { Filter, Search, X } from "lucide-react";
import { useQueryState } from "nuqs";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";

export function SearchAndFilters() {
  const [search, setSearch] = useQueryState("search");
  const [searchInput, setSearchInput] = useState(search || "");
  const [debouncedSearch] = useDebounce(searchInput, 400);
  const [category, setCategory] = useQueryState("category", {
    defaultValue: "All",
  });
  const [tagsRaw, setTags] = useQueryState("tags", {
    parse: (v) => (typeof v === "string" ? v.split(",").filter(Boolean) : []),
    serialize: (v) => (Array.isArray(v) ? v.join(",") : ""),
    defaultValue: [],
  });
  const tags = Array.isArray(tagsRaw) ? tagsRaw : [];
  const [sortBy, setSortBy] = useQueryState("sortBy", {
    defaultValue: "createdAt",
  });
  const [, setSortOrder] = useQueryState("sortOrder", {
    defaultValue: "desc",
  });
  const [showFilters, setShowFilters] = useState(false);

  const { data: categories, isLoading: loadingCategories } = useCategories();
  const { data: popularTags, isLoading: loadingTags } = usePopularTags();

  // Sync debounced search to URL param
  useEffect(() => {
    setSearch(debouncedSearch || null);
  }, [debouncedSearch, setSearch]);

  const toggleTag = (tag: string) => {
    const tagSet = new Set(tags);
    if (tagSet.has(tag)) {
      tagSet.delete(tag);
    } else {
      tagSet.add(tag);
    }
    setTags(Array.from(tagSet));
  };

  const clearFilters = () => {
    setCategory(null);
    setTags(null);
    setSearchInput("");
    setSearch(null);
  };

  return (
    <section className="px-4 py-8 max-w-6xl mx-auto">
      <div className="bg-card/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-border">
        {/* Search Bar & Sorting */}
        <div className="relative mb-6 flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              placeholder="Search sprites..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pl-12 pr-4 "
            />
          </div>
          <Select
            value={sortBy === "downloadCount" ? "popular" : "latest"}
            onValueChange={(val) => {
              if (val === "popular") {
                setSortBy("downloadCount");
                setSortOrder("desc");
              } else {
                setSortBy("createdAt");
                setSortOrder("desc");
              }
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popular">Popular</SelectItem>
              <SelectItem value="latest">Latest</SelectItem>
            </SelectContent>
          </Select>
          <Button
            onClick={() => setShowFilters(!showFilters)}
            variant="outline"
            size="sm"
            className="rounded-xl border-border"
            aria-label="Toggle filters"
          >
            <Filter className="w-4 h-4" />
          </Button>
        </div>

        {/* Filters Panel */}
        <motion.div
          initial={false}
          animate={{
            height: showFilters ? "auto" : 0,
            opacity: showFilters ? 1 : 0,
          }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          <div className="space-y-6 pb-2">
            {/* Categories */}
            <div>
              <h3 className="text-sm font-semibold text-primary mb-3">
                Categories
              </h3>
              <div className="flex flex-wrap gap-2">
                {loadingCategories ? (
                  <span className="text-muted-foreground text-sm">
                    Loading...
                  </span>
                ) : (
                  ["All", ...(categories || [])].map((cat: Category) => (
                    <Badge
                      key={cat}
                      variant={category === cat ? "default" : "outline"}
                      className={`cursor-pointer transition-all duration-200 rounded-lg px-4 py-2 text-base font-medium border border-border ${
                        category === cat
                          ? "bg-primary text-primary-foreground shadow"
                          : "hover:bg-accent/40 hover:text-primary"
                      }`}
                      onClick={() => setCategory(cat)}
                    >
                      {cat}
                    </Badge>
                  ))
                )}
              </div>
            </div>

            {/* Tags */}
            <div>
              <h3 className="text-sm font-semibold text-primary mb-3">
                Popular Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {loadingTags ? (
                  <span className="text-muted-foreground text-sm">
                    Loading...
                  </span>
                ) : (
                  (popularTags || []).map((tag: PopularTag) => (
                    <Badge
                      key={tag}
                      variant={tags.includes(tag) ? "default" : "outline"}
                      className={`cursor-pointer transition-all duration-200 rounded-lg px-4 py-2 text-base font-medium border border-border ${
                        tags.includes(tag)
                          ? "bg-accent text-accent-foreground shadow"
                          : "hover:bg-accent/40 hover:text-primary"
                      }`}
                      onClick={() => toggleTag(tag)}
                    >
                      {tag}
                    </Badge>
                  ))
                )}
              </div>
            </div>

            {/* Clear Filters */}
            {(category !== "All" || tags.length > 0 || search) && (
              <Button
                onClick={clearFilters}
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-primary"
              >
                <X className="w-4 h-4 mr-2" />
                Clear Filters
              </Button>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
