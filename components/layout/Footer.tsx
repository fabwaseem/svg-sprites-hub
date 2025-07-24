"use client";

import { Sparkles, Github, Twitter, Linkedin } from "lucide-react";
import Link from "next/link";

const footerLinks = {
  Product: [
    { name: "Browse Sprites", href: "/sprites" },
    { name: "Upload", href: "/upload" },
    { name: "Generate", href: "/generate" },
  ],
  Company: [
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ],
  Resources: [
    { name: "Documentation", href: "#" },
    { name: "Help Center", href: "#" },
    { name: "Community", href: "#" },
    { name: "Status", href: "#" },
  ],
  Legal: [
    { name: "Privacy", href: "#" },
    { name: "Terms", href: "#" },
    { name: "License", href: "#" },
    { name: "Security", href: "#" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-background border-t border-border pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2 flex flex-col mb-8 lg:mb-0">
            <Link href="/" className="flex items-center space-x-3 mb-4 group">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                <Sparkles className="w-6 h-6 text-white drop-shadow" />
              </div>
              <span className="font-display font-bold text-2xl text-primary tracking-tight group-hover:text-accent transition-colors">
                SpriteHub
              </span>
            </Link>
            <p className="text-muted-foreground mb-6 max-w-md text-base">
              The ultimate platform for discovering, customizing, and sharing
              premium SVG sprites. Trusted by designers worldwide.
            </p>
            <div className="flex space-x-4 mt-auto">
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors rounded-full p-2 bg-muted/60 hover:bg-accent/40"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors rounded-full p-2 bg-muted/60 hover:bg-accent/40"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors rounded-full p-2 bg-muted/60 hover:bg-accent/40"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category} className="min-w-[120px]">
              <h3 className="font-semibold text-primary mb-4 text-base tracking-wide">
                {category}
              </h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-muted-foreground hover:text-primary transition-colors text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-border mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-sm">
            © 2024 SpriteHub. All rights reserved.
          </p>
          <p className="text-muted-foreground text-sm flex items-center gap-1">
            Made with <span className="text-primary">❤️</span> for the design
            community
          </p>
        </div>
      </div>
    </footer>
  );
}
