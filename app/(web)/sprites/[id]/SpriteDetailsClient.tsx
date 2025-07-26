"use client";

import { IconCard } from "@/components/sprite/IconCard";
import { IconCardSkeleton } from "@/components/sprite/IconCardSkeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useSpriteIcons } from "@/hooks/useSpriteIcons";
import { handleDownloadSprite } from "@/lib/utils";
import { Sprite } from "@/types";
import { Icon } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Download,
  Heart,
  Loader2,
  Package,
  Share2,
  Sparkles,
  TrendingUp,
  User,
} from "lucide-react";
import moment from "moment";
import Link from "next/link";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { useInView } from "react-intersection-observer";

// Fetch sprite details (now returns only first 30 icons)
async function fetchSpriteDetails(
  id: string
): Promise<Sprite & { totalIcons: number; hasMoreIcons: boolean }> {
  const response = await fetch(`/api/sprites/${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch sprite details");
  }
  return response.json();
}

// Memoized IconCard to prevent unnecessary re-renders
const MemoizedIconCard = memo(IconCard);

// Memoized animated icon item component
const AnimatedIconItem = memo(
  ({ icon, index }: { icon: Icon; index: number }) => (
    <motion.div
      key={icon.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.05, 0.3) }}
    >
      <MemoizedIconCard icon={icon} />
    </motion.div>
  )
);

AnimatedIconItem.displayName = "AnimatedIconItem";

interface SpriteDetailsClientProps {
  spriteId: string;
}

export default function SpriteDetailsClient({
  spriteId,
}: SpriteDetailsClientProps) {
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);

  // Fetch sprite details (first 30 icons)
  const {
    data: sprite,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["sprite", spriteId],
    queryFn: () => fetchSpriteDetails(spriteId),
    enabled: !!spriteId,
  });

  // Fetch additional icons with infinite loading (starts from page 2)
  const {
    data: additionalIconsData,
    isFetching: isFetchingMoreIcons,
    fetchNextPage,
    hasNextPage,
  } = useSpriteIcons(spriteId);

  // Intersection observer for infinite scroll
  const { ref, inView } = useInView({
    triggerOnce: false,
    threshold: 0,
    rootMargin: "200px",
  });

  // Fetch next page when in view
  const handleFetchNextPage = useCallback(() => {
    if (inView && hasNextPage && !isFetchingMoreIcons) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingMoreIcons, fetchNextPage]);

  useEffect(() => {
    handleFetchNextPage();
  }, [handleFetchNextPage]);

  // Combine initial icons with additional loaded icons
  const allIcons = useMemo(() => {
    const initialIcons = sprite?.icons || [];
    const additionalIcons =
      additionalIconsData?.pages.flatMap((page) => page.icons) || [];
    return [...initialIcons, ...additionalIcons];
  }, [sprite?.icons, additionalIconsData?.pages]);

  const handleDownload = async () => {
    if (!sprite) return;
    setDownloadLoading(true);
    try {
      await handleDownloadSprite({ id: sprite.id, name: sprite.name });
    } finally {
      setDownloadLoading(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: sprite?.name,
        text: `Check out this amazing SVG sprite: ${sprite?.name}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const toggleFavorite = () => {
    setIsFavorited(!isFavorited);
    // TODO: Implement favorite API call
  };

  if (isLoading) {
    return (
      <main className="min-h-screen pt-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
          {/* Header Skeleton */}
          <div className="mb-8">
            <div className="h-6 w-20 bg-muted rounded mb-4" />
            <div className="h-10 w-64 bg-muted rounded mb-4" />
            <div className="h-6 w-96 bg-muted rounded" />
          </div>

          {/* Content Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="h-64 bg-muted rounded-lg mb-6" />
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {Array.from({ length: 12 }).map((_, i) => (
                  <IconCardSkeleton key={i} />
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <div className="h-48 bg-muted rounded-lg" />
              <div className="h-32 bg-muted rounded-lg" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error || !sprite) {
    return (
      <main className="min-h-screen pt-16 bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-primary mb-4">
            Sprite Not Found
          </h1>
          <p className="text-muted-foreground mb-6">
            The sprite you&apos;re looking for doesn&apos;t exist or has been
            removed.
          </p>
          <Button asChild>
            <Link href="/sprites">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Sprites
            </Link>
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/sprites">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Sprites
            </Link>
          </Button>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Package className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold text-primary mb-2">
                    {sprite.name}
                  </h1>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      {sprite.user.name}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {moment(sprite.createdAt).format("MMM DD, YYYY")}
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-4 h-4" />
                      {sprite.downloadCount.toLocaleString()} downloads
                    </div>
                  </div>
                </div>
              </div>

              {sprite.description && (
                <p className="text-lg text-muted-foreground mb-4 max-w-2xl">
                  {sprite.description}
                </p>
              )}

              <div className="flex items-center gap-2 mb-6">
                <Badge
                  variant="secondary"
                  className="bg-primary/10 text-primary"
                >
                  {sprite.category}
                </Badge>
                {sprite.tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 ml-6">
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={toggleFavorite}
                className={isFavorited ? "text-red-500" : ""}
              >
                <Heart
                  className={`w-4 h-4 ${isFavorited ? "fill-current" : ""}`}
                />
              </Button>
              <Button
                onClick={handleDownload}
                disabled={downloadLoading}
                size="lg"
              >
                {downloadLoading ? (
                  <div className="w-4 h-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                ) : (
                  <Download className="w-4 h-4 mr-2" />
                )}
                Download Sprite
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Stats Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8"
            >
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Sparkles className="w-6 h-6 text-primary" />
                  </div>
                  <div className="text-2xl font-bold text-primary mb-1">
                    {sprite.totalIcons || sprite.icons.length}
                  </div>
                  <div className="text-sm text-muted-foreground">Icons</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Download className="w-6 h-6 text-green-500" />
                  </div>
                  <div className="text-2xl font-bold text-primary mb-1">
                    {sprite.downloadCount.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">Downloads</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Clock className="w-6 h-6 text-blue-500" />
                  </div>
                  <div className="text-2xl font-bold text-primary mb-1">
                    {moment(sprite.createdAt).fromNow()}
                  </div>
                  <div className="text-sm text-muted-foreground">Created</div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Icons Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-primary">
                  All Icons ({sprite.totalIcons || sprite.icons.length})
                </h2>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {allIcons.map((icon, index) => (
                  <AnimatedIconItem key={icon.id} icon={icon} index={index} />
                ))}

                {/* Show skeletons when loading more */}
                {isFetchingMoreIcons &&
                  Array.from({ length: 12 }).map((_, i) => (
                    <IconCardSkeleton key={`loading-${i}`} />
                  ))}
              </div>

              {/* Infinite scroll sentinel */}
              {hasNextPage && (
                <div
                  ref={ref}
                  className="flex justify-center items-center py-12"
                >
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  <span className="ml-2 text-muted-foreground">
                    Loading more icons...
                  </span>
                </div>
              )}

              {/* End message */}
              {!hasNextPage && allIcons.length > 30 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">
                    You&apos;ve seen all {sprite.totalIcons || allIcons.length}{" "}
                    icons! 🎉
                  </p>
                </div>
              )}
            </motion.div>
          </div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-6"
          >
            {/* Author Card */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-primary mb-4 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Author
                </h3>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium text-primary">
                      {sprite.user.name}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {sprite.user.username && `@${sprite.user.username}`}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Details Card */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-primary mb-4">Details</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Category</span>
                    <Badge variant="secondary">{sprite.category}</Badge>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Icons</span>
                    <span className="font-medium">
                      {sprite.totalIcons || sprite.icons.length}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Downloads</span>
                    <span className="font-medium">
                      {sprite.downloadCount.toLocaleString()}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Created</span>
                    <span className="font-medium">
                      {moment(sprite.createdAt).format("MMM DD, YYYY")}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Updated</span>
                    <span className="font-medium">
                      {moment(sprite.updatedAt).format("MMM DD, YYYY")}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tags Card */}
            {sprite.tags.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-primary mb-4">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {sprite.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="outline"
                        className="cursor-pointer hover:bg-accent"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </div>
      </div>
    </main>
  );
}
