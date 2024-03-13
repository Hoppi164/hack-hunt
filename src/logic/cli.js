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
    cat <filename> - Print the children of a file
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
	'cd',
	'ls',
	'pwd',
	'clear',

	'cat',
	'rm',
	'mv',
	'cp',
	'touch',
	'mkdir',
	'rmdir',
	'whoami',
	'scan',
	'hack',
	'scan-network',

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
		userData.currentServer = userData.homeServer;
		userData.currentServerPath = userData.homeComputerPath;
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
	// Check if the user is already logged in
	if (userData.loggedIn[userData.currentServer.ip]) {
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
	if (userData.currentServer === userData.homeServer) {
		return 'You cannot log out of your home server';
	}

	// Check if the user is already logged out
	if (!userData.loggedIn) {
		return 'You are already logged out';
	}

	user.update((userData) => {
		userData.loggedIn = false;
		userData.currentServer = userData.homeServer;
		userData.currentServerPath = userData.homeComputerPath;
		return userData;
	});

	return 'Logged out';
}

/**
 * Prints the current working directory
 * @returns {string} - The current working directory
 */
function pwd() {
	const userData = get(user);
	const fileSystem = userData.currentServer.fileSystem;

	return userData.currentServerPath;
}

/**
 * Change directory
 * - change the currentServerPath
 * - Should allow for relative paths, and absolute paths
 * - Should allow for navigating to direct child directory, or a full path to a deep directory
 * - Should not allow for navigating to a file
 * - Should not allow for navigating to a directory that doesn't exist
 * @param {Array} args - The directory to change to (pass as a string - this function will split it into an array and join it back together)
 * @throws {string} - Error message if the directory does not exist
 * @returns {string} - String indicating whether the directory change was successful
 */
function cd(...args) {
	const path = args.join(' ');
	const userData = get(user);
	const fileSystem = userData.currentServer.fileSystem;
	const currentDir = userData.currentServerDirectory;

	console.log({ path });

	if (!userData.loggedIn[userData.currentServer.ip]) {
		return 'You must be logged in to change directories';
	}

	let dirPath = path;

	// if Absolute path:
	if (path.startsWith('/')) {
		dirPath = dirPath;
	} else {
		dirPath = userData.currentServerPath + '/' + path;
	}
	dirPath = dirPath.slice(1);

	// add a / to the end of the path if there isn't one
	if (!dirPath.endsWith('/')) {
		dirPath = dirPath + '/';
	}

	// Accommodate for no path
	if (path === '') {
		dirPath = '/';
	}

	// Convert to absolute path of object, and then use eval to change the current path

	// Use regex to change '/<dirname>' to .children[<dirname>] except for the first /
	let newPath = `fileSystem["/"]` + dirPath.replaceAll(/(.*?)[\/]|([^\/]*)/g, '.children["$1"]');
	newPath = newPath.replaceAll('.children[""]', ''); // Remove any empty children
	console.log({ newPath });

	// Accommodate for the '..' command
	// Get rid of the two most recent .chilren in the path
	if (path === '..') {
		newPath = newPath.split('.children').slice(0, -2).join('.children');
		console.log({ newPath });
	}

	const targetDirectory = eval(newPath);

	if (!targetDirectory) {
		return `Directory not found: ${path}`;
	}

	// Change the current path
	user.update((userData) => {
		userData.currentServerDirectory = targetDirectory;
		userData.currentServerPath = targetDirectory.path;
		return userData;
	});
	return targetDirectory.path;
}

/**
 * List files in the current directory
 * @returns {string} - A string containing the files in the current directory
 */

function ls() {
	const userData = get(user);
	const currentDirectory = userData.currentServerDirectory;
	console.log({ currentDirectory });

	if (!userData.loggedIn[userData.currentServer.ip]) {
		return 'You must be logged in to list files';
	}

	const content = Object.keys(currentDirectory.children);
	return content.length ? content.join('  ') : 'No files or directories.';
}

export { commands, help, runCommand, getAllServers };
