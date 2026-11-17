<script lang="ts">
	// Log out button for the header. The server decides WHEN to show it
	// (only when someone is logged in). This island only handles the click.
	import { authClient } from '../lib/auth-client';

	let loggingOut = $state(false);

	async function logOut() {
		loggingOut = true;
		// POST /api/auth/sign-out: deletes the session in D1 and clears the cookie.
		await authClient.signOut();
		// Full page load, so the server renders the page as "logged out".
		window.location.href = '/';
	}
</script>

<button type="button" onclick={logOut} disabled={loggingOut}>
	{loggingOut ? 'Logging out…' : 'Log out'}
</button>
