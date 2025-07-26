import { Sprite } from "@/types";
import { Icon } from "@prisma/client";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const handleDownloadIcon = (icon: Icon) => {
  const blob = new Blob([icon.svg], { type: "image/svg+xml" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${icon.name}.svg`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const handleDownloadSprite = async ({
  name,
  icons,
  id,
}: {
  name?: string;
  icons?: Icon[];
  id?: string;
}) => {
  const res = await fetch("/api/download", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, icons, id }),
  });
  if (!res.ok) throw new Error("Failed to generate sprite");
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${getSpriteName(name)}.svg`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const handleCopyIcon = (
  icon: Icon,
  setCopied: (copied: boolean) => void
) => {
  navigator.clipboard.writeText(icon.svg);
  setCopied(true);
  setTimeout(() => setCopied(false), 2000);
};

export const handleCopySprite = (
  sprite: Sprite,
  setCopied: (copied: boolean) => void
) => {
  navigator.clipboard.writeText(JSON.stringify(sprite));
  setCopied(true);
  setTimeout(() => setCopied(false), 2000);
};

export const truncateSvg = (svg: string, maxLength: number = 48) => {
  let elementCount = 0;

  return svg.replace(
    /<([a-zA-Z][a-zA-Z0-9]*)[^>]*\/?>(?:[^<]*<\/\1>)?/g,
    (match, tagName) => {
      // Skip the root svg element
      if (tagName.toLowerCase() === "svg") {
        return match;
      }

      elementCount++;

      // Remove elements after the first 2
      if (elementCount > 2) {
        return "";
      }

      // Apply length truncation to d attributes if present
      return match.replace(
        /(\s[dD]=["'])(.*?)(["'])/g,
        (attrMatch, prefix, value, suffix) => {
          if (value.length > maxLength) {
            return `${prefix}${value.slice(0, maxLength)}...${suffix}`;
          }
          return attrMatch;
        }
      );
    }
  );
};

export const getRemainingCount = (total: number, visible: number): number => {
  const remaining = total - visible;
  if (remaining > 0) {
    return remaining;
  }
  return 0;
};

export const getSpriteName = (name?: string) => {
  return (
    name
      ?.toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")
      .replace(/-+/g, "-") || "sprite"
  );
};

export const slugToName = (slug?: string) => {
  return (
    slug?.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase()) ||
    "sprite"
  );
};

export const symbolToSvg = (symbol: SVGSymbolElement) => {
  const attrs = Array.from(symbol.attributes)
    .map((attr) => `${attr.name}='${attr.value}'`)
    .join(" ");
  return `<svg xmlns='http://www.w3.org/2000/svg' ${attrs}>${symbol.innerHTML}</svg>`;
};

export const getUniqueSvgFiles = async (
  files: File[],
  file: File,
  namePrefix = "uploaded"
): Promise<File[]> => {
  const text = await file.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(text, "image/svg+xml");
  const symbols = Array.from(doc.querySelectorAll("symbol"));
  let svgs: string[];
  if (symbols.length > 0) {
    svgs = symbols.map((symbol) => {
      const attrs = Array.from(symbol.attributes)
        .map((attr) => `${attr.name}='${attr.value}'`)
        .join(" ");
      return `<svg xmlns='http://www.w3.org/2000/svg' ${attrs}>${symbol.innerHTML}</svg>`;
    });
  } else {
    svgs = [text];
  }
  const existingSvgs = await Promise.all(files.map((f) => f.text()));
  return svgs
    .filter((svg) => !existingSvgs.includes(svg))
    .map(
      (svg, i) =>
        new File(
          [svg],
          svgs.length === 1
            ? `${namePrefix}-${Date.now()}.svg`
            : `${namePrefix}-${Date.now()}-${i + 1}.svg`,
          { type: "image/svg+xml" }
        )
    );
};

export const formatBytes = (bytes: number, decimals = 2) => {
  if (bytes === 0) return "0 KB";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  let i = Math.floor(Math.log(bytes) / Math.log(k));
  if (i === 0) i = 1; // Always at least KB
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i - 1];
};

export const formatNumber = (num?: number): string => {
  if (!num) return "0";
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, "") + "K";
  }
  return num.toString();
};
