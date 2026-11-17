// Types for Astro.locals: what the middleware (src/middleware.ts) stores for each request.
// `typeof auth.$Infer.Session` is the exact shape Better Auth returns.
type AuthSession = typeof import('./lib/auth').auth.$Infer.Session;

declare namespace App {
	interface Locals {
		/** The logged-in user, or null if nobody is logged in. */
		user: AuthSession['user'] | null;
		/** The current session (expiry date etc.), or null if nobody is logged in. */
		session: AuthSession['session'] | null;
	}
}
