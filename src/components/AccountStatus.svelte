<script lang="ts">
	// Shows who is logged in (asked from the browser), with a Log out button.
	// Step 9 will also check the session on the server, before the page loads.
	import { authClient } from '../lib/auth-client';

	// A "store": a value that updates by itself. $session (with $) reads it,
	// and Svelte re-renders whenever it changes (for example after logging out).
	const session = authClient.useSession();

	let loggingOut = $state(false);

	async function logOut() {
		loggingOut = true;
		// POST /api/auth/sign-out: deletes the session in D1 and clears the cookie.
		await authClient.signOut();
		window.location.href = '/';
	}
</script>

{#if $session.isPending}
	<p>Checking your account…</p>
{:else if $session.data}
	<p>
		Logged in as <strong>{$session.data.user.name}</strong>
		({$session.data.user.email})
	</p>
	<button onclick={logOut} disabled={loggingOut}>
		{loggingOut ? 'Logging out…' : 'Log out'}
	</button>
{:else}
	<p>You're not logged in. <a href="/login">Log in</a> or <a href="/signup">sign up</a>.</p>
{/if}
