"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Award,
  Github,
  Globe,
  Heart,
  Lightbulb,
  Linkedin,
  Shield,
  Sparkles,
  Target,
  Twitter,
  Users,
  Zap,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const stats = [
  { label: "Active Users", value: "50,000+", icon: Users },
  { label: "SVG Sprites", value: "10,000+", icon: Sparkles },
  { label: "Downloads", value: "1M+", icon: Globe },
  { label: "Countries", value: "120+", icon: Award },
];

const values = [
  {
    icon: Heart,
    title: "Community First",
    description:
      "We believe in the power of community-driven design. Every sprite shared makes the ecosystem stronger.",
  },
  {
    icon: Zap,
    title: "Performance Focused",
    description:
      "Optimized SVGs and efficient sprite generation tools that help developers build faster websites.",
  },
  {
    icon: Shield,
    title: "Quality Assured",
    description:
      "Every sprite is reviewed for quality, consistency, and optimization before being published.",
  },
  {
    icon: Lightbulb,
    title: "Innovation Driven",
    description:
        "Constantly pushing the boundaries of what&apos;s possible with SVG sprites and web performance.",
  },
];

const team = [
  {
    name: "Alex Chen",
    role: "Founder & CEO",
    avatar:
      "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop",
    bio: "Former design lead at Stripe with 10+ years in web design.",
    social: { twitter: "#", linkedin: "#", github: "#" },
  },
  {
    name: "Sarah Kim",
    role: "Head of Design",
    avatar:
      "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop",
    bio: "Award-winning designer who previously worked at Figma and Adobe.",
    social: { twitter: "#", linkedin: "#", github: "#" },
  },
  {
    name: "Marcus Johnson",
    role: "Lead Developer",
    avatar:
      "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop",
    bio: "Full-stack engineer passionate about web performance and SVG optimization.",
    social: { twitter: "#", linkedin: "#", github: "#" },
  },
  {
    name: "Emily Rodriguez",
    role: "Community Manager",
    avatar:
      "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop",
    bio: "Building bridges between designers and developers in our community.",
    social: { twitter: "#", linkedin: "#", github: "#" },
  },
];

const timeline = [
  {
    year: "2023",
    title: "The Beginning",
    description:
      "Started as a side project to solve SVG sprite management challenges.",
  },
  {
    year: "2024",
    title: "Community Growth",
    description: "Reached 10,000 users and launched the sprite generator tool.",
  },
  {
    year: "2024",
    title: "Platform Evolution",
    description:
      "Introduced advanced features, dark mode, and mobile optimization.",
  },
  {
    year: "2025",
    title: "Global Impact",
    description:
      "Serving 50,000+ designers and developers across 120+ countries.",
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="py-24 bg-background relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-1/4 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-1/4 w-72 h-72 bg-accent/20 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-muted rounded-full text-sm font-medium text-primary mb-8 border border-border">
              <Target className="w-4 h-4" />
              Our Mission
            </div>

            <h1 className="text-4xl sm:text-6xl font-display font-bold text-primary mb-6">
              Empowering designers with
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {" "}
                better tools
              </span>
            </h1>

            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              We&apos;re building the world&apos;s most comprehensive SVG sprite platform,
              making it easier for designers and developers to create beautiful,
              performant web experiences.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-12 h-12 bg-muted rounded-xl flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-6 h-6 text-primary" />
                </div>
                <div className="text-3xl font-display font-bold text-primary mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-24 text-balance">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-primary mb-6">
              Our Story
            </h2>
            <div className="prose prose-lg max-w-none text-muted-foreground">
              <p className="text-lg leading-relaxed mb-6">
                SpriteHub was born from a simple frustration: managing SVG icons
                across multiple projects was unnecessarily complex. As designers
                and developers ourselves, we knew there had to be a better way.
              </p>
              <p className="text-lg leading-relaxed mb-6">
                What started as a weekend project quickly grew into something
                much bigger. We realized that the entire design community was
                facing the same challenges - scattered icon libraries,
                inconsistent formats, and time-consuming sprite generation
                processes.
              </p>
              <p className="text-lg leading-relaxed">
                Today, SpriteHub serves thousands of designers and developers
                worldwide, providing not just a platform for sharing sprites,
                but a complete ecosystem for SVG icon management. We&apos;re just
                getting started.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-primary mb-4">
              Our Values
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              The principles that guide everything we do at SpriteHub.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-lg transition-all duration-300 border-border/50">
                  <CardContent className="p-8">
                    <div className="w-12 h-12 bg-primary/80 rounded-xl flex items-center justify-center mb-6">
                      <value.icon className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <h3 className="text-xl font-display font-semibold text-primary mb-3">
                      {value.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-primary mb-4">
              Our Journey
            </h2>
            <p className="text-lg text-muted-foreground">
              Key milestones in our mission to improve design workflows.
            </p>
          </motion.div>

          <div className="space-y-8">
            {timeline.map((item, index) => (
              <motion.div
                key={item.year}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex items-center gap-8"
              >
                <div className="flex-shrink-0 w-20 text-right">
                  <Badge
                    variant="outline"
                    className="font-semibold border-border text-primary"
                  >
                    {item.year}
                  </Badge>
                </div>
                <div className="flex-shrink-0 w-4 h-4 bg-primary rounded-full relative">
                  <div className="absolute inset-0 bg-primary rounded-full animate-ping opacity-75" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-primary mb-2">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-primary mb-4">
              Meet Our Team
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              The passionate people behind SpriteHub, working to make design
              better for everyone.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="text-center hover:shadow-lg transition-all duration-300 border-border/50">
                  <CardContent className="p-6">
                    <Image
                      src={member.avatar}
                      alt={member.name}
                      width={80}
                      height={80}
                      className="w-20 h-20 rounded-full mx-auto mb-4 object-cover"
                    />
                    <h3 className="font-semibold text-primary mb-1">
                      {member.name}
                    </h3>
                    <p className="text-sm text-primary mb-3">{member.role}</p>
                    <p className="text-sm text-muted-foreground mb-4">
                      {member.bio}
                    </p>
                    <div className="flex justify-center gap-2">
                      <a
                        href={member.social.twitter}
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        <Twitter className="w-4 h-4" />
                      </a>
                      <a
                        href={member.social.linkedin}
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        <Linkedin className="w-4 h-4" />
                      </a>
                      <a
                        href={member.social.github}
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        <Github className="w-4 h-4" />
                      </a>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-primary mb-6">
              Join Our Mission
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Help us build the future of SVG sprite management. Whether
              you`&apos;re a designer, developer, or just passionate about great
              tools, there`&apos;s a place for you in our community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/sprites">
                <Button
                  size="lg"
                  className="bg-primary text-primary-foreground"
                >
                  Explore Sprites
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href="/upload">
                <Button variant="outline" size="lg">
                  Contribute Sprites
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
