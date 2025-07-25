import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";
import { getSprites } from "@/lib/db/spriteUtils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const url = new URL(req.url!);
  const category = url.searchParams.get("category") || undefined;
  const userId = url.searchParams.get("userId") || undefined;
  const search = url.searchParams.get("search") || undefined;
  const tags = url.searchParams.getAll("tags");
  const page = url.searchParams.get("page")
    ? Number(url.searchParams.get("page"))
    : 1;
  const pageSize = url.searchParams.get("pageSize")
    ? Number(url.searchParams.get("pageSize"))
    : 20;
  const sortBy =
    (url.searchParams.get("sortBy") as "createdAt" | "downloadCount") ||
    "createdAt";
  const sortOrder =
    (url.searchParams.get("sortOrder") as "asc" | "desc") || "desc";

  // Get session user
  let sessionUserId: string | null = null;
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    sessionUserId = session?.user?.id || null;
  } catch {}

  const { sprites, meta } = await getSprites({
    category,
    userId,
    search,
    tags: tags.length ? tags : undefined,
    page,
    pageSize,
    sortBy,
    sortOrder,
    sessionUserId,
  });

  // Use favourites relation to set isFavourite
  const spritesWithFav = sprites.map((sprite) => ({
    ...sprite,
    isFavourite: sprite.favourites && sprite.favourites.length > 0,
  }));

  return NextResponse.json({ sprites: spritesWithFav, meta });
}

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({
    headers: req.headers,
  });
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { name, description, category, tags, icons } = body;

  if (!name || !description || !category || !icons || !icons.length) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  // Optimize SVGs before saving
  const optimizedIcons = icons.map((icon: { name: string; svg: string }) => ({
    name: icon.name,
    svg: icon.svg,
    user: { connect: { id: session.user.id } },
  }));

  // Save sprite and optimizedIcons
  const sprite = await prisma.sprite.create({
    data: {
      name,
      description,
      category,
      tags,
      user: { connect: { id: session.user.id } },
      icons: {
        create: optimizedIcons,
      },
    },
    include: { icons: true },
  });

  return NextResponse.json({ sprite });
}
