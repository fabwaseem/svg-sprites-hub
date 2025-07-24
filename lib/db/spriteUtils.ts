import { prisma } from "./prisma";
import { Prisma } from "@prisma/client";

interface GetSpritesOptions {
  category?: string;
  tags?: string[];
  userId?: string;
  search?: string;
  page?: number;
  pageSize?: number;
  sortBy?: "createdAt" | "downloadCount";
  sortOrder?: "asc" | "desc";
  sessionUserId?: string | null;
}

export async function getSprites(options: GetSpritesOptions = {}) {
  const {
    category,
    tags,
    userId,
    search,
    page = 1,
    pageSize = 20,
    sortBy = "createdAt",
    sortOrder = "desc",
    sessionUserId,
  } = options;

  const where: Prisma.SpriteWhereInput = {};
  if (category) where.category = category;
  if (userId) where.userId = userId;
  if (tags && tags.length > 0) {
    where.tags = { hasEvery: tags };
  }
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }

  const total = await prisma.sprite.count({ where });
  const totalPages = Math.ceil(total / pageSize);
  const hasMore = page < totalPages;

  const sprites = await prisma.sprite.findMany({
    where,
    include: {
      user: true,
      icons: true,
      favourites: sessionUserId
        ? { where: { userId: sessionUserId } }
        : undefined,
    },
    orderBy: {
      [sortBy]: sortOrder,
    },
    skip: (page - 1) * pageSize,
    take: pageSize,
  });

  return {
    sprites,
    meta: {
      page,
      pageSize,
      total,
      totalPages,
      hasMore,
    },
  };
}
