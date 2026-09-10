import { defineConfig } from "astro";

export default defineConfig({
  site: "https://binsight.id",
  output: "static",

  vite: {
    define: {
      __BINSIGHT__: JSON.stringify(true),
    },
  },
});