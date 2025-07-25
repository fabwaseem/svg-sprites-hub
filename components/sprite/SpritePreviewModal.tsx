"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle
} from "@/components/ui/dialog";
import {
  cn,
  handleCopyIcon,
  handleDownloadIcon,
  handleDownloadSprite,
  truncateSvg,
} from "@/lib/utils";
import { Sprite } from "@/types";
import { Icon } from "@prisma/client";
import { AnimatePresence, motion } from "framer-motion";
import {
  Calendar,
  Check,
  Copy,
  Download,
  Heart,
  Info,
  Loader2,
  User
} from "lucide-react";
import moment from "moment";
import { usePathname, useRouter } from "next/navigation";
import { useQueryState } from "nuqs";
import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { FixedSizeGrid as Grid } from "react-window";
import SvgPreview from "./SvgPreview";

interface SpritePreviewModalProps {
  sprite: Sprite;
  isOpen: boolean;
  onClose: () => void;
}

// Virtualized icon item component
interface IconItemProps {
  columnIndex: number;
  rowIndex: number;
  style: React.CSSProperties;
  data: {
    icons: Icon[];
    selectedIcon: Icon | null;
    onIconSelect: (icon: Icon) => void;
    itemsPerRow: number;
    itemWidth: number;
  };
}

const IconItem = ({ columnIndex, rowIndex, style, data }: IconItemProps) => {
  const { icons, selectedIcon, onIconSelect, itemsPerRow } = data;
  const index = rowIndex * itemsPerRow + columnIndex;

  if (index >= icons.length) {
    return <div style={style} />;
  }

  const icon = icons[index];
  const isSelected = selectedIcon?.name === icon.name;

  return (
    <div style={style} className="p-2">
      <SvgPreview
        file={new File([icon.svg], icon.name, { type: "image/svg+xml" })}
        onClick={() => onIconSelect(icon)}
        className={cn(
          "size-14",
          isSelected ? "ring-2 ring-primary" : ""
        )}
      />
    </div>
  );
};

export function SpritePreviewModal({
  sprite,
  isOpen,
  onClose,
}: SpritePreviewModalProps) {
  const [selectedIcon, setSelectedIcon] = useState<Icon | null>(null);
  const [copied, setCopied] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const [tags, setTags] = useQueryState("tags", {
    history: "replace",
    parse: (v) => (typeof v === "string" ? v.split(",").filter(Boolean) : []),
    serialize: (v) => (Array.isArray(v) ? v.join(",") : ""),
    defaultValue: [],
  });
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [containerWidth, setContainerWidth] = useState(400);
  const containerRef = useRef<HTMLDivElement>(null);

  // Function to calculate container width
  const calculateContainerWidth = useCallback(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const padding = 64; // 32px padding on each side (p-8 = 2rem = 32px)
      const availableWidth = rect.width - padding;
      setContainerWidth(Math.max(300, Math.min(availableWidth, 600))); // Min 300px, max 600px
    }
  }, []);

  // Effect to calculate width on mount and modal open
  useEffect(() => {
    if (isOpen) {
      // Small delay to ensure dialog is fully rendered
      const timer = setTimeout(() => {
        calculateContainerWidth();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen, calculateContainerWidth]);

  // Effect to listen for window resize
  useEffect(() => {
    if (!isOpen) return;

    const handleResize = () => {
      calculateContainerWidth();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isOpen, calculateContainerWidth]);

  // Memoized calculations for virtualization
  const gridConfig = useMemo(() => {
    const itemWidth = 72; // 56px icon + 16px padding
    const itemHeight = 72;
    const itemsPerRow = Math.max(1, Math.floor(containerWidth / itemWidth));
    const rowCount = Math.ceil(sprite.icons.length / itemsPerRow);

    return {
      itemsPerRow,
      rowCount,
      itemWidth,
      itemHeight,
      containerWidth,
    };
  }, [containerWidth, sprite.icons.length]);

  // Memoized icon selection handler
  const handleIconSelect = useCallback((icon: Icon) => {
    setSelectedIcon(icon);
  }, []);

  // Memoized grid data
  const gridData = useMemo(() => ({
    icons: sprite.icons,
    selectedIcon,
    onIconSelect: handleIconSelect,
    itemsPerRow: gridConfig.itemsPerRow,
    itemWidth: gridConfig.itemWidth,
  }), [sprite.icons, selectedIcon, handleIconSelect, gridConfig.itemsPerRow, gridConfig.itemWidth]);

  // Helper for tag click
  const handleTagClick = useCallback((tag: string) => {
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

  const handleDownload = useCallback(async () => {
    setDownloadLoading(true);
    try {
      await handleDownloadSprite({ id: sprite.id, name: sprite.name });
    } finally {
      setDownloadLoading(false);
    }
  }, [sprite.id, sprite.name]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl flex flex-col md:flex-row ">
        <DialogTitle className="sr-only">{sprite.name}</DialogTitle>
        <DialogDescription className="sr-only">
          {sprite.description}
        </DialogDescription>
        {/* Preview Area */}
        <div ref={containerRef} className="flex-1 flex flex-col items-center justify-center bg-card p-8">
          {/* Virtualized Grid */}
          <div className="w-full h-[300px] mb-6 flex justify-center">
            <Grid
              columnCount={gridConfig.itemsPerRow}
              columnWidth={gridConfig.itemWidth}
              height={300}
              rowCount={gridConfig.rowCount}
              rowHeight={gridConfig.itemHeight}
              width={gridConfig.containerWidth}
              itemData={gridData}
              className="scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent"
            >
              {IconItem}
            </Grid>
          </div>
          {/* Selected Sprite Details */}
          <AnimatePresence>
            {selectedIcon && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-4 w-full max-w-md mx-auto bg-muted rounded-xl border border-border p-4 shadow"
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-lg text-primary">
                    {selectedIcon.name}
                  </h4>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleCopyIcon(selectedIcon, setCopied)}
                      variant="outline"
                      size="icon"
                      className={
                        copied
                          ? "bg-success/10 border-success text-success"
                          : ""
                      }
                    >
                      {copied ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                    <Button
                      onClick={() => handleDownloadIcon(selectedIcon)}
                      size="icon"
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="bg-card p-3 rounded font-mono text-sm overflow-x-auto border border-border">
                  {truncateSvg(selectedIcon.svg)}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Sidebar */}
        <div className="w-full  md:w-[340px] flex flex-col justify-between bg-background  gap-8  ">
          <div className="space-y-6">
            {/* Sprite Main Details */}
            <div className="mb-4">
              <h2 className="font-display font-bold text-xl text-primary mb-1">
                {sprite.name}
              </h2>
              <div className="flex items-center gap-2 mb-2">
                <Badge
                  variant="secondary"
                  className="text-xs font-medium bg-primary/10 text-primary border-0"
                >
                  {sprite.category}
                </Badge>
              </div>
              <p className="text-muted-foreground text-sm mb-0.5 line-clamp-3">
                {sprite.description}
              </p>
            </div>

            {/* Sprite Info */}
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2 text-primary">
                <Info className="w-4 h-4" />
                Info
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span>By {sprite.user.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span>{moment(sprite.createdAt).format("DD MMM YYYY")}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Download className="w-4 h-4 text-muted-foreground" />
                  <span>{sprite.downloadCount.toLocaleString()} downloads</span>
                </div>
              </div>
            </div>
            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {sprite.tags.map((tag) => {
                const isSelected = (tags || []).includes(tag);
                return (
                  <Badge
                    key={tag}
                    variant={isSelected ? "default" : "outline"}
                    className={`text-xs cursor-pointer transition-colors duration-200 ${isSelected
                      ? "bg-primary text-primary-foreground border-primary"
                      : "hover:bg-primary/10 hover:border-primary"
                      }`}
                    onClick={() => handleTagClick(tag)}
                  >
                    {tag}
                  </Badge>
                );
              })}
            </div>
          </div>
          {/* Actions */}
          <div className="space-y-2">
            <Button
              onClick={handleDownload}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              disabled={downloadLoading}
            >
              {downloadLoading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Download className="w-4 h-4 mr-2" />
              )}
              {downloadLoading ? "Downloading..." : "Download Sprite"}
            </Button>
            <Button variant="outline" className="w-full">
              <Heart className="w-4 h-4 mr-2" />
              Add to Favorites
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
