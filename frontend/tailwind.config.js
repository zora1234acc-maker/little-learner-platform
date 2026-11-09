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
        border: "rgb(var(--border))",
        input: "rgb(var(--input))",
        ring: "rgb(var(--ring))",
        background: "rgb(var(--background))",
        foreground: "rgb(var(--foreground))",
        primary: {
          DEFAULT: "rgb(var(--primary))",
          foreground: "rgb(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "rgb(var(--secondary))",
          foreground: "rgb(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "rgb(var(--destructive))",
          foreground: "rgb(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "rgb(var(--muted))",
          foreground: "rgb(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "rgb(var(--accent))",
          foreground: "rgb(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "rgb(var(--popover))",
          foreground: "rgb(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "rgb(var(--card))",
          foreground: "rgb(var(--card-foreground))",
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
        "rise-in": {
          "0%": { opacity: "0", transform: "translateY(14px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "pane-in": {
          "0%": { opacity: "0", transform: "translateY(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "pop-in": {
          "0%": { opacity: "0", transform: "scale(0.94)" },
          "60%": { opacity: "1", transform: "scale(1.02)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "rise-in": "rise-in 0.6s cubic-bezier(0.22, 0.7, 0.3, 1) both",
        "pane-in": "pane-in 0.28s ease-out both",
        "pop-in": "pop-in 0.35s cubic-bezier(0.2, 0.8, 0.3, 1) both",
        marquee: "marquee 55s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
