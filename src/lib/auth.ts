// The real Better Auth instance, used by server code inside the Worker.
// (Settings live in auth-options.ts. This file adds the Cloudflare parts.)
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { env } from 'cloudflare:workers';
import { getDb } from '../db';
import * as schema from '../db/schema';
import { authOptions } from './auth-options';

export const auth = betterAuth({
	...authOptions,

	// Store users, sessions and accounts in D1, through Drizzle.
	database: drizzleAdapter(getDb(), { provider: 'sqlite', schema }),

	// Signs session cookies so they can't be forged.
	// Local: from .dev.vars. Production: a Cloudflare secret.
	secret: env.BETTER_AUTH_SECRET,

	// The site's public address. Local: http://localhost:4321 (.dev.vars).
	// Production: https://top4.top4.workers.dev (wrangler.jsonc "vars").
	baseURL: env.BETTER_AUTH_URL,
});
