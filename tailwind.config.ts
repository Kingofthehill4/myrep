import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        studio: {
          bg: "#0f172a",
          card: "#111827",
          line: "#334155",
          accent: "#22d3ee"
        }
      }
    }
  },
  plugins: [],
};

export default config;
