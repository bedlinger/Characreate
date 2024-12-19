// https://nuxt.com/docs/api/configuration/nuxt-config
import { definePreset } from "@primevue/themes";
import Aura from "@primevue/themes/aura";

const CharaTheme = definePreset(Aura, {
  semantic: {
    primary: {
      "50": "#f9f8fa",
      "100": "#f4f2f5",
      "200": "#eae7ed",
      "300": "#d9d4de",
      "400": "#c4bbca",
      "500": "#ab9fb3",
      "600": "#94839c",
      "700": "#85758c",
      "800": "#706176",
      "900": "#5c5161",
      "950": "#3c3540",
    },
    colorScheme: {
      light: {
        primary: {
          color: "{primary.700}",
          inverseColor: "#ffffff",
          hoverColor: "{primary.800}",
          activeColor: "{primary.800}",
        },
        highlight: {
          background: "{primary.700}",
          focusBackground: "{primary.800}",
          color: "#ffffff",
          focusColor: "#ffffff",
        },
      },
    },
  },
});

export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  css: ["~/assets/css/main.css"],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  modules: ["@primevue/nuxt-module", "@nuxt/icon"],
  primevue: {
    options: {
      theme: {
        preset: CharaTheme,
        options: {
          darkModeSelector: ".fake-dark-selector",
        },
      },
    },
    autoImport: true,
  },
});