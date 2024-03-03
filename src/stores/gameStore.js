import { writable } from 'svelte/store';
import { initServers } from '/src/logic/servers';

export const allServers = writable(initServers());

// Contains the logic for the user
export const user = writable({
	currentServer: null,
	currentServerPath: '/',
	connectedToServer: false,
	loggedIn: false,
	username: null,
	password: null,
	homeComputer: null,
	connectedToHomeComputer: false,
	homeComputerPath: '/',
	knownCompromisedCredentials: {},
	knownServers: []
});
