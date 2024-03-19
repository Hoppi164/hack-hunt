import { writable } from 'svelte/store';
import { initServers, createRandomServer } from '$lib/../logic/servers';
import { runCommand } from '$lib/../logic/cli';
export const allServers = writable(initServers());

// Contains the logic for the user
export const user = writable({
	currentServer: {},
	currentServerDirectory: {},
	currentServerPath: '/',
	loggedIn: {},
	currentUser: {},
	homeServer: {},
	homeComputerPath: '/',
	knownServers: {}
});

export const initUser = () => {
	// Get a random home server
	const homeServer = createRandomServer();
	homeServer.name = 'Home Server';

	// Set the user's home server
	user.update((userData) => {
		userData.homeServer = homeServer;
		userData.knownServers[homeServer.ip] = {
			ip: homeServer.ip,
			name: homeServer.name,
			users: homeServer.users
		};
		userData.loggedIn[homeServer.ip] = true;
		userData.currentUser[homeServer.ip] = homeServer.users[0];
		userData.currentServer = homeServer;
		userData.currentServerPath = '/';
		userData.currentServerDirectory = homeServer.fileSystem['/'];
		return userData;
	});

	// Add the home server to the allServers object
	allServers.update((servers) => {
		servers[homeServer.ip] = homeServer;
		return servers;
	});

	// Connect to the home server
	runCommand(`connect ${homeServer.ip}`);
};

export const terminalContent = writable('');

initUser();
