import { Icon, Sprite as PrismaSprite, User } from "@prisma/client";

export type Sprite = PrismaSprite & {
  user: User;
  icons: Icon[];
  isFavourite: boolean;
};

export type Pagination = {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  hasMore: boolean;
};
