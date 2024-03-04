<script>
	import { allServers } from '/src/stores/gameStore';
	import NetworkNode from '/src/components/networkNode.svelte';

	$: allServersList = Object.values($allServers);
</script>

<div id="networkGraph">
	<!-- Create a graph of nodes -->
	<!-- Distribute nodes around the graph seemingly randomly -->
	<!-- Connect nodes with lines -->
	{#each allServersList as server}
		<div class="nodeContainer">
			<NetworkNode />
		</div>
	{/each}
</div>

<style>
	#networkGraph {
		width: 100%;
		min-width: 100px;
		min-height: 100px;
		background-color: var(--background);
		border: 2px solid var(--border);
		color: var(--text);
	}

	/* Make each node distribute like a node graph */
	#networkGraph {
		display: flex;
		flex-direction: row;
		justify-content: space-around;
		align-items: center;
		flex-wrap: wrap;
	}
	#networkGraph .nodeContainer:nth-child(3n) {
		position: relative;
		margin-top: -10px;
		margin-right: -7px;
	}
	#networkGraph .nodeContainer:nth-child(2n) {
		position: relative;
		margin-top: 8px;
		margin-right: 13px;
	}
	#networkGraph .nodeContainer:nth-child(5n) {
		position: relative;
		margin-top: -3px;
		margin-right: 4px;
	}
	#networkGraph .nodeContainer:nth-child(7n) {
		position: relative;
		margin-top: 10px;
		margin-right: 6px;
	}
	#networkGraph .nodeContainer:nth-child(10n) {
		position: relative;
		margin-top: -25px;
		margin-right: -13px;
	}
</style>
