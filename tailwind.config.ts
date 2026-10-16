import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./client/index.html", "./client/src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      borderRadius: {
        lg: ".5625rem", /* 9px */
        md: ".375rem", /* 6px */
        sm: ".1875rem", /* 3px */
      },
      colors: {
        // Flat / base colors (regular buttons)
        background: "hsl(var(--background) / <alpha-value>)",
        foreground: "hsl(var(--foreground) / <alpha-value>)",
        border: "hsl(var(--border) / <alpha-value>)",
        input: "hsl(var(--input) / <alpha-value>)",
        card: {
          DEFAULT: "hsl(var(--card) / <alpha-value>)",
          foreground: "hsl(var(--card-foreground) / <alpha-value>)",
          border: "hsl(var(--card-border) / <alpha-value>)",
        },
        popover: {
          DEFAULT: "hsl(var(--popover) / <alpha-value>)",
          foreground: "hsl(var(--popover-foreground) / <alpha-value>)",
          border: "hsl(var(--popover-border) / <alpha-value>)",
        },
        primary: {
          DEFAULT: "hsl(var(--primary) / <alpha-value>)",
          foreground: "hsl(var(--primary-foreground) / <alpha-value>)",
          border: "var(--primary-border)",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary) / <alpha-value>)",
          foreground: "hsl(var(--secondary-foreground) / <alpha-value>)",
          border: "var(--secondary-border)",
        },
        muted: {
          DEFAULT: "hsl(var(--muted) / <alpha-value>)",
          foreground: "hsl(var(--muted-foreground) / <alpha-value>)",
          border: "var(--muted-border)",
        },
        accent: {
          DEFAULT: "hsl(var(--accent) / <alpha-value>)",
          foreground: "hsl(var(--accent-foreground) / <alpha-value>)",
          border: "var(--accent-border)",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive) / <alpha-value>)",
          foreground: "hsl(var(--destructive-foreground) / <alpha-value>)",
          border: "var(--destructive-border)",
        },
        ring: "hsl(var(--ring) / <alpha-value>)",
        chart: {
          "1": "hsl(var(--chart-1) / <alpha-value>)",
          "2": "hsl(var(--chart-2) / <alpha-value>)",
          "3": "hsl(var(--chart-3) / <alpha-value>)",
          "4": "hsl(var(--chart-4) / <alpha-value>)",
          "5": "hsl(var(--chart-5) / <alpha-value>)",
        },
        sidebar: {
          ring: "hsl(var(--sidebar-ring) / <alpha-value>)",
          DEFAULT: "hsl(var(--sidebar) / <alpha-value>)",
          foreground: "hsl(var(--sidebar-foreground) / <alpha-value>)",
          border: "hsl(var(--sidebar-border) / <alpha-value>)",
        },
        "sidebar-primary": {
          DEFAULT: "hsl(var(--sidebar-primary) / <alpha-value>)",
          foreground: "hsl(var(--sidebar-primary-foreground) / <alpha-value>)",
          border: "var(--sidebar-primary-border)",
        },
        "sidebar-accent": {
          DEFAULT: "hsl(var(--sidebar-accent) / <alpha-value>)",
          foreground: "hsl(var(--sidebar-accent-foreground) / <alpha-value>)",
          border: "var(--sidebar-accent-border)"
        },
        status: {
          online: "rgb(34 197 94)",
          away: "rgb(245 158 11)",
          busy: "rgb(239 68 68)",
          offline: "rgb(156 163 175)",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
        serif: ["var(--font-serif)"],
        mono: ["var(--font-mono)"],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        /* Milestone celebrations: badge, level, streak and week completions. */
        "milestone-pop": {
          "0%": { transform: "scale(.55) rotate(-10deg)", opacity: "0" },
          "55%": { transform: "scale(1.08) rotate(3deg)", opacity: "1" },
          "100%": { transform: "scale(1) rotate(0deg)", opacity: "1" },
        },
        "ring-burst": {
          "0%": { transform: "scale(.6)", opacity: ".85" },
          "100%": { transform: "scale(1.9)", opacity: "0" },
        },
        "glow-pulse": {
          "0%, 100%": { opacity: ".45", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.06)" },
        },
        "spin-slow": {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
        "float-up": {
          "0%": { transform: "translateY(14px) scale(.7)", opacity: "0" },
          "25%": { opacity: "1" },
          "100%": { transform: "translateY(-58px) scale(1.05)", opacity: "0" },
        },
        shine: {
          "0%": { transform: "translateX(-140%) skewX(-12deg)" },
          "100%": { transform: "translateX(240%) skewX(-12deg)" },
        },
        "confetti-fall": {
          "0%": { transform: "translateY(-14vh) rotate(0deg)", opacity: "1" },
          "100%": { transform: "translateY(108vh) rotate(760deg)", opacity: "0" },
        },
        "confetti-burst": {
          "0%": { transform: "translate(0, 0) scale(.4) rotate(0deg)", opacity: "1" },
          "100%": {
            transform: "translate(var(--tx, 0), var(--ty, -120px)) scale(1) rotate(var(--rot, 360deg))",
            opacity: "0",
          },
        },
        "overlay-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "card-in": {
          "0%": { opacity: "0", transform: "translateY(18px) scale(.96)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        "text-pop": {
          "0%": { transform: "scale(.8)", opacity: "0" },
          "70%": { transform: "scale(1.06)", opacity: "1" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "milestone-pop": "milestone-pop 0.6s cubic-bezier(.2,.9,.3,1.2) both",
        "ring-burst": "ring-burst 1.4s ease-out infinite",
        "glow-pulse": "glow-pulse 1.8s ease-in-out infinite",
        "spin-slow": "spin-slow 9s linear infinite",
        "float-up": "float-up 1.8s ease-out infinite",
        shine: "shine 2.2s ease-in-out infinite",
        "confetti-fall": "confetti-fall var(--fall-duration, 3.2s) linear forwards",
        "confetti-burst": "confetti-burst var(--burst-duration, 1.6s) cubic-bezier(.15,.7,.4,1) forwards",
        "overlay-in": "overlay-in 0.25s ease-out both",
        "card-in": "card-in 0.35s cubic-bezier(.2,.9,.3,1.1) both",
        "text-pop": "text-pop 0.45s cubic-bezier(.2,.9,.3,1.2) both",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;
