"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { useToggleFavourite } from "@/hooks/useFavourite";
import { getRemainingCount, handleDownloadSprite } from "@/lib/utils";
import { Sprite } from "@/types";
import { motion } from "framer-motion";
import { Download, Eye, Heart, Loader2 } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useQueryState } from "nuqs";
import { useRef, useState, useCallback, useMemo, memo } from "react";
import { SpritePreviewModal } from "./SpritePreviewModal";
import SvgPreview from "./SvgPreview";

interface SpriteCardProps {
  sprite: Sprite;
}

export const SpriteCard = memo(function SpriteCard({ sprite }: SpriteCardProps) {
  const [showPreview, setShowPreview] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const [tags, setTags] = useQueryState("tags", {
    history: "replace",
    parse: (v) => (typeof v === "string" ? v.split(",").filter(Boolean) : []),
    serialize: (v) => (Array.isArray(v) ? v.join(",") : ""),
    defaultValue: [],
  });

  // Local favourite state
  const [isFavourite, setIsFavourite] = useState(!!sprite.isFavourite);
  const toggleFavourite = useToggleFavourite(sprite.id);
  const [downloadLoading, setDownloadLoading] = useState(false);

  // Memoized calculations
  const displayedIcons = useMemo(() => {
    const maxIcons = getRemainingCount(sprite.icons.length, 8) > 9 ? 8 : 9;
    return sprite.icons.slice(0, maxIcons);
  }, [sprite.icons]);

  const remainingCount = useMemo(() =>
    getRemainingCount(sprite.icons.length, 8),
    [sprite.icons.length]
  );

  const displayedTags = useMemo(() =>
    sprite.tags.slice(0, 3),
    [sprite.tags]
  );

  // Memoized handlers
  const handleTagClick = useCallback((tag: string) => {
    setShowPreview(false);
    if (pathname !== "/sprites") {
      router.push(`/sprites?tags=${encodeURIComponent(tag)}`);
    } else {
      const tagSet = new Set(tags || []);
      if (tagSet.has(tag)) {
        tagSet.delete(tag);
      } else {
        tagSet.add(tag);
      }
      setTags(Array.from(tagSet));
    }
  }, [pathname, router, tags, setTags]);

  const handleToggleFavourite = useCallback(() => {
    setIsFavourite((prev) => !prev);
    toggleFavourite.mutate(isFavourite);
  }, [toggleFavourite, isFavourite]);

  const handleDownload = useCallback(async () => {
    setDownloadLoading(true);
    try {
      await handleDownloadSprite({ id: sprite.id, name: sprite.name });
    } finally {
      setDownloadLoading(false);
    }
  }, [sprite.id, sprite.name]);

  const handlePreviewOpen = useCallback(() => {
    setShowPreview(true);
  }, []);

  const handlePreviewClose = useCallback(() => {
    setShowPreview(false);
  }, []);

  return (
    <>
      <motion.div
        ref={cardRef}
        whileHover={{ y: -8 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="h-full"
      >
        <Card>
          <CardHeader className="relative z-10">
            <div className="flex items-start justify-between ">
              <Badge
                variant="secondary"
                className="text-xs font-medium bg-primary/10 text-primary border-0"
              >
                {sprite.category}
              </Badge>
              <motion.button
                whileTap={{ scale: 0.8 }}
                whileHover={{ scale: 1.1 }}
                onClick={handleToggleFavourite}
                disabled={toggleFavourite.isPending}
                className={`p-2 rounded-full transition-all duration-300 ${isFavourite
                  ? "text-red-500 bg-red-50 dark:bg-red-950/30 shadow-sm"
                  : "text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30"
                  }`}
                aria-label={isFavourite ? "Unfavourite" : "Favourite"}
              >
                <Heart
                  className={`w-4 h-4 transition-all duration-300 ${isFavourite ? "fill-current scale-110" : ""
                    }`}
                />
              </motion.button>
            </div>

            <h3 className="font-display font-bold text-lg text-primary group-hover:text-primary transition-colors duration-300">
              {sprite.name}
            </h3>
          </CardHeader>

          <CardContent className=" relative z-10">
            {/* Sprite Preview */}
            <div className="bg-gradient-to-br from-muted/50 to-muted/80 rounded-xl p-6 mb-4 min-h-[140px] flex items-center justify-center relative overflow-hidden group-hover:from-primary/50 group-hover:to-primary/100 transition-all duration-500">
              {/* Background pattern */}
              <div className="absolute inset-0 opacity-5">
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
                    backgroundSize: "20px 20px",
                  }}
                />
              </div>

              <div className="flex flex-wrap justify-center items-center gap-4 relative z-10">
                {displayedIcons.map((spriteItem, index) => (
                  <SvgPreview
                    key={`${sprite.id}-${index}`}
                    file={
                      new File([spriteItem.svg], spriteItem.name, {
                        type: "image/svg+xml",
                      })
                    }
                    className="size-10"
                  />
                ))}
                {remainingCount > 0 && (
                  <motion.div
                    whileHover={{ scale: 1.2 }}
                    transition={{ duration: 0.2 }}
                    className="py-1.5 px-2 flex items-center justify-center bg-muted/60 border rounded-lg text-lg font-display text-primary"
                  >
                    +{remainingCount}
                  </motion.div>
                )}
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {displayedTags.map((tag) => {
                const isSelected = (tags || []).includes(tag);
                return (
                  <Badge
                    key={tag}
                    variant={isSelected ? "default" : "outline"}
                    className={`text-xs px-2 py-1 font-medium transition-colors duration-200 cursor-pointer ${isSelected
                      ? "bg-primary text-primary-foreground border-primary"
                      : "hover:bg-primary/10 hover:border-primary"
                      }`}
                    onClick={() => handleTagClick(tag)}
                  >
                    {tag}
                  </Badge>
                );
              })}
              {sprite.tags.length > 3 && (
                <Badge
                  variant="outline"
                  className="text-xs px-2 py-1 font-medium"
                >
                  +{sprite.tags.length - 3}
                </Badge>
              )}
            </div>
          </CardContent>

          <CardFooter className="gap-3 relative z-10">
            <Button
              onClick={handlePreviewOpen}
              variant="outline"
              size="sm"
              className="flex-1 "
            >
              <Eye className="w-4 h-4 mr-1" />
              Preview
            </Button>

            <Button
              onClick={handleDownload}
              size="sm"
              className="flex-1"
              disabled={downloadLoading}
            >
              {downloadLoading ? (
                <Loader2 className="w-4 h-4 mr-1 animate-spin" />
              ) : (
                <Download className="w-4 h-4 mr-1" />
              )}
              {downloadLoading ? "Downloading..." : "Download"}
            </Button>
          </CardFooter>
        </Card>
      </motion.div>

      <SpritePreviewModal
        sprite={sprite}
        isOpen={showPreview}
        onClose={handlePreviewClose}
      />
    </>
  );
});
