<script lang="ts">
	// Sign-up form. On success, Better Auth logs the new user in (autoSignIn)
	// and sets the session cookie, then we go to the home page.
	import { authClient } from '../lib/auth-client';

	// Form fields. bind:value (below) keeps them in sync with the inputs.
	let name = $state('');
	let email = $state('');
	let password = $state('');

	let errorMessage = $state<string | null>(null);
	let submitting = $state(false);

	async function handleSubmit(event: SubmitEvent) {
		// Stop the browser's default form submit (a full page reload).
		event.preventDefault();
		errorMessage = null;
		submitting = true;

		try {
			// POST /api/auth/sign-up/email
			const { error } = await authClient.signUp.email({ name, email, password });
			if (error) {
				// For example: "User already exists. Use another email."
				errorMessage = error.message ?? 'Sign-up failed. Please try again.';
				return;
			}
			// Full page load, so the whole site sees the new session cookie.
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
		Display name
		<input type="text" bind:value={name} required maxlength="50" autocomplete="nickname" />
	</label>

	<label>
		Email
		<input type="email" bind:value={email} required autocomplete="email" />
	</label>

	<label>
		Password
		<!-- autocomplete="new-password" lets password managers suggest a strong one -->
		<input
			type="password"
			bind:value={password}
			required
			minlength="8"
			maxlength="128"
			autocomplete="new-password"
		/>
		<span class="hint">At least 8 characters.</span>
	</label>

	{#if errorMessage}
		<!-- role="alert" makes screen readers announce the error -->
		<p class="error" role="alert">{errorMessage}</p>
	{/if}

	<button type="submit" disabled={submitting}>
		{submitting ? 'Creating account…' : 'Create account'}
	</button>
</form>
