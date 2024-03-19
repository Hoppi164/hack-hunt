<script>
	import { user } from '$lib/../stores/gameStore';
	import { runCommand } from '../logic/cli';
	import { terminalContent } from '../stores/gameStore.js';

	let userData = {};
	let knownServers = {};
	let knownServersList = [];
	let knownServerIps = [];
	user.subscribe((value) => {
		userData = value;
		knownServers = userData.knownServers;
		knownServersList = Object.values(knownServers);
		knownServerIps = Object.keys(knownServers).map((key) => knownServers[key].ip);
	});

	export let server;

	let nodeRef;
	$: showNode = knownServerIps.includes(server.ip);
	$: nodeVisibility = showNode ? 'visible' : 'hidden';
	$: nodeRef?.style.setProperty('--show-node', `${nodeVisibility}`);

	$: serverIp = showNode ? server.ip : '';
	$: serverName = showNode ? server.name : '';

	let sideOfScreen = 'left';
	$: nodeRef?.style.setProperty('--direction', sideOfScreen === 'left' ? '-10px' : '-25px');
	function handleMouseMove(e) {
		const clientX = e.clientX;
		const windowWidth = window.innerWidth;
		sideOfScreen = clientX > windowWidth / 2 ? 'right' : 'left';
	}

	function connectToServer() {
		console.log('clicked');
		const result = runCommand(`connect`, [serverIp]);
		terminalContent.update((content) => `${content}\nconnect ${serverIp}\n${result}\n`);
	}
</script>

<div
	class="networkNode"
	bind:this={nodeRef}
	on:mouseenter={handleMouseMove}
	on:click={connectToServer}
>
	<svg viewBox="0 0 100 100">
		<circle cx="50" cy="50" r="40" />

		<text x="50%" y="35%" text-anchor="middle" fill="white" dy=".3em">
			{server.name.slice(0, 16)}
		</text>
		<text x="50%" y="45%" text-anchor="middle" fill="white" dy=".3em">
			{server.name.length > 16 ? server.name.slice(16, 32) : ''}
		</text>
		<text x="50%" y="55%" text-anchor="middle" fill="white" dy=".3em">
			{server.name.length > 32 ? server.name.slice(32, 48) : ''}
		</text>
		<text x="50%" y="55%" text-anchor="middle" fill="white" dy="1.5em">
			{server.ip}
		</text>
	</svg>
</div>

<style>
	.networkNode {
		visibility: var(--show-node);
		position: relative;
		height: 55px;
		width: 55px;
		cursor: pointer;
		overflow: visible;
	}
	.networkNode > svg > circle {
		stroke: var(--border);
		fill: var(--background-inverse);
		fill-opacity: 0.5;
		stroke-width: 3;
	}
	.networkNode > svg {
		width: 55px;
		height: 55px;
		transition: all 0.3s;
	}
	.networkNode > svg > text {
		visibility: hidden;
		font-size: 10px;
	}
	.networkNode:hover > svg {
		height: 125px;
		width: 125px;
		margin-top: -70%;
		margin-left: var(--direction);
	}

	.networkNode:hover > svg > circle {
		stroke: var(--border);
		fill: var(--highlight);
		fill-opacity: 1;
	}
	.networkNode:hover > svg > text {
		visibility: visible;
	}
</style>
