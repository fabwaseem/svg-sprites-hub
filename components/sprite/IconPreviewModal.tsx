"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { handleCopyIcon, handleDownloadIcon } from "@/lib/utils";
import { Icon } from "@prisma/client";
import {
  Check,
  Copy,
  Download,
  Palette,
  Code2,
  Sparkles,
  Package,
  ExternalLink,
} from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";

interface IconPreviewModalProps {
  icon: Icon & {
    sprite?: {
      id: string;
      name: string;
      category: string;
      tags: string[];
    };
  };
  isOpen: boolean;
  onClose: () => void;
}

export function IconPreviewModal({
  icon,
  isOpen,
  onClose,
}: IconPreviewModalProps) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"preview" | "code">("preview");
  const pathname = usePathname();
  const router = useRouter();

  // Check if we're already on a sprite page
  const isOnSpritePage = pathname?.startsWith("/sprites/");

  const handleViewSprite = () => {
    if (icon.sprite?.id) {
      onClose();
      router.push(`/sprites/${icon.sprite.id}`);
    }
  };

  // Format SVG code with proper indentation and line breaks
  const formatSvgCode = (svg: string) => {
    return svg
      .replace(/></g, ">\n<")
      .replace(/\s+/g, " ")
      .split("\n")
      .map((line, index) => {
        const trimmed = line.trim();
        if (trimmed.startsWith("</")) {
          return "  ".repeat(Math.max(0, index - 1)) + trimmed;
        }
        return "  ".repeat(index) + trimmed;
      })
      .join("\n");
  };

  const formattedSvg = formatSvgCode(icon.svg);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-hidden">
        <DialogTitle className="sr-only">{icon.name}</DialogTitle>
        <DialogDescription className="sr-only">
          Preview and download {icon.name} icon
        </DialogDescription>

        <div className="flex flex-col space-y-6">
          {/* Header */}
          <div className="text-center space-y-3 pt-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
              <Sparkles className="w-4 h-4" />
              SVG Icon
            </div>
            <h2 className="text-2xl font-bold text-primary">{icon.name}</h2>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center justify-center">
            <div className="flex bg-muted rounded-lg p-1">
              <button
                onClick={() => setActiveTab("preview")}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  activeTab === "preview"
                    ? "bg-background text-primary shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Palette className="w-4 h-4" />
                Preview
              </button>
              <button
                onClick={() => setActiveTab("code")}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  activeTab === "code"
                    ? "bg-background text-primary shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Code2 className="w-4 h-4" />
                Code
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="min-h-[300px]">
            <AnimatePresence mode="wait">
              {activeTab === "preview" ? (
                <motion.div
                  key="preview"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  {/* Large Icon Preview */}
                  <div className="flex justify-center">
                    <div className="relative">
                      <div className="w-48 h-48 flex items-center justify-center bg-gradient-to-br from-card to-muted rounded-2xl border border-border shadow-lg">
                        <div
                          className="w-32 h-32 flex items-center justify-center text-foreground"
                          dangerouslySetInnerHTML={{ __html: icon.svg }}
                        />
                      </div>
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                        <Sparkles className="w-3 h-3 text-primary-foreground" />
                      </div>
                    </div>
                  </div>

                  {/* Size Variations */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <Palette className="w-4 h-4" />
                      Size Variations
                    </h3>
                    <div className="flex items-center justify-center gap-6 p-4 bg-muted/50 rounded-lg">
                      {[16, 24, 32, 48].map((size) => (
                        <div
                          key={size}
                          className="flex flex-col items-center gap-2"
                        >
                          <div
                            className="flex items-center justify-center bg-background rounded-lg border border-border shadow-sm"
                            style={{ width: size + 16, height: size + 16 }}
                          >
                            <div
                              style={{ width: size, height: size }}
                              className="flex items-center justify-center text-foreground"
                              dangerouslySetInnerHTML={{ __html: icon.svg }}
                            />
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            {size}px
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="code"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <Code2 className="w-4 h-4" />
                      SVG Source Code
                    </h3>
                    <Badge variant="outline" className="text-xs">
                      {icon.svg.length} characters
                    </Badge>
                  </div>
                  <div className="relative bg-muted rounded-lg border border-border">
                    <ScrollArea className="h-64 w-full">
                      <pre className="p-4 font-mono text-sm whitespace-pre-wrap break-all">
                        <code className="text-foreground block">
                          {formattedSvg}
                        </code>
                      </pre>
                    </ScrollArea>
                    <div className="absolute top-2 right-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleCopyIcon(icon, setCopied)}
                        className="h-8 w-8 p-0 bg-background/90 backdrop-blur-sm border border-border/50 shadow-sm"
                      >
                        {copied ? (
                          <Check className="w-4 h-4 text-green-500" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Actions */}
          <div className="space-y-3 pt-4 border-t border-border">
            {/* View Sprite Button - Only show when not on sprite page and sprite exists */}
            {icon.sprite && !isOnSpritePage && (
              <Button
                onClick={handleViewSprite}
                variant="secondary"
                className="w-full"
                size="lg"
              >
                <Package className="w-4 h-4 mr-2" />
                View Sprite Collection
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            )}

            {/* Main Actions */}
            <div className="flex gap-3">
              <Button
                onClick={() => handleCopyIcon(icon, setCopied)}
                variant="outline"
                className="flex-1"
                size="lg"
              >
                {copied ? (
                  <Check className="w-4 h-4 mr-2 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4 mr-2" />
                )}
                {copied ? "Copied!" : "Copy SVG"}
              </Button>
              <Button
                onClick={() => handleDownloadIcon(icon)}
                className="flex-1"
                size="lg"
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
