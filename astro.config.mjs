// @ts-check
import { defineConfig } from 'astro/config';

import svelte from '@astrojs/svelte';

import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  integrations: [svelte()],

  adapter: cloudflare({
    // Serve images as-is. We don't need Cloudflare Images (an extra service) yet.
    imageService: 'passthrough',
  }),

  // Turn off Astro's built-in sessions. Logins will be handled by Better Auth,
  // which stores its sessions in our D1 database. Without this, the Cloudflare
  // adapter would create an extra KV storage namespace we don't use.
  session: false,
});
