// The real Better Auth instance, used by server code inside the Worker.
// (Settings live in auth-options.ts. This file adds the Cloudflare parts.)
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { env } from 'cloudflare:workers';
import { eq } from 'drizzle-orm';
import { getDb } from '../db';
import * as schema from '../db/schema';
import { authOptions } from './auth-options';
import { hashPassword, needsRehash, verifyPassword } from './password';

const db = getDb();

export const auth = betterAuth({
	...authOptions,

	emailAndPassword: {
		...authOptions.emailAndPassword,
		// Our own password hashing (native scrypt with lighter settings), see password.ts.
		password: {
			hash: hashPassword,
			verify: async ({ hash, password }) => {
				const ok = await verifyPassword({ hash, password });
				// Correct password, but saved with old settings? Save it again with the
				// current settings, so the next log-in is fast. (Each hash has a random
				// salt, so `password = old hash` matches exactly one account row.)
				if (ok && needsRehash(hash)) {
					try {
						await db
							.update(schema.account)
							.set({ password: await hashPassword(password), updatedAt: new Date() })
							.where(eq(schema.account.password, hash));
					} catch (error) {
						// Not fatal: the log-in still works, we just try again next time.
						console.error('Password re-hash failed', error);
					}
				}
				return ok;
			},
		},
	},

	// Store users, sessions and accounts in D1, through Drizzle.
	database: drizzleAdapter(db, { provider: 'sqlite', schema }),

	// Signs session cookies so they can't be forged.
	// Local: from .dev.vars. Production: a Cloudflare secret.
	secret: env.BETTER_AUTH_SECRET,

	// The site's public address. Local: http://localhost:4321 (.dev.vars).
	// Production: https://top4.top4.workers.dev (wrangler.jsonc "vars").
	baseURL: env.BETTER_AUTH_URL,
});
