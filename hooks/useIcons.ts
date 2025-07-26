"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { Icon } from "@prisma/client";
import { Pagination } from "@/types";

export interface IconsResponse {
  icons: Icon[];
  pagination: Pagination;
}

export interface UseIconsOptions {
  search?: string;
  category?: string;
  tags?: string[];
  sortBy?: "createdAt" | "name";
  sortOrder?: "asc" | "desc";
  pageSize?: number;
}

async function fetchIcons({
  pageParam = 1,
  search,
  category,
  tags,
  sortBy = "createdAt",
  sortOrder = "desc",
  pageSize = 20,
}: UseIconsOptions & { pageParam?: number }): Promise<IconsResponse> {
  const params = new URLSearchParams({
    page: pageParam.toString(),
    pageSize: pageSize.toString(),
    sortBy,
    sortOrder,
  });

  if (search) params.append("search", search);
  if (category) params.append("category", category);
  if (tags?.length) {
    tags.forEach((tag) => params.append("tags", tag));
  }

  const response = await fetch(`/api/icons?${params}`);
  if (!response.ok) {
    throw new Error("Failed to fetch icons");
  }
  return response.json();
}

export function useIcons(options: UseIconsOptions = {}) {
  return useInfiniteQuery({
    queryKey: ["icons", options],
    queryFn: ({ pageParam }) => fetchIcons({ ...options, pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.pagination.hasMore
        ? lastPage.pagination.page + 1
        : undefined;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
