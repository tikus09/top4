// Better Auth settings shared by:
//   - src/lib/auth.ts (the real thing, running inside the Worker)
//   - better-auth.config.ts (only used by the CLI to generate database tables)
//
// Keep this file free of Cloudflare-only imports, so the CLI can read it on your computer.
import type { BetterAuthOptions } from 'better-auth';

export const authOptions = {
	appName: 'Top 4',

	// Sign up and log in with email + password.
	// Email verification is off for now (it needs an email-sending service).
	emailAndPassword: {
		enabled: true,
		minPasswordLength: 8,
		maxPasswordLength: 128,
		// After sign-up, the user is logged in right away.
		autoSignIn: true,
	},
} satisfies BetterAuthOptions;
