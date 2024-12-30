/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      screens: {
        xs: "450px", // Definir un nuevo breakpoint en 450px
      },
    },
  },
  plugins: [],
};
