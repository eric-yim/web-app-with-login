import type { Config } from "@react-router/dev/config";

export default {
  // Disable SSR - we only want pre-rendering (SSG)
  ssr: false,

  // Pre-render only the landing page at build time
  async prerender() {
    return ["/"];
  },
} satisfies Config;
