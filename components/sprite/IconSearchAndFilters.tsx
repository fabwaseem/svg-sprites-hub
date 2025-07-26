"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, X, Filter } from "lucide-react";
import { useQueryState } from "nuqs";
import { useCategories } from "@/hooks/useCategories";
import { usePopularTags } from "@/hooks/usePopularTags";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function IconSearchAndFilters() {
  const [search, setSearch] = useQueryState("search", { defaultValue: "" });
  const [category, setCategory] = useQueryState("category", {
    defaultValue: "all",
  });
  const [tagsRaw, setTagsRaw] = useQueryState("tags", {
    history: "replace",
    parse: (v) => (typeof v === "string" ? v.split(",").filter(Boolean) : []),
    serialize: (v) => (Array.isArray(v) ? v.join(",") : ""),
    defaultValue: [],
  });
  const [sortBy, setSortBy] = useQueryState("sortBy", {
    defaultValue: "createdAt",
  });
  const [sortOrder, setSortOrder] = useQueryState("sortOrder", {
    defaultValue: "desc",
  });

  const [showFilters, setShowFilters] = useState(false);

  const { data: categories } = useCategories();
  const { data: popularTags } = usePopularTags();

  const tags = Array.isArray(tagsRaw) ? tagsRaw : [];

  const addTag = (tag: string) => {
    if (!tags.includes(tag)) {
      setTagsRaw([...tags, tag]);
    }
  };

  const removeTag = (tag: string) => {
    setTagsRaw(tags.filter((t) => t !== tag));
  };

  const clearFilters = () => {
    setSearch("");
    setCategory("all");
    setTagsRaw([]);
    setSortBy("createdAt");
    setSortOrder("desc");
  };

  const hasActiveFilters = search || category !== "all" || tags.length > 0;

  return (
    <section className="bg-card/30 backdrop-blur-sm border-b border-border/50 sticky top-16 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6">
        {/* Search Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search icons..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-background/50 border-border/50 focus:border-primary/50"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="bg-background/50 border-border/50"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
              {hasActiveFilters && (
                <Badge
                  variant="secondary"
                  className="ml-2 px-1.5 py-0.5 text-xs"
                >
                  {(search ? 1 : 0) +
                    (category !== "all" ? 1 : 0) +
                    tags.length}
                </Badge>
              )}
            </Button>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-muted-foreground hover:text-foreground"
              >
                Clear
              </Button>
            )}
          </div>
        </div>

        {/* Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-4">
                {/* Category Filter */}
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Category
                  </label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger className="bg-background/50 border-border/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories?.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Sort By */}
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Sort By
                  </label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="bg-background/50 border-border/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="createdAt">Date Created</SelectItem>
                      <SelectItem value="name">Name</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Sort Order */}
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Order
                  </label>
                  <Select value={sortOrder} onValueChange={setSortOrder}>
                    <SelectTrigger className="bg-background/50 border-border/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="desc">Newest First</SelectItem>
                      <SelectItem value="asc">Oldest First</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Tags */}
              {popularTags && popularTags.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Popular Tags
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {popularTags.slice(0, 12).map((tag) => (
                      <Badge
                        key={tag}
                        variant={tags.includes(tag) ? "default" : "outline"}
                        className="cursor-pointer hover:bg-primary/20 transition-colors"
                        onClick={() =>
                          tags.includes(tag) ? removeTag(tag) : addTag(tag)
                        }
                      >
                        {tag}
                        {tags.includes(tag) && <X className="w-3 h-3 ml-1" />}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Active Tags */}
              {tags.length > 0 && (
                <div className="mt-4">
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Active Filters
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="default"
                        className="cursor-pointer"
                        onClick={() => removeTag(tag)}
                      >
                        {tag}
                        <X className="w-3 h-3 ml-1" />
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
