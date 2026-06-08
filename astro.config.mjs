// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";

// https://astro.build/config
export default defineConfig({
  integrations: [
    starlight({
      title: "Cortexerr",
      social: [
        {
          icon: "github",
          label: "GitHub",
          href: "https://github.com/withastro/starlight",
        },
      ],
      sidebar: [
        // {
        //   label: "Overview",
        //   items: [
        //     // Each item here is one entry in the navigation menu.
        //     { label: "Example Guide", slug: "guides/example" },
        //   ],
        // },
        // {
        //   label: "Setup Guide",
        //   items: [
        //     // Each item here is one entry in the navigation menu.
        //     { label: "Example Guide", slug: "guides/example" },
        //   ],
        // },
        {
          label: "Overview",
          items: [{ autogenerate: { directory: "overview" } }],
        },
        {
          label: "Setup Guide",
          items: [{ autogenerate: { directory: "setup-guide" } }],
        },
        {
          label: "Configuration Guide",
          items: [{ autogenerate: { directory: "configuration-guide" } }],
        },
        {
          label: "Api Guide",
          items: [{ autogenerate: { directory: "api-guide" } }],
        },
        {
          label: "Api References",
          items: [{ autogenerate: { directory: "api-references" } }],
        },
      ],
    }),
  ],
});
