"use client";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sun, Moon } from "lucide-react";

export function ThemeSwitch() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted)
    return (
      <Button
        variant="ghost"
        size="sm"
        aria-label="Toggle theme"
        className="w-9 h-9 p-0 rounded-full border border-border hover:bg-accent transition-colors"
      >
        <Sun className="w-4 h-4" />
      </Button>
    );

  return (
    <Button
      variant="ghost"
      size="sm"
      aria-label="Toggle theme"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="w-9 h-9 p-0 rounded-full border border-border hover:bg-accent transition-colors"
    >
      {theme === "dark" ? (
        <Sun className="w-4 h-4" />
      ) : (
        <Moon className="w-4 h-4" />
      )}
    </Button>
  );
}
