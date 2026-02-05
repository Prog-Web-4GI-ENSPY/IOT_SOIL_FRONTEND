// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}", // Vérifie que ce chemin englobe bien tout
  ],
  theme: {
    extend: {
      colors: {
        agro: {
          primary: "#15803D",
          bright: "#12A125",
          dark: "#052e16", // <--- Doit être présent ici
          bgGray: "#F3F4F6",
        },
      },
    },
  },
  plugins: [],
};
export default config;