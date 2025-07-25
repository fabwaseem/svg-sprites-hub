"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Check,
  Copy,
  Download,
  FileImage,
  Grid3X3,
  List,
  Search
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
    searchTerm: string;
  };
}

const IconGridItem = ({
  columnIndex,
  rowIndex,
  style,
  data,
}: IconGridItemProps) => {
  const { icons, onIconClick, itemsPerRow, searchTerm } = data;
  const index = rowIndex * itemsPerRow + columnIndex;

  if (index >= icons.length) {
    return <div style={style} />;
  }

  const icon = icons[index];

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
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => onIconClick(icon)}
        className="group cursor-pointer bg-card border border-border rounded-xl p-3 hover:border-primary/50 hover:shadow-lg h-full flex flex-col"
      >
        <div className="flex items-center justify-center mb-2 bg-muted/50 rounded-lg p-3 group-hover:bg-primary/10 transition-colors flex-1 min-h-0">
          <div
            className="w-12 h-12 text-primary group-hover:text-primary transition-colors flex items-center justify-center"
            dangerouslySetInnerHTML={{ __html: (icon.svg) }}
          />
        </div>
        <div className="text-center flex-shrink-0">
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-full m-0 rounded-none">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-primary">
            {icon?.name}
          </DialogTitle>
        </DialogHeader>

        {icon && (
          <div className="flex-1 overflow-y-auto space-y-6">
            {/* Icon Preview */}
            <div className="bg-muted/30 rounded-xl p-8 flex items-center justify-center">
              <div
                className="w-24 h-24 text-primary"
                dangerouslySetInnerHTML={{ __html: icon.svg }}
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3">
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
              <div className="bg-muted rounded-lg p-4 font-mono text-sm overflow-x-auto max-h-60">
                <pre className="whitespace-pre-wrap break-all">{icon.svg}</pre>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
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

    // Extract symbols first
    const symbols = doc.querySelectorAll("symbol");
    symbols.forEach((symbol, index) => {
      const id = symbol.getAttribute("id") || `symbol-${index}`;
      const viewBox = symbol.getAttribute("viewBox") || "0 0 24 24";
      const innerHTML = symbol.innerHTML;

      if (innerHTML.trim()) {
        // Create proper SVG with the symbol's content
        const svgContent = `<svg viewBox="${viewBox}" xmlns="http://www.w3.org/2000/svg" fill="currentColor">${innerHTML}</svg>`;

        icons.push({
          id,
          name: id
            .replace(/[-_]/g, " ")
            .replace(/\b\w/g, (l: string) => l.toUpperCase()),
          svg: svgContent,
          viewBox,
        });
      }
    });

    // If no symbols found, try to extract defs with symbols
    if (icons.length === 0) {
      const defsSymbols = doc.querySelectorAll("defs symbol");
      defsSymbols.forEach((symbol, index) => {
        const id = symbol.getAttribute("id") || `defs-symbol-${index}`;
        const viewBox = symbol.getAttribute("viewBox") || "0 0 24 24";
        const innerHTML = symbol.innerHTML;

        if (innerHTML.trim()) {
          const svgContent = `<svg viewBox="${viewBox}" xmlns="http://www.w3.org/2000/svg" fill="currentColor">${innerHTML}</svg>`;

          icons.push({
            id,
            name: id
              .replace(/[-_]/g, " ")
              .replace(/\b\w/g, (l: string) => l.toUpperCase()),
            svg: svgContent,
            viewBox,
          });
        }
      });
    }

    // If still no symbols, try to extract groups or individual elements
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
            svg: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor">${innerHTML}</svg>`,
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
      const rect = containerRef.current.getBoundingClientRect();
      setContainerWidth(rect.width);
    }
  }, []);

  useEffect(() => {
    calculateContainerWidth();
    const resizeObserver = new ResizeObserver(calculateContainerWidth);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }
    return () => resizeObserver.disconnect();
  }, [calculateContainerWidth]);

  // Grid configuration
  const gridConfig = useMemo(() => {
    const minItemWidth = 160;
    const itemHeight = 140;
    const gap = 4; // Account for padding

    // Calculate items per row
    const itemsPerRow = Math.max(1, Math.floor((containerWidth - gap) / (minItemWidth + gap)));

    // Calculate actual item width
    const actualItemWidth = Math.floor((containerWidth - gap) / itemsPerRow) - gap;

    const rowCount = Math.ceil(filteredIcons.length / itemsPerRow);

    return {
      itemsPerRow,
      rowCount,
      itemWidth: actualItemWidth,
      itemHeight,
    };
  }, [containerWidth, filteredIcons.length]);

  const gridData = useMemo(
    () => ({
      icons: filteredIcons,
      onIconClick: setSelectedIcon,
      itemsPerRow: gridConfig.itemsPerRow,
      searchTerm,
    }),
    [filteredIcons, gridConfig.itemsPerRow, searchTerm]
  );

  return (
    <div className="min-h-screen w-full p-6 space-y-6">
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
            ? `Found ${filteredIcons.length} icon${filteredIcons.length === 1 ? "" : "s"
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
        className="w-full flex-1"
      >
        {filteredIcons.length > 0 ? (
          <Grid
            columnCount={gridConfig.itemsPerRow}
            columnWidth={gridConfig.itemWidth}
            height={Math.min(800, gridConfig.rowCount * gridConfig.itemHeight)}
            rowCount={gridConfig.rowCount}
            rowHeight={gridConfig.itemHeight}
            width={containerWidth}
            itemData={gridData}
            className="w-full"
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