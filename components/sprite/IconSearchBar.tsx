"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { useQueryState } from "nuqs";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";

export function IconSearchBar() {
  const [search, setSearch] = useQueryState("search");
  const [searchInput, setSearchInput] = useState(search || "");
  const [debouncedSearch] = useDebounce(searchInput, 400);
  const [sortBy, setSortBy] = useQueryState("sortBy", {
    defaultValue: "createdAt",
  });
  const [, setSortOrder] = useQueryState("sortOrder", {
    defaultValue: "desc",
  });

  // Sync debounced search to URL param
  useEffect(() => {
    setSearch(debouncedSearch || null);
  }, [debouncedSearch, setSearch]);

  return (
    <motion.section
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="px-4 py-8 max-w-6xl mx-auto"
    >
      <div className="bg-card/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-border">
        {/* Search Bar & Sorting */}
        <div className="relative flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              placeholder="Search icons..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pl-12 pr-4 h-12 text-base rounded-xl border-border bg-background/50 focus:bg-background transition-colors"
            />
          </div>
          <Select
            value={sortBy === "name" ? "name" : "latest"}
            onValueChange={(val) => {
              if (val === "name") {
                setSortBy("name");
                setSortOrder("asc");
              } else {
                setSortBy("createdAt");
                setSortOrder("desc");
              }
            }}
          >
            <SelectTrigger className="w-40 h-12 rounded-xl border-border">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="latest">Latest</SelectItem>
              <SelectItem value="name">Name</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </motion.section>
  );
}
