"use client";

import { motion } from "framer-motion";
import { FileImage, Sparkles } from "lucide-react";
import { useState, useCallback } from "react";
import { SvgSpriteUploader } from "@/components/sprite/SvgSpriteUploader";
import { SvgSpritePreview } from "@/components/sprite/SvgSpritePreview";

export default function PreviewPage() {
  const [uploadedSprite, setUploadedSprite] = useState<File | null>(null);
  const [spriteContent, setSpriteContent] = useState<string>("");

  const handleSpriteUpload = useCallback((file: File, content: string) => {
    setUploadedSprite(file);
    setSpriteContent(content);
  }, []);

  const handleReset = useCallback(() => {
    setUploadedSprite(null);
    setSpriteContent("");
  }, []);

  return (
    <main className="min-h-screen pt-16 bg-background">
      {/* Header */}
      <section className="py-12 bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-3 mb-4"
          >
            <div className="p-3 bg-primary/10 rounded-xl">
              <FileImage className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl sm:text-5xl font-display font-bold text-primary text-balance">
              SVG Sprite Preview
            </h1>
            <div className="p-3 bg-primary/10 rounded-xl">
              <Sparkles className="w-8 h-8 text-primary" />
            </div>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-muted-foreground max-w-3xl mx-auto text-balance"
          >
            Upload any SVG sprite file to preview individual icons. Click on any icon to copy or download it separately.
            Perfect for exploring sprite collections and extracting specific icons.
          </motion.p>
        </div>
      </section>

      {/* Main Content */}
      <section className="px-4 py-12 ">
        {!uploadedSprite ? (
          <SvgSpriteUploader onUpload={handleSpriteUpload} />
        ) : (
          <SvgSpritePreview
            file={uploadedSprite}
            content={spriteContent}
            onReset={handleReset}
          />
        )}
      </section>
    </main>
  );
}