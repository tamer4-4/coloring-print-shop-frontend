/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#2563EB",
        magenta: "#DB2777",
        cyanx: "#06B6D4",
        sun: "#FACC15",
        night: "#0F172A",
        snow: "#F8FAFC",
      },
      fontFamily: {
        head: ["Alexandria", "sans-serif"],
        body: ["Cairo", "sans-serif"],
      },
    },
  },
  plugins: [],
};