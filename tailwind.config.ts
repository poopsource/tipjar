import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./client/index.html", "./client/src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // Starbucks Color System
        'starbucks-forest': '#00704A',
        'starbucks-forest-light': '#1E8A5F',
        'starbucks-forest-dark': '#004D33',
        'starbucks-cream': '#F7F5F3',
        'starbucks-cream-dark': '#F0EDE8',
        'starbucks-coffee': '#8B4513',
        'starbucks-coffee-light': '#A0522D',
        'starbucks-beige': '#E8E2D5',
        'starbucks-beige-dark': '#D4C7B8',
        'starbucks-gold': '#D4AF37',
        'starbucks-gold-light': '#E6C547',
        'starbucks-sage': '#9CAF88',
        'starbucks-charcoal': '#2C2C2C',
        'starbucks-warm-white': '#FEFCFA',
        
        // ShadCN UI compatibility
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      fontFamily: {
        'primary': ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        'accent': ['Lora', 'Georgia', 'serif'],
      },
      spacing: {
        'xs': '4px',
        'sm': '8px',
        'md': '16px',
        'lg': '24px',
        'xl': '32px',
        '2xl': '48px',
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xl: "12px",
        '2xl': "16px",
      },
      boxShadow: {
        'soft': '0 2px 8px rgba(0, 112, 74, 0.08)',
        'medium': '0 4px 16px rgba(0, 112, 74, 0.12)',
        'strong': '0 8px 32px rgba(0, 112, 74, 0.16)',
        'glow': '0 0 20px rgba(212, 175, 55, 0.3)',
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
        "starbucks-fade-in": {
          from: { 
            opacity: '0',
            transform: 'translateY(-8px)',
          },
          to: { 
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        "starbucks-slide-up": {
          from: { 
            opacity: '0',
            transform: 'translateY(16px)',
          },
          to: { 
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        "starbucks-scale-in": {
          from: {
            opacity: '0',
            transform: 'scale(0.95)',
          },
          to: {
            opacity: '1',
            transform: 'scale(1)',
          },
        },
        "starbucks-shimmer": {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "starbucks-fade-in": "starbucks-fade-in 0.5s ease-out",
        "starbucks-slide-up": "starbucks-slide-up 0.6s ease-out",
        "starbucks-scale-in": "starbucks-scale-in 0.4s ease-out",
        "starbucks-shimmer": "starbucks-shimmer 1.5s infinite",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require("@tailwindcss/typography"),
  ],
} satisfies Config;