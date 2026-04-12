import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0F172A",
        mist: "#E2E8F0",
        canvas: "#F8FAFC",
        brand: "#0F766E",
        accent: "#F97316"
      },
      boxShadow: {
        panel: "0 22px 45px rgba(15, 23, 42, 0.12)"
      },
      backgroundImage: {
        hero: "radial-gradient(circle at top left, rgba(249, 115, 22, 0.16), transparent 30%), radial-gradient(circle at top right, rgba(15, 118, 110, 0.18), transparent 26%), linear-gradient(180deg, #f8fafc 0%, #ecfeff 100%)"
      }
    }
  },
  plugins: []
};

export default config;

