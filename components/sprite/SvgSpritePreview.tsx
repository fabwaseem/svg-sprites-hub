"use client";

import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Download,
  Copy,
  Check,
  FileImage,
  Grid3X3,
  List,
  Search,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { FixedSizeGrid as Grid } from "react-window";

interface SvgSpritePreviewProps {
  file: File;
  content: string;
  onReset: () => void;
}

interface ExtractedIcon {
  id: string;
  name: string;
  svg: string;
  viewBox?: string;
}

// Individual icon component for the grid
interface IconGridItemProps {
  columnIndex: number;
  rowIndex: number;
  style: React.CSSProperties;
  data: {
    icons: ExtractedIcon[];
    onIconClick: (icon: ExtractedIcon) => void;
    itemsPerRow: number;
    itemWidth: number;
    searchTerm: string;
  };
}

const IconGridItem = ({
  columnIndex,
  rowIndex,
  style,
  data,
}: IconGridItemProps) => {
  const { icons, onIconClick, itemsPerRow, itemWidth, searchTerm } = data;
  const index = rowIndex * itemsPerRow + columnIndex;

  if (index >= icons.length) {
    return <div style={style} />;
  }

  const icon = icons[index];
  const iconSize = Math.max(40, itemWidth - 32); // Min 40px, subtract padding

  // Highlight search term in name
  const highlightedName = searchTerm
    ? icon.name.replace(
        new RegExp(`(${searchTerm})`, "gi"),
        '<mark class="bg-yellow-200 dark:bg-yellow-800 px-1 rounded">$1</mark>'
      )
    : icon.name;

  return (
    <div style={style} className="p-2">
      <motion.div
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onIconClick(icon)}
        className="group cursor-pointer bg-card border border-border rounded-xl p-4 hover:border-primary/50 hover:shadow-lg "
      >
        <div
          className="flex items-center justify-center mb-3 bg-muted/50 rounded-lg p-3 group-hover:bg-primary/10 transition-colors"
          style={{ height: `${iconSize + 24}px` }}
        >
          <div
            style={{
              width: `${iconSize}px`,
              height: `${iconSize}px`,
              maxWidth: "100%",
              maxHeight: "100%",
            }}
            className="text-primary group-hover:text-primary transition-colors"
            dangerouslySetInnerHTML={{ __html: icon.svg }}
          />
        </div>
        <div className="text-center">
          <p
            className="text-xs font-medium text-muted-foreground group-hover:text-primary transition-colors truncate"
            dangerouslySetInnerHTML={{ __html: highlightedName }}
          />
        </div>
      </motion.div>
    </div>
  );
};

// Icon detail modal
const IconDetailModal = ({
  icon,
  isOpen,
  onClose,
}: {
  icon: ExtractedIcon | null;
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    if (!icon) return;

    try {
      await navigator.clipboard.writeText(icon.svg);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  }, [icon]);

  const handleDownload = useCallback(() => {
    if (!icon) return;

    const blob = new Blob([icon.svg], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${icon.name}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [icon]);

  if (!isOpen || !icon) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-background border border-border rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-primary">{icon.name}</h3>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Icon Preview */}
          <div className="bg-muted/30 rounded-xl p-8 mb-6 flex items-center justify-center">
            <div
              className="w-24 h-24 text-primary"
              dangerouslySetInnerHTML={{ __html: icon.svg }}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 mb-6">
            <Button onClick={handleCopy} className="flex-1 gap-2">
              {copied ? (
                <Check className="w-4 h-4" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
              {copied ? "Copied!" : "Copy SVG"}
            </Button>
            <Button
              onClick={handleDownload}
              variant="outline"
              className="flex-1 gap-2"
            >
              <Download className="w-4 h-4" />
              Download
            </Button>
          </div>

          {/* SVG Code */}
          <div className="space-y-3">
            <h4 className="font-medium text-sm text-muted-foreground">
              SVG Code:
            </h4>
            <div className="bg-muted rounded-lg p-4 font-mono text-sm overflow-x-auto max-h-40">
              <pre className="whitespace-pre-wrap break-all">{icon.svg}</pre>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export function SvgSpritePreview({
  file,
  content,
  onReset,
}: SvgSpritePreviewProps) {
  const [selectedIcon, setSelectedIcon] = useState<ExtractedIcon | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [containerWidth, setContainerWidth] = useState(800);
  const containerRef = useRef<HTMLDivElement>(null);

  // Extract icons from SVG sprite
  const extractedIcons = useMemo(() => {
    const icons: ExtractedIcon[] = [];
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, "image/svg+xml");

    // Extract symbols
    const symbols = doc.querySelectorAll("symbol");
    symbols.forEach((symbol, index) => {
      const id = symbol.getAttribute("id") || `symbol-${index}`;
      const viewBox = symbol.getAttribute("viewBox") || "0 0 24 24";
      const innerHTML = symbol.innerHTML;

      if (innerHTML.trim()) {
        icons.push({
          id,
          name: id
            .replace(/[-_]/g, " ")
            .replace(/\b\w/g, (l: string) => l.toUpperCase()),
          svg: `<svg viewBox="${viewBox}" xmlns="http://www.w3.org/2000/svg">${innerHTML}</svg>`,
          viewBox,
        });
      }
    });

    // If no symbols, try to extract groups or individual elements
    if (icons.length === 0) {
      const groups = doc.querySelectorAll("g[id]");
      groups.forEach((group, index) => {
        const id = group.getAttribute("id") || `group-${index}`;
        const innerHTML = group.outerHTML;

        if (innerHTML.trim()) {
          icons.push({
            id,
            name: id
              .replace(/[-_]/g, " ")
              .replace(/\b\w/g, (l: string) => l.toUpperCase()),
            svg: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">${innerHTML}</svg>`,
            viewBox: "0 0 24 24",
          });
        }
      });
    }

    return icons;
  }, [content]);

  // Filter icons based on search
  const filteredIcons = useMemo(() => {
    if (!searchTerm) return extractedIcons;
    return extractedIcons.filter(
      (icon) =>
        icon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        icon.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [extractedIcons, searchTerm]);

  // Calculate container width
  const calculateContainerWidth = useCallback(() => {
    if (containerRef.current) {
      // Use clientWidth for accurate width (excludes scrollbars)
      const availableWidth = containerRef.current.clientWidth;
      setContainerWidth(Math.max(200, availableWidth)); // Minimum 200px for at least 1 item
    }
  }, []);

  useEffect(() => {
    calculateContainerWidth();
    const handleResize = () => calculateContainerWidth();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [calculateContainerWidth]);

  // Grid configuration
  const gridConfig = useMemo(() => {
    const minItemWidth = 180; // Minimum item width
    const maxItemWidth = 250; // Maximum item width
    const itemHeight = 180; // Base item height

    // Calculate how many items can fit
    let itemsPerRow = Math.max(1, Math.floor(containerWidth / minItemWidth));

    // Calculate actual item width
    let actualItemWidth = Math.floor(containerWidth / itemsPerRow);

    // If items are too wide, reduce the number per row
    while (actualItemWidth > maxItemWidth && itemsPerRow > 1) {
      itemsPerRow--;
      actualItemWidth = Math.floor(containerWidth / itemsPerRow);
    }

    // Ensure we don't exceed container width
    const totalWidth = actualItemWidth * itemsPerRow;
    const finalGridWidth = Math.min(totalWidth, containerWidth - 10); // 10px buffer

    const rowCount = Math.ceil(filteredIcons.length / itemsPerRow);

    return {
      itemsPerRow,
      rowCount,
      itemWidth: actualItemWidth,
      itemHeight,
      containerWidth: finalGridWidth,
    };
  }, [containerWidth, filteredIcons.length]);

  const gridData = useMemo(
    () => ({
      icons: filteredIcons,
      onIconClick: setSelectedIcon,
      itemsPerRow: gridConfig.itemsPerRow,
      itemWidth: gridConfig.itemWidth,
      searchTerm,
    }),
    [filteredIcons, gridConfig.itemsPerRow, gridConfig.itemWidth, searchTerm]
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={onReset} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <div>
            <h2 className="text-2xl font-bold text-primary">{file.name}</h2>
            <p className="text-muted-foreground">
              {extractedIcons.length} icons found •{" "}
              {(file.size / 1024).toFixed(1)} KB
            </p>
          </div>
        </div>
        <Badge variant="secondary" className="gap-2">
          <FileImage className="w-4 h-4" />
          SVG Sprite
        </Badge>
      </motion.div>

      {/* Search and Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search icons..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="icon"
            onClick={() => setViewMode("grid")}
          >
            <Grid3X3 className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="icon"
            onClick={() => setViewMode("list")}
          >
            <List className="w-4 h-4" />
          </Button>
        </div>
      </motion.div>

      {/* Results Info */}
      {searchTerm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm text-muted-foreground"
        >
          {filteredIcons.length > 0
            ? `Found ${filteredIcons.length} icon${
                filteredIcons.length === 1 ? "" : "s"
              } matching "${searchTerm}"`
            : `No icons found matching "${searchTerm}"`}
        </motion.div>
      )}

      {/* Icons Grid */}
      <motion.div
        ref={containerRef}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="min-h-[400px] w-full overflow-hidden"
        style={{
          boxSizing: "border-box",
          width: "100%",
          maxWidth: "100vw",
          overflow: "hidden",
        }}
      >
        {filteredIcons.length > 0 ? (
          <Grid
            columnCount={gridConfig.itemsPerRow}
            columnWidth={gridConfig.itemWidth}
            height={Math.min(600, gridConfig.rowCount * gridConfig.itemHeight)}
            rowCount={gridConfig.rowCount}
            rowHeight={gridConfig.itemHeight}
            width={containerWidth}
            itemData={gridData}
            className="scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent"
          >
            {IconGridItem}
          </Grid>
        ) : (
          <div className="text-center py-16">
            <div className="p-4 bg-muted/30 rounded-full w-fit mx-auto mb-4">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-muted-foreground mb-2">
              No icons found
            </h3>
            <p className="text-muted-foreground">
              Try adjusting your search terms or upload a different sprite file.
            </p>
          </div>
        )}
      </motion.div>

      {/* Icon Detail Modal */}
      <IconDetailModal
        icon={selectedIcon}
        isOpen={!!selectedIcon}
        onClose={() => setSelectedIcon(null)}
      />
    </div>
  );
}
