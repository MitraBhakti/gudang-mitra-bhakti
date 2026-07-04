import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: "#F5F4EF",
        "paper-dark": "#EAE7DE",
        ink: "#1F2A24",
        primary: {
          DEFAULT: "#1F6F54",
          dark: "#14503C",
          light: "#E7F1EC",
        },
        accent: {
          DEFAULT: "#B8862F",
          dark: "#8F6821",
          light: "#F6EBD4",
        },
        danger: {
          DEFAULT: "#AE423E",
          light: "#F6E3E2",
        },
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "serif"],
        body: ["var(--font-inter)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
