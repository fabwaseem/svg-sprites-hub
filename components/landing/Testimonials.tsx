"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import Image from "next/image";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "UI/UX Designer at Stripe",
    avatar:
      "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
    content:
      "SpriteHub has completely transformed my design workflow. The quality and variety of sprites is unmatched.",
    rating: 5,
  },
  {
    name: "Marcus Rodriguez",
    role: "Frontend Developer at Shopify",
    avatar:
      "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
    content:
      "The customization options are incredible. I can match any brand color instantly and download exactly what I need.",
    rating: 5,
  },
  {
    name: "Emily Johnson",
    role: "Creative Director at Airbnb",
    avatar:
      "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
    content:
      "Our entire design team uses SpriteHub. The collaboration features and consistent quality save us hours every week.",
    rating: 5,
  },
];

export function Testimonials() {
  return (
    <section className="py-24 bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-8">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-5xl font-display font-bold text-primary mb-4 text-balance"
          >
            Loved by designers worldwide
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance"
          >
            Join thousands of happy designers and developers who trust SpriteHub
            for their projects.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-card rounded-3xl p-8 shadow-lg border border-border hover:shadow-xl transition-all duration-300 flex flex-col h-full"
            >
              <div className="flex items-center gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 text-yellow-400 fill-yellow-300 drop-shadow"
                  />
                ))}
              </div>

              <p className="text-foreground mb-6 leading-relaxed text-balance text-lg">
                &quot;{testimonial.content}&quot;
              </p>

              <div className="flex items-center gap-4 mt-auto">
                <Image
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  width={56}
                  height={56}
                  className="w-14 h-14 rounded-full object-cover border-2 border-primary/20 shadow-sm"
                />
                <div>
                  <div className="font-semibold text-primary text-base">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
