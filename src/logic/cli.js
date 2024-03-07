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
	'getRandomServerIP'
];

function runCommand(command, args) {
	if (!commands.includes(command)) {
		return `Command not found: ${command}`;
	}

	return eval(`${command}("${args.join(', ')}")`);
}

function getAllServers() {
	return get(allServers);
}
function getRandomServerIP() {
	const allServerIps = Object.keys(get(allServers));
	const numServers = allServerIps.length;
	const randomIndex = randomNumber(0, numServers - 1);
	return allServerIps[randomIndex];
}

/**
 * Connect to a server
 * @param {string} ip - The IP address of the server to connect to
 * @returns {string} - String indicating whether the connection was successful
 */

function connect(ip) {
	if (!ip) return 'Please enter an IP address to connect to. Usage: connect <ip>';

	const doesServerExist = get(allServers)[ip];
	if (!doesServerExist) {
		return `Server not found: ${ip}`;
	}

	user.update((userData) => {
		userData.currentServer = allServers[ip];
		userData.currentServerPath = '/';
		userData.connectedToServer = true;
		return userData;
	});

	const connectedServer = get(allServers)[ip];

	return `Connected to ${connectedServer.name} at ${ip}`;
}

/**
 * Disconnect from the current server
 * @returns {void}
 */
function disconnect() {
	user.currentServer = null;
	user.currentServerPath = '/';
	user.connectedToServer = false;
}

/**
 * Log in to the current server
 * @param {string} username - The username to log in with
 * @param {string} password - The password to log in with
 * @returns {boolean} - Whether the login was successful
 */

export { commands, help, runCommand, connect, disconnect, getAllServers, getRandomServerIP };
