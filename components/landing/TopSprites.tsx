"use client";

import { SpriteCard } from "@/components/sprite/SpriteCard";
import { Button } from "@/components/ui/button";
import { useSprites } from "@/hooks/useSprites";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { SpriteCardSkeleton } from "@/components/sprite/SpriteCardSkeleton";

export function TopSprites() {
  const { data, isLoading } = useSprites({
    pageSize: 6,
    sortBy: "downloadCount",
    sortOrder: "desc",
  });

  const sprites = data?.pages.flatMap((page) => page.sprites) || [];

  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 max-w-2xl mx-auto ">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl font-display font-bold text-primary mb-4 "
          >
            Most Popular Sprite Collections
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance"
          >
            Handpicked collections loved by thousands of designers and
            developers worldwide.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => (
                <SpriteCardSkeleton key={i} />
              ))
            : sprites.map((sprite, index) => (
                <motion.div
                  key={sprite.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <SpriteCard sprite={sprite} />
                </motion.div>
              ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Button size="lg" variant="outline" asChild>
            <Link href="/sprites">
              Browse All 10,000+ Sprites
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
