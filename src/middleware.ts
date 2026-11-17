// Middleware: runs on the server BEFORE every page and API route.
// It looks at the visitor's session cookie, asks Better Auth who it belongs to,
// and stores the answer in `locals`, so any page can read Astro.locals.user.
import { defineMiddleware } from 'astro:middleware';
import { auth } from './lib/auth';

export const onRequest = defineMiddleware(async (context, next) => {
	// Start with "nobody is logged in".
	context.locals.user = null;
	context.locals.session = null;

	// Pages built ahead of time have no visitor (and no cookie): nothing to check.
	// Better Auth's own routes (/api/auth/*) check sessions themselves.
	if (context.isPrerendered || context.url.pathname.startsWith('/api/auth/')) {
		return next();
	}

	// Reads the session cookie from the request and looks it up in D1.
	// Returns null if there is no cookie, or if the session expired or was logged out.
	const result = await auth.api.getSession({ headers: context.request.headers });

	if (result) {
		context.locals.user = result.user;
		context.locals.session = result.session;
	}

	return next();
});
