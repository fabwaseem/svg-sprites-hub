"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Download, Sparkles, Upload } from "lucide-react";
import Link from "next/link";

export function CTA() {
  return (
    <section className="py-24 bg-background relative overflow-hidden border-t border-border">
      {/* Background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-3xl mx-auto px-4 sm:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-card/80 backdrop-blur-sm rounded-full text-sm font-medium text-primary mb-6 border border-border">
            <Sparkles className="w-4 h-4" />
            Start your free trial today
          </div>

          <h2 className="text-3xl sm:text-5xl font-display font-bold text-primary mb-6 text-balance">
            Ready to supercharge your design workflow?
          </h2>

          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-balance">
            Join 50,000+ designers who trust SpriteHub for their projects. Start
            with our free plan or try Pro free for 14 days.
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
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-8 text-muted-foreground text-sm"
        >
          No credit card required • Cancel anytime • 14-day free trial
        </motion.div>
      </div>
    </section>
  );
}
