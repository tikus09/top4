<script lang="ts">
	// Log-in form. On success, Better Auth sets the session cookie,
	// then we go to the home page.
	import { authClient } from '../lib/auth-client';

	let email = $state('');
	let password = $state('');

	let errorMessage = $state<string | null>(null);
	let submitting = $state(false);

	async function handleSubmit(event: SubmitEvent) {
		event.preventDefault();
		errorMessage = null;
		submitting = true;

		try {
			// POST /api/auth/sign-in/email
			const { error } = await authClient.signIn.email({ email, password });
			if (error) {
				// Better Auth deliberately says "Invalid email or password" for both
				// cases, so attackers can't find out which emails have accounts.
				errorMessage = error.message ?? 'Log-in failed. Please try again.';
				return;
			}
			window.location.href = '/';
		} catch {
			errorMessage = 'Could not reach the server. Check your connection and try again.';
		} finally {
			submitting = false;
		}
	}
</script>

<form onsubmit={handleSubmit}>
	<label>
		Email
		<input type="email" bind:value={email} required autocomplete="email" />
	</label>

	<label>
		Password
		<!-- autocomplete="current-password" lets password managers fill it in -->
		<input type="password" bind:value={password} required autocomplete="current-password" />
	</label>

	{#if errorMessage}
		<p class="error" role="alert">{errorMessage}</p>
	{/if}

	<button type="submit" disabled={submitting}>
		{submitting ? 'Logging in…' : 'Log in'}
	</button>
</form>
