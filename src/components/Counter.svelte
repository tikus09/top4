<script lang="ts">
	// A tiny Svelte 5 component, to prove interactivity works.
	// Everything between <script> tags runs in the browser.

	// Props: values the parent page passes in. Here: the starting number.
	let { start = 0 }: { start?: number } = $props();

	// $state makes "count" reactive: when it changes, the page updates.
	let count = $state(start);
</script>

<button onclick={() => count++}>
	Clicked {count} {count === 1 ? 'time' : 'times'}
</button>

<style>
	/* Styles here only apply to this component, not the whole page. */
	button {
		font: inherit;
		padding: 0.5rem 1rem;
		border-radius: 0.5rem;
		cursor: pointer;
	}
</style>
