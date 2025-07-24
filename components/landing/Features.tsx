'use client';

import { motion } from 'framer-motion';
import { Palette, Download, Search, Zap, Shield, Users } from 'lucide-react';

const features = [
  {
    icon: Palette,
    title: 'Customizable Colors',
    description: 'Change sprite colors instantly with our built-in color picker. Perfect for matching your brand.',
  },
  {
    icon: Download,
    title: 'Instant Downloads',
    description: 'Download individual sprites or entire collections in multiple formats with one click.',
  },
  {
    icon: Search,
    title: 'Smart Search',
    description: 'Find exactly what you need with our advanced search and filtering system.',
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Optimized SVGs that load instantly and scale perfectly at any size.',
  },
  {
    icon: Shield,
    title: 'Commercial License',
    description: 'Use our sprites in commercial projects without attribution requirements.',
  },
  {
    icon: Users,
    title: 'Community Driven',
    description: 'Join thousands of designers sharing and discovering amazing sprites.',
  },
];

export function Features() {
  return (
    <section className="py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl font-display font-bold text-primary mb-4"
          >
            Everything you need to create amazing designs
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            Our platform provides all the tools and resources you need to find, customize, and implement perfect sprites for your projects.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="bg-card rounded-2xl p-8 shadow-sm border border-border hover:shadow-lg transition-all duration-300 hover:border-primary h-full">
                <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-6 h-6 text-white drop-shadow" />
                </div>
                <h3 className="text-xl font-display font-semibold text-foreground mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}