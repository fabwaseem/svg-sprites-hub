"use client";

import { ThemeSwitch } from "@/components/common/ThemeSwitch";
import { Button } from "@/components/ui/button";
import { navigation } from "@/config/header";
import { authClient } from "@/lib/auth-client";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, Sparkles, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import UserDropdown from "../auth/UserDropdown";

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { data: session } = authClient.useSession();

  return (
    <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-white drop-shadow" />
            </div>
            <span className="font-display text-xl tracking-tight  transition-colors">
              SpriteHub
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`text-muted-foreground hover:text-primary transition-colors duration-200 font-semibold  rounded-md hover:bg-accent/40 focus:outline-none focus-visible:ring-2 py-1.5 px-4 focus-visible:ring-primary ${
                  pathname === item.href
                    ? "text-primary font-bold bg-accent/60 shadow-sm"
                    : ""
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Theme Toggle */}
            <ThemeSwitch />

            {/* CTA Button */}
            <div className="hidden sm:flex items-center gap-2">
              {session ? (
                <UserDropdown />
              ) : (
                <Button asChild>
                  <Link href="/auth/login" onClick={() => setIsOpen(false)}>
                    Get Started
                  </Link>
                </Button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden w-9 h-9 p-0 border border-border hover:bg-accent"
              onClick={() => setIsOpen(!isOpen)}
              aria-label={isOpen ? "Close menu" : "Open menu"}
            >
              {isOpen ? (
                <X className="w-4 h-4" />
              ) : (
                <Menu className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background/10  border-b border-border shadow-lg rounded-b-xl"
          >
            <div className="px-4 py-4 space-y-3">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`block text-muted-foreground hover:text-primary transition-colors duration-200 font-semibold py-2 px-2 rounded-md hover:bg-accent/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                    pathname === item.href
                      ? "text-primary font-bold bg-accent/60 shadow-sm"
                      : ""
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="flex flex-col gap-2 mt-4">
                {session ? (
                  <UserDropdown />
                ) : (
                  <Button variant={"secondary"} asChild>
                    <Link href="/auth/login" onClick={() => setIsOpen(false)}>
                      Get Started
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
