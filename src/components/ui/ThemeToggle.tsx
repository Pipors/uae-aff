"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("nexus-theme", next ? "dark" : "light");
  };

  return (
    <button
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="p-2 rounded-xl bg-cyber-glass border border-cyber-border text-cyber-text hover:text-cyber-cyan hover:border-cyber-cyan/50 transition-all shadow-cyan-glow/10"
    >
      {isDark ? (
        <Sun className="w-5 h-5 text-cyber-pink" />
      ) : (
        <Moon className="w-5 h-5 text-cyber-violet" />
      )}
    </button>
  );
}
