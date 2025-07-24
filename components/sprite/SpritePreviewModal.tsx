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
import { useState } from "react";
import { ScrollArea } from "../ui/scroll-area";
import SvgPreview from "./SvgPreview";

interface SpritePreviewModalProps {
  sprite: Sprite;
  isOpen: boolean;
  onClose: () => void;
}

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

  // Helper for tag click
  function handleTagClick(tag: string) {
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
  }

  async function handleDownload() {
    setDownloadLoading(true);
    try {
      await handleDownloadSprite({ id: sprite.id, name: sprite.name });
    } finally {
      setDownloadLoading(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl flex flex-col md:flex-row ">
        <DialogTitle className="sr-only">{sprite.name}</DialogTitle>
        <DialogDescription className="sr-only">
          {sprite.description}
        </DialogDescription>
        {/* Preview Area */}
        <div className="flex-1  flex flex-col  items-center justify-center bg-card p-8 ">
          <ScrollArea className="max-h-[300px] w-full " fadeColors="from-card ">
            <div className="w-full flex flex-wrap gap-4 justify-center items-center mb-6">
              {sprite.icons.map((spriteItem, index) => (
                <SvgPreview
                  key={index}
                  file={
                    new File([spriteItem.svg], spriteItem.name, {
                      type: "image/svg+xml",
                    })
                  }
                  onClick={() => setSelectedIcon(spriteItem)}
                  className={cn(
                    "size-14",
                    selectedIcon?.name === spriteItem.name
                      ? "ring-2 ring-primary"
                      : ""
                  )}
                />
              ))}
            </div>
          </ScrollArea>
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
              {sprite.tags.map((tag, index) => {
                const isSelected = (tags || []).includes(tag);
                return (
                  <Badge
                    key={index}
                    variant={isSelected ? "default" : "outline"}
                    className={`text-xs cursor-pointer transition-colors duration-200 ${
                      isSelected
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
