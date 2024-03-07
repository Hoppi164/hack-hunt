import { get } from 'svelte/store';
import { user, allServers } from '$lib/../stores/gameStore';
import { randomNumber } from './random';

// This file contains all the commands a user can enter into their fake terminal.

/**
 * Prints a help message to the terminal
 * @returns {string}
 */
function help() {
	return `Available commands:
    help - Show this help message
    connect <ip> - Connect to a server
    disconnect - Disconnect from the server
    login <username> <password> - Log in to the server
    logout - Log out of the server
    scan - Scan the server for open ports
    hack - Attempt to hack the server
    scan-network - Scan the network for connected servers
    cd <directory> - Change directory
    ls - List files in the current directory
    cat <filename> - Print the contents of a file
    clear - Clear the terminal screen
    rm <filename> - Remove a file
    mv <filename1> <filename2> - Move a file
    cp <filename1> <filename2> - Copy a file
    touch <filename> - Create a new file
    mkdir <directory> - Create a new directory
    rmdir <directory> - Remove a directory
    pwd - Print the current working directory
    whoami - Print the current user
    `;
}

const commands = [
	'help',
	'connect',
	'disconnect',
	'login',
	'logout',
	'scan',
	'hack',
	'scan-network',
	'cd',
	'ls',
	'cat',
	'clear',
	'rm',
	'mv',
	'cp',
	'touch',
	'mkdir',
	'rmdir',
	'pwd',
	'whoami',
	'getAllServers',
	'getRandomServerIP',
	'getRandomServer',
	'getUserData'
];

function runCommand(command, args) {
	if (!commands.includes(command)) {
		return `Command not found: ${command}`;
	}

	// Trim any quotes from the arguments
	args = args.map((arg) => arg.replace(/"/g, ''));

	return eval(`${command}("${args.join('", "')}")`);
}

function getAllServers() {
	return get(allServers);
}
function getRandomServer() {
	const allServerIps = Object.keys(get(allServers));
	const numServers = allServerIps.length;
	const randomIndex = randomNumber(0, numServers - 1);
	return get(allServers)[allServerIps[randomIndex]];
}
function getRandomServerIP() {
	const allServerIps = Object.keys(get(allServers));
	const numServers = allServerIps.length;
	const randomIndex = randomNumber(0, numServers - 1);
	return allServerIps[randomIndex];
}

function getUserData() {
	return get(user);
}

/**
 * Connect to a server
 * @param {string} ip - The IP address of the server to connect to
 * @returns {string} - String indicating whether the connection was successful
 */

function connect(ip) {
	if (!ip) return 'Please enter an IP address to connect to. Usage: connect <ip>';
	const userData1 = get(user);
	console.log({ userData1 });

	const server = get(allServers)[ip];
	if (!server) {
		return `Server not found: ${ip}`;
	}

	user.update((userData) => {
		userData.currentServer = server;
		userData.currentServerPath = '/';
		userData.connectedToServer = true;
		userData.knownServers[ip] = userData.knownServers[ip] || { ip, name: server.name, users: {} };
		return userData;
	});

	const connectedServer = get(allServers)[ip];
	const userData = get(user);
	console.log({ userData });

	return `Connected to ${connectedServer.name} at ${ip}`;
}

/**
 * Disconnect from the current server
 * @returns {string} - String indicating whether the disconnection was successful
 */
function disconnect() {
	user.update((userData) => {
		userData.currentServer = null;
		userData.currentServerPath = '/';
		userData.connectedToServer = false;
		return userData;
	});

	return 'Disconnected from server';
}

/**
 * Log in to the current server
 * @param {string} username - The username to log in with
 * @param {string} password - The password to log in with
 * @returns {string} - String indicating whether the login was successful
 */
function login(username, password) {
	console.log({ username, password });

	if (!username || !password) {
		return 'Please enter a username and password to log in. Usage: login <username> <password>';
	}

	// Check if the user is connected to a server
	const userData = get(user);
	if (!userData.connectedToServer || !userData.currentServer) {
		console.log({ userData });

		return 'You must be connected to a server to log in';
	}

	// Check if the user is already logged in
	if (userData.loggedIn) {
		return 'You are already logged in';
	}

	// Check if the username and password are correct
	const server = userData.currentServer;
	const userAccount = server.users.find((user) => user.username === username);
	const passwordCorrect = userAccount && userAccount.password === password;

	if (passwordCorrect) {
		user.update((userData) => {
			userData.loggedIn = true;
			userData.knownServers[server.ip].users[username] = { username, password };
			return userData;
		});
		return `Logged in as ${username}`;
	} else {
		return 'Invalid username or password';
	}
}

/**
 * Log out of the current server
 * @returns {string} - String indicating whether the logout was successful
 */
function logout() {
	// Check if the user is connected to a server
	const userData = get(user);
	if (!userData.connectedToServer || !userData.currentServer) {
		return 'You must be connected to a server to log out';
	}

	// Check if the user is already logged out
	if (!userData.loggedIn) {
		return 'You are already logged out';
	}

	user.update((userData) => {
		userData.loggedIn = false;
		userData.currentServer = null;
		userData.currentServerPath = '/';
		userData.connectedToServer = false;
		return userData;
	});

	return 'Logged out';
}

export { commands, help, runCommand, getAllServers };
