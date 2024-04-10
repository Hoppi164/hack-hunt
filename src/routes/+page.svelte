<script>
	import { onMount } from 'svelte';
	import NetworkGraph from '$lib/../components/networkGraph.svelte';
	import Terminal from '$lib/../components/terminal.svelte';
	import MultiplayerManager from '../components/multiplayerManager.svelte';

	onMount(async () => {});
</script>

<div class="screen">
	<div class="column h-100 w-100">
		<MultiplayerManager />
		<Terminal />
		<NetworkGraph />
	</div>
</div>

<style>
	@import '/src/style/theme.css';
	.screen {
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;

		background-color: var(--background);
		color: var(--foreground);
	}

	.column {
		justify-content: space-between;
	}
</style>
