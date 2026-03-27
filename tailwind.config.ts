import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        blue: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
        },
        magenta: {
          500: "#d946ef",
          600: "#c026d3",
          700: "#a21caf",
        },
        brand: {
          50: "#f5f7ff",
          100: "#ebf0ff",
          200: "#d6e0ff",
          300: "#adc2ff",
          400: "#84a4ff",
          500: "#3b82f6", 
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a",
          magenta: "#d946ef",
          blue: "#3b82f6",
          gradient: "linear-gradient(135deg, #3b82f6 0%, #d946ef 100%)",
        },
      },
    },
  },
  plugins: [],
};
export default config;
