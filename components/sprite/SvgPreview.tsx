import React, { useEffect, useState, memo } from "react";
import { cn } from "../../lib/utils";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

interface SvgPreviewProps {
  file: File;
  className?: string;
  onClick?: () => void;
}

const SvgPreview = memo(({
  file,
  className,
  onClick,
}: SvgPreviewProps) => {
  const [svg, setSvg] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const { ref, inView } = useInView({
    threshold: 0,
    triggerOnce: true,
    rootMargin: '50px',
  });

  useEffect(() => {
    if (inView && !isLoaded) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSvg(e.target?.result as string);
        setIsLoaded(true);
      };
      reader.readAsText(file);
    }
  }, [file, inView, isLoaded]);

  if (!inView || !svg) {
    return (
      <span
        ref={ref}
        className={cn(
          "size-8 p-1 aspect-square flex items-center justify-center rounded cursor-pointer border border-border bg-muted/60 animate-pulse",
          className
        )}
      />
    );
  }

  return (
    <motion.span
      ref={ref}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className={cn(
        "size-8 p-1 aspect-square flex items-center justify-center rounded cursor-pointer border border-border bg-muted/60 hover:bg-accent/40 text-primary",
        className
      )}
      dangerouslySetInnerHTML={{ __html: svg }}
      title={file.name}
      onClick={onClick}
    />
  );
});

SvgPreview.displayName = 'SvgPreview';

export default SvgPreview;
