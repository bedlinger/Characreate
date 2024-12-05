 /** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f9f8fa",
          100: "#f4f2f5",
          200: "#eae7ed",
          300: "#d9d4de",
          400: "#c4bbca",
          500: "#ab9fb3",
          600: "#94839c",
          700: "#85758c",
          800: "#706176",
          900: "#5c5161",
          950: "#3c3540",
        },
      },
    },
  },
  plugins: [],
};

