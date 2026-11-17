// Catch-all route: every request to /api/auth/* (sign-up, sign-in, sign-out,
// get-session...) is handed to Better Auth, which knows what to do with it.
import type { APIRoute } from 'astro';
import { auth } from '../../../lib/auth';

// Always run on the server: these answers depend on the request and the database.
export const prerender = false;

// ALL = handle every HTTP method (GET, POST...).
export const ALL: APIRoute = ({ request }) => auth.handler(request);
