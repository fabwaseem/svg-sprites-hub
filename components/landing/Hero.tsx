"use client";

import { Button } from "@/components/ui/button";
import { Download, Upload, Sparkles, Check } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative px-4 py-20 text-center overflow-hidden bg-background min-h-screen flex items-center justify-center">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-card/80 backdrop-blur-sm rounded-full text-sm font-medium text-primary mb-6 border border-border">
            <Sparkles className="w-4 h-4" />
            The Ultimate Free SVG Sprite Library
          </div>

          <h1 className="text-3xl md:text-5xl xl:text-6xl font-bold text-primary mb-4 leading-tight text-balance">
            Supercharge Your UI with SVG Sprites
          </h1>

          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Access a curated collection of high-quality, customizable SVG
            sprites for web and app design.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Button size="lg" asChild>
            <Link href="/sprites">
              <Download className="w-5 h-5 mr-2" />
              Browse Sprites
            </Link>
          </Button>

          <Button variant="outline" size="lg" asChild>
            <Link href="/upload">
              <Upload className="w-5 h-5 mr-2" />
              Share Your Sprites
            </Link>
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mt-12 sm:mt-32 flex flex-col sm:flex-row gap-4 justify-center items-center text-sm text-muted-foreground text-balance"
        >
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center rounded-full bg-primary/10 text-primary w-6 h-6">
              <Check className="w-4 h-4" />
            </span>
            Trusted by 10,000+ designers & developers
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center rounded-full bg-primary/10 text-primary w-6 h-6">
              <Check className="w-4 h-4" />
            </span>
            100% Free & Open Source
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center rounded-full bg-primary/10 text-primary w-6 h-6">
              <Check className="w-4 h-4" />
            </span>
            Scalable, high-quality SVG assets
          </div>
        </motion.div>
      </div>
    </section>
  );
}
