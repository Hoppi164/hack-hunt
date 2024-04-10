<script>
	import { onMount } from 'svelte';
	import { randomString } from '../logic/random.js';

	let isHost = false;

	let localOffer = '';
	let remoteAnswer = '';
	let remoteOffer = '';
	let localAnswer = '';

	let allConnections = [];
	let allDataChannels = [];

	let allPlayers = [];

	var cfg = { iceServers: [{ url: 'stun:stun.gmx.net' }] };
	let con = { optional: [{ DtlsSrtpKeyAgreement: true }] };
	var sdpConstraints = {
		optional: []
	};

	// Create the functionality to allow the user to create a new lobby
	// Multiple users can join the lobby,
	// The lobby will work in a star type webRTC network
	// Any messages sent to the lobby host will be broadcasted to all other users in the lobby

	// Create a new lobby
	function inviteNewPlayer() {
		isHost = true;
		var pc1 = new RTCPeerConnection(cfg, con);
		let dc1 = null;

		dc1 = pc1.createDataChannel('lobby', { reliable: true });
		dc1.onopen = function (e) {};
		dc1.onmessage = function (e) {
			var data = JSON.parse(e.data);
			const message = data.message;
			alert(`Got message: \n\n${message}`);
		};
		pc1.createOffer(
			function (desc) {
				pc1.setLocalDescription(
					desc,
					function () {},
					function () {}
				);
			},
			function () {},
			sdpConstraints
		);
		pc1.onicecandidate = function (e) {
			if (e.candidate == null) {
				localOffer = JSON.stringify(pc1.localDescription);
				let base64Offer = btoa(localOffer);
				let lobbyLink = window.location.href + '?lobby=' + base64Offer;
				alert(lobbyLink);
			}
		};
		// localOffer = JSON.stringify(offer);
		// let base64Offer = btoa(localOffer);
		// lobbyLink = window.location.href + '?lobby=' + base64Offer;
		allConnections.push(pc1);
		allDataChannels.push(dc1);
	}

	// Join an existing lobby
	function joinLobby() {
		const urlParams = new URLSearchParams(window.location.search);
		const lobby = urlParams.get('lobby');

		if (lobby) {
			const base64Offer = lobby;
			const offer = atob(base64Offer);
			const remoteOffer = JSON.parse(offer);

			var pc2 = new RTCPeerConnection(cfg, con);
			let dc2 = null;

			pc2.ondatachannel = function (e) {
				var datachannel = e.channel || e;
				dc2 = datachannel;
				dc2.onopen = function (e) {};
				dc2.onmessage = function (e) {
					var data = JSON.parse(e.data);
					const message = data.message;
					console.log(message);
					alert(`Got message: \n\n${message}`);
				};
				allDataChannels.push(dc2);
			};

			pc2.onicecandidate = function (e) {
				if (e.candidate == null) {
					const answer = JSON.stringify(pc2.localDescription);
					const base64Answer = btoa(answer);
					alert(
						`Please copy the following answer and send it to the lobby host:\n\n${base64Answer}`
					);
				}
			};

			var offerDesc = new RTCSessionDescription(remoteOffer);
			pc2.setRemoteDescription(offerDesc);
			pc2.createAnswer(
				function (answerDesc) {
					pc2.setLocalDescription(answerDesc);
				},
				function () {},
				sdpConstraints
			);

			allConnections.push(pc2);
		}
	}

	// Send a message to the lobby
	function sendMessage(message) {
		const msg = prompt('Please enter the message you would like to send to the lobby');

		allDataChannels.forEach((dc) => {
			dc.send(JSON.stringify({ message: msg }));
		});
	}

	// Accept a new player
	function acceptNewPlayer() {
		const base64Answer = prompt('Please enter the base64 answer from the new player');
		const answer = atob(base64Answer);
		const remoteAnswer = JSON.parse(answer);
		var answerDesc = new RTCSessionDescription(remoteAnswer);
		allConnections[0].setRemoteDescription(answerDesc);
	}

	// Onload, check if the user is joining a lobby
	onMount(() => {
		joinLobby();
	});

	// Leave a lobby

	// Start a game
</script>

<div class="multiplayerManager">
	<h1>Multiplayer Manager</h1>
	<button on:click={inviteNewPlayer}>Invite New Player</button>
	<button on:click={acceptNewPlayer}>Accept New Player</button>
	<button>Close Lobby</button>
	<button>Start Game</button>
	<button on:click={sendMessage}>Send Message</button>
</div>

<style>
	.multiplayerManager {
		width: 100%;
		min-width: 100px;
		min-height: 100px;
		background-color: var(--background-inverse);
		border: 2px solid var(--border);
		color: var(--text);
		overflow: hidden;
	}
</style>
