// Settings for drizzle-kit, the tool that turns src/db/schema.ts into
// migration files. It never connects to the database itself: Wrangler applies
// the migrations (see the db:migrate scripts in package.json).
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
	dialect: 'sqlite', // D1 is SQLite
	schema: './src/db/schema.ts',
	out: './migrations', // must match "migrations_dir" in wrangler.jsonc
});
