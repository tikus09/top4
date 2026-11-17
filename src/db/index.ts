// Gives server code a Drizzle connection to our D1 database.
//
// `env` holds the Worker's bindings from wrangler.jsonc. `env.DB` is our D1
// database. It only exists on the server (inside the Worker), never in the browser.
import { env } from 'cloudflare:workers';
import { drizzle } from 'drizzle-orm/d1';
import * as schema from './schema';

export function getDb() {
	return drizzle(env.DB, { schema });
}
