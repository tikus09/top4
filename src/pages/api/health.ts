// GET /api/health: a tiny check that the Worker can talk to the D1 database.
// Returns JSON like: { "ok": true, "database": "connected", "tables": 0 }
import type { APIRoute } from 'astro';
import { sql } from 'drizzle-orm';
import { getDb } from '../../db';

// Run this on every request (on the server) instead of building it once
// at build time, because the answer comes from the live database.
export const prerender = false;

export const GET: APIRoute = async () => {
	try {
		const db = getDb();
		// Count our tables. sqlite_master is SQLite's built-in list of everything
		// in the database. We skip SQLite's and Cloudflare's own internal tables.
		// (Note: D1 blocks some SQLite functions, such as sqlite_version().)
		const row = await db.get<{ tables: number }>(sql`
			select count(*) as tables from sqlite_master
			where type = 'table' and name not like 'sqlite_%' and name not like '_cf_%'
		`);
		// Only the count is returned, so visitors can't see our table names.
		return Response.json({ ok: true, database: 'connected', tables: row.tables });
	} catch (error) {
		// Log the details for us (visible in Cloudflare's logs), but don't show them to visitors.
		console.error('Health check failed:', error);
		return Response.json({ ok: false, database: 'error' }, { status: 500 });
	}
};
