// Better Auth's BROWSER-side client, used by Svelte components.
// It sends requests to /api/auth/* on the same website, so no address is needed.
// (The server-side setup is in auth.ts. Never import that one in components.)
import { createAuthClient } from 'better-auth/svelte';

export const authClient = createAuthClient();
