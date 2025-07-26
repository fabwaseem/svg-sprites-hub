"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { Icon } from "@prisma/client";

export interface SpriteIconsResponse {
  icons: Icon[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };
}

async function fetchSpriteIcons({
  spriteId,
  pageParam = 2, // Start from page 2 since page 1 is loaded with sprite details
}: {
  spriteId: string;
  pageParam?: number;
}): Promise<SpriteIconsResponse> {
  const params = new URLSearchParams({
    page: pageParam.toString(),
    pageSize: "30",
    iconsOnly: "true",
  });

  const response = await fetch(`/api/sprites/${spriteId}?${params}`);
  if (!response.ok) {
    throw new Error("Failed to fetch sprite icons");
  }
  return response.json();
}

export function useSpriteIcons(spriteId: string) {
  return useInfiniteQuery({
    queryKey: ["sprite-icons", spriteId],
    queryFn: ({ pageParam }) => fetchSpriteIcons({ spriteId, pageParam }),
    initialPageParam: 2,
    getNextPageParam: (lastPage) => {
      return lastPage.pagination.hasMore
        ? lastPage.pagination.page + 1
        : undefined;
    },
    enabled: !!spriteId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
