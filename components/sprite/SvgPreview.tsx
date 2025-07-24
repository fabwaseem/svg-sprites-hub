import React, { useEffect, useState } from "react";
import { cn } from "../../lib/utils";
import { motion } from "framer-motion";

const SvgPreview = ({
  file,
  className,
  onClick,
}: {
  file: File;
  className?: string;
  onClick?: () => void;
}) => {
  const [svg, setSvg] = useState<string | null>(null);
  useEffect(() => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setSvg(e.target?.result as string);
    };
    reader.readAsText(file);
  }, [file]);
  if (!svg) return <span className="w-8 h-8 bg-muted animate-pulse rounded" />;
  return (
    <motion.span
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className={cn(
        "size-8   p-1   aspect-square flex items-center justify-center  rounded cursor-pointer  border border-border bg-muted/60 hover:bg-accent/40 text-primary",
        className
      )}
      dangerouslySetInnerHTML={{ __html: svg }}
      title={file.name}
      onClick={onClick}
    ></motion.span>
  );
};

export default SvgPreview;
