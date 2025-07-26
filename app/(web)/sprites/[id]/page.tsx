import { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import SpriteDetailsClient from "./SpriteDetailsClient";

interface PageProps {
  params: Promise<{ id: string }>;
}

// Fetch sprite for metadata generation
async function getSprite(id: string) {
  try {
    const sprite = await prisma.sprite.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
          },
        },
        icons: {
          take: 5, // Just get a few icons for OG image
          select: {
            id: true,
            name: true,
            svg: true,
          },
        },
        _count: {
          select: {
            icons: true,
          },
        },
      },
    });

    if (!sprite) {
      return null;
    }

    return {
      ...sprite,
      totalIcons: sprite._count.icons,
    };
  } catch (error) {
    console.error("Error fetching sprite for metadata:", error);
    return null;
  }
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const sprite = await getSprite(id);

  if (!sprite) {
    return {
      title: "Sprite Not Found | SpriteHub",
      description: "The sprite you're looking for doesn't exist.",
    };
  }

  const title = `${sprite.name} - SVG Sprite Collection | SpriteHub`;
  const description = sprite.description
    ? `${sprite.description} Download ${sprite.totalIcons} SVG icons in the ${sprite.category} category. Created by ${sprite.user.name}.`
    : `Download ${sprite.totalIcons} high-quality SVG icons from the ${sprite.name} sprite collection in the ${sprite.category} category. Created by ${sprite.user.name}.`;

  const ogImageUrl = `/api/og/sprite/${id}`;
  const url = `${
    process.env.NEXT_PUBLIC_APP_URL || "https://spritehub.com"
  }/sprites/${id}`;

  return {
    title,
    description,
    keywords: [
      sprite.name,
      sprite.category,
      ...sprite.tags,
      "SVG icons",
      "sprite collection",
      "vector icons",
      "UI icons",
      "free icons",
      "download icons",
    ].join(", "),
    authors: [{ name: sprite.user.name }],
    creator: sprite.user.name,
    publisher: "SpriteHub",
    openGraph: {
      title,
      description,
      url,
      siteName: "SpriteHub",
      type: "website",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${sprite.name} - SVG Sprite Collection with ${sprite.totalIcons} icons`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageUrl],
      creator: sprite.user.username ? `@${sprite.user.username}` : undefined,
    },
    alternates: {
      canonical: url,
    },
    other: {
      "sprite:name": sprite.name,
      "sprite:category": sprite.category,
      "sprite:icons": sprite.totalIcons.toString(),
      "sprite:downloads": sprite.downloadCount.toString(),
      "sprite:author": sprite.user.name,
    },
  };
}

export default async function SpriteDetailsPage({ params }: PageProps) {
  const { id } = await params;
  const sprite = await getSprite(id);

  if (!sprite) {
    notFound();
  }

  return <SpriteDetailsClient spriteId={id} />;
}
