/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
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
        blueberry: {
          DEFAULT: "#4A4C96",
          50: "#EEEEF6",
          100: "#DDDFF2",
          200: "#C5C7E8",
          600: "#4A4C96",
        },
        sunshine: {
          DEFAULT: "#FFD966",
          50: "#FEF3CD",
          100: "#FEE79E",
          200: "#FEDB6F",
          600: "#FFD966",
        },
        mint: {
          DEFAULT: "#5CC8AF",
          50: "#ECF8F5",
          100: "#D1F1E8",
          200: "#B4E6DA",
          600: "#5CC8AF",
        },
        bubblegum: {
          DEFAULT: "#FF91B1",
          50: "#FFF0F4",
          100: "#FFDFE8",
          200: "#FFBFD3",
          600: "#FF91B1",
        },
        sky: {
          DEFAULT: "#82B8FF",
          50: "#F0F6FF",
          100: "#DCF0FF",
          200: "#BCE0FF",
          600: "#82B8FF",
        },
        paper: {
          DEFAULT: "#F6F8FF",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
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
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
