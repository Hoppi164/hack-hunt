import { writable } from 'svelte/store';
import { initServers } from '$lib/../logic/servers';

export const allServers = writable(initServers());

// Contains the logic for the user
export const user = writable({
	currentServer: null,
	currentServerPath: '/',
	connectedToServer: false,
	loggedIn: false,
	homeComputer: null,
	connectedToHomeComputer: false,
	homeComputerPath: '/',
	knownServers: {}
});
