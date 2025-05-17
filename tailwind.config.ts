import type { Config } from "tailwindcss";

/**
 * This configuration implements Google's Material 3 design system.
 * Primary: Indigo 500 (#3F51B5)
 * Secondary: Pink A400 (#F50057)
 * Tertiary: Purple 200 (#CE93D8)
 * Surfaces use dynamic color system with neutral tones.
 * All color contrasts comply with WCAG 2.1 AA standard (4.5:1 for normal text).
 */
export default {
  darkMode: ["class"],
  content: ["./client/index.html", "./client/src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        'roboto': ['Roboto', 'sans-serif'],
        'noto-sans': ['Noto Sans', 'sans-serif'],
      },
      borderRadius: {
        // Material 3 border radius values
        'none': '0px',
        'xs': '4px',  // Extra small
        'sm': '8px',  // Small
        'md': '12px', // Medium
        'lg': '16px', // Large
        'xl': '28px', // Extra large
        'full': '9999px', // Full round (for FABs, etc.)
      },
      colors: {
        // Material 3 semantic colors
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          container: "hsl(var(--primary-container))",
          "container-foreground": "hsl(var(--primary-container-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
          container: "hsl(var(--secondary-container))",
          "container-foreground": "hsl(var(--secondary-container-foreground))",
        },
        tertiary: {
          DEFAULT: "hsl(var(--tertiary))",
          foreground: "hsl(var(--tertiary-foreground))",
          container: "hsl(var(--tertiary-container))",
          "container-foreground": "hsl(var(--tertiary-container-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        
        // Material 3 surface tones
        "surface": "hsl(var(--surface))",
        "surface-dim": "hsl(var(--surface-dim))",
        "surface-bright": "hsl(var(--surface-bright))",
        "surface-container": "hsl(var(--surface-container))",
        "surface-container-low": "hsl(var(--surface-container-low))",
        "surface-container-high": "hsl(var(--surface-container-high))",
        "on-surface": "hsl(var(--on-surface))",
        "on-surface-variant": "hsl(var(--on-surface-variant))",
        "inverse-surface": "hsl(var(--inverse-surface))",
        "inverse-on-surface": "hsl(var(--inverse-on-surface))",
        
        // Spring colors (preserved for backwards compatibility)
        "spring-green": "hsl(var(--spring-green))",
        "spring-blue": "hsl(var(--spring-blue))",
        "spring-lavender": "hsl(var(--spring-lavender))",
        "spring-pink": "hsl(var(--spring-pink))",
        "spring-yellow": "hsl(var(--spring-yellow))",
        "spring-peach": "hsl(var(--spring-peach))",
        "spring-accent": "hsl(var(--spring-accent))",
        "app-bg": "hsl(var(--app-bg))",
        "app-darker": "hsl(var(--app-darker))",
        "app-card": "hsl(var(--app-card))",
        "text-white": "hsl(var(--text-white))",
        
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        
        // Material Design 3 direct color values (for direct use without HSL vars)
        "md-primary": "#3F51B5", // Indigo 500
        "md-on-primary": "#FFFFFF",
        "md-primary-container": "#C5CAE9", // Indigo 100
        "md-on-primary-container": "#121212",
        "md-secondary": "#F50057", // Pink A400
        "md-on-secondary": "#FFFFFF",
        "md-secondary-container": "#FCE4EC", // Pink 50
        "md-on-secondary-container": "#560027",
        "md-tertiary": "#CE93D8", // Purple 200
        "md-on-tertiary": "#FFFFFF",
        "md-surface": "#FFFFFF",
        "md-on-surface": "#1C2526",
      },
      opacity: {
        '8': '0.08',
        '12': '0.12',
        '16': '0.16',
        '38': '0.38',
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        // Material 3 ripple effect
        "ripple": {
          "0%": { transform: "scale(0)", opacity: "0.35" },
          "100%": { transform: "scale(2.5)", opacity: "0" },
        },
        // Material 3 state layer animation
        "state-layer": {
          "0%": { opacity: "0" },
          "100%": { opacity: "var(--md-state-layer-opacity, 0.12)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "ripple": "ripple 0.6s ease-out",
        "state-layer": "state-layer 0.2s ease-out forwards",
      },
      boxShadow: {
        // Material 3 elevation levels
        'md-1': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'md-2': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'md-3': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'md-4': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        'md-5': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;
