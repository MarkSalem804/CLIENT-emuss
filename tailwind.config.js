import { defineConfig } from "@tailwindcss/vite";

export default defineConfig({
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Custom EMUSS Color Palette
        teal: {
          // Based on #37CAB8
          50: "#f0fdfb", // Lightest pastel
          100: "#ccfbf1", // Light pastel
          200: "#99f6e4", // Pastel
          300: "#5eead4", // Light
          400: "#2dd4bf", // Medium light
          500: "#37CAB8", // Original
          600: "#2ba896", // Medium dark
          700: "#1f7a6b", // Dark
          800: "#155e52", // Darker
          900: "#0d4741", // Darkest
        },
        cyan: {
          // Based on #01A0B3
          50: "#ecfeff", // Lightest pastel
          100: "#cffafe", // Light pastel
          200: "#a5f3fc", // Pastel
          300: "#67e8f9", // Light
          400: "#22d3ee", // Medium light
          500: "#01A0B3", // Original
          600: "#0891b2", // Medium dark
          700: "#0e7490", // Dark
          800: "#155e75", // Darker
          900: "#164e63", // Darkest
        },
        amber: {
          // Based on #E3B225
          50: "#fffbeb", // Lightest pastel
          100: "#fef3c7", // Light pastel
          200: "#fde68a", // Pastel
          300: "#fcd34d", // Light
          400: "#fbbf24", // Medium light
          500: "#E3B225", // Original
          600: "#d69e2e", // Medium dark
          700: "#b7791f", // Dark
          800: "#975a16", // Darker
          900: "#78350f", // Darkest
        },
        pink: {
          // Based on #E3317B
          50: "#fdf2f8", // Lightest pastel
          100: "#fce7f3", // Light pastel
          200: "#fbcfe8", // Pastel
          300: "#f9a8d4", // Light
          400: "#f472b6", // Medium light
          500: "#E3317B", // Original
          600: "#db2777", // Medium dark
          700: "#be185d", // Dark
          800: "#9d174d", // Darker
          900: "#831843", // Darkest
        },
        lime: {
          // Based on #95C703
          50: "#f7fee7", // Lightest pastel
          100: "#ecfccb", // Light pastel
          200: "#d9f99d", // Pastel
          300: "#bef264", // Light
          400: "#a3e635", // Medium light
          500: "#95C703", // Original
          600: "#84cc16", // Medium dark
          700: "#65a30d", // Dark
          800: "#4d7c0f", // Darker
          900: "#365314", // Darkest
        },
        blue: {
          // Based on #2EA6B7
          50: "#f0f9ff", // Lightest pastel
          100: "#e0f2fe", // Light pastel
          200: "#bae6fd", // Pastel
          300: "#7dd3fc", // Light
          400: "#38bdf8", // Medium light
          500: "#2EA6B7", // Original
          600: "#0284c7", // Medium dark
          700: "#0369a1", // Dark
          800: "#075985", // Darker
          900: "#0c4a6e", // Darkest
        },
        emerald: {
          // Based on #35B46F
          50: "#ecfdf5", // Lightest pastel
          100: "#d1fae5", // Light pastel
          200: "#a7f3d0", // Pastel
          300: "#6ee7b7", // Light
          400: "#34d399", // Medium light
          500: "#35B46F", // Original
          600: "#10b981", // Medium dark
          700: "#059669", // Dark
          800: "#047857", // Darker
          900: "#064e3b", // Darkest
        },
        orange: {
          // Based on #F87137
          50: "#fff7ed", // Lightest pastel
          100: "#ffedd5", // Light pastel
          200: "#fed7aa", // Pastel
          300: "#fdba74", // Light
          400: "#fb923c", // Medium light
          500: "#F87137", // Original
          600: "#ea580c", // Medium dark
          700: "#c2410c", // Dark
          800: "#9a3412", // Darker
          900: "#7c2d12", // Darkest
        },
        aqua: {
          // Based on #36D9D4
          50: "#f0fdfa", // Lightest pastel
          100: "#ccfbf1", // Light pastel
          200: "#99f6e4", // Pastel
          300: "#5eead4", // Light
          400: "#2dd4bf", // Medium light
          500: "#36D9D4", // Original
          600: "#14b8a6", // Medium dark
          700: "#0d9488", // Dark
          800: "#0f766e", // Darker
          900: "#134e4a", // Darkest
        },
        sage: {
          // Based on #7DBCB4
          50: "#f6fffe", // Lightest pastel
          100: "#e6fffa", // Light pastel
          200: "#b3f5ec", // Pastel
          300: "#7dd3fc", // Light
          400: "#5eead4", // Medium light
          500: "#7DBCB4", // Original
          600: "#14b8a6", // Medium dark
          700: "#0f766e", // Dark
          800: "#115e59", // Darker
          900: "#134e4a", // Darkest
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
});
