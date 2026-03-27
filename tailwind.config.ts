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
        brand: {
          50: "#e0f2ff",
          100: "#b3e0ff",
          200: "#80cdff",
          300: "#4dbaff",
          400: "#1aa7ff",
          500: "#0082ff",
          600: "#006edb",
          700: "#005bb8",
          800: "#004894",
          900: "#003570",
        },
      },
    },
  },
  plugins: [],
};
export default config;
