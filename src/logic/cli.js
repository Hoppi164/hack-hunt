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
const commandMap = {
	help: help,
	connect: connect,
	disconnect: disconnect,
	login: login,
	logout: logout,
	cd: cd,
	ls: ls,
	pwd: pwd,
	clear: () => '',
	cat: cat,
	rm: rm,
	mv: mv,
	cp: cp,
	touch: touch,
	mkdir: mkdir,
	rmdir: rmdir,
	whoami: whoami,
	scan: () => 'Scanning...',
	hack: () => 'Hacking...',
	'scan-network': () => 'Scanning...',
	getAllServers: getAllServers,
	getRandomServerIP: getRandomServerIP,
	getRandomServer: getRandomServer,
	getUserData: getUserData
};

function runCommand(command, args) {
	if (!commands.includes(command)) {
		return `Command not found: ${command}`;
	}

	// Trim any quotes from the arguments
	args = args.map((arg) => arg.replace(/"/g, ''));
	const arg0 = args?.[0];
	const args1 = args?.[1];

	// Run the command
	return commandMap[command](arg0, args1);
}

function getAllServers() {
	return get(allServers);
}
function getRandomServer() {
	const allServerIps = Object.keys(get(allServers));
	const numServers = allServerIps.length;
	const randomIndex = randomNumber(0, numServers - 1);

	const newServer = get(allServers)[allServerIps[randomIndex]];

	user.update((userData) => {
		userData.knownServers[newServer.ip] = userData.knownServers[newServer.ip] || {
			ip: newServer.ip,
			name: newServer.name,
			users: {}
		};
		return userData;
	});

	return newServer;
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

	const server = get(allServers)[ip];
	if (!server) {
		return `Server not found: ${ip}`;
	}

	user.update((userData) => {
		userData.currentServer = server;
		userData.currentServerPath = '/';
		userData.currentServerDirectory = server.fileSystem['/'];
		userData.knownServers[ip] = userData.knownServers[ip] || { ip, name: server.name, users: {} };
		return userData;
	});

	const connectedServer = get(allServers)[ip];

	return `Connected to ${connectedServer.name} at ${ip}`;
}

/**
 * Disconnect from the current server
 * @returns {string} - String indicating whether the disconnection was successful
 */
function disconnect() {
	// Check if the user is connected to a server
	const userData = get(user);
	if (userData.currentServer === userData.homeServer) {
		return 'You cannot disconnect from your home server';
	}

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
			userData.loggedIn[server.ip] = true;
			userData.currentUser[server.ip] = { username, password };
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
	if (!userData.loggedIn[userData.currentServer.ip]) {
		return 'You are already logged out';
	}

	user.update((userData) => {
		userData.loggedIn[userData.currentServer.ip] = false;
		delete userData.currentUser[userData.currentServer.ip];
		userData.currentServer = userData.homeServer;
		userData.currentServerPath = userData.homeComputerPath;
		userData.currentServerDirectory = userData.homeServer.fileSystem['/'];
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

	if (!userData.loggedIn[userData.currentServer.ip]) {
		return 'You must be logged in to change directories';
	}

	const targetDirectory = getFileFromPath(path);

	if (!targetDirectory) {
		return `Directory not found: ${path}`;
	}

	if (targetDirectory.type !== 'directory') {
		return `${path} is not a directory`;
	}

	// Change the current path
	user.update((userData) => {
		userData.currentServerDirectory = targetDirectory;
		userData.currentServerPath = targetDirectory.path;
		return userData;
	});
	return targetDirectory.path;
}

function getFileFromPath(path) {
	const userData = get(user);
	const fileSystem = userData.currentServer.fileSystem;

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

	// Convert to absolute path of object, and then parse the path to change the current directory

	// Use regex to change '/<dirname>' to .children[<dirname>] except for the first /
	let newPath = `fileSystem["/"]` + dirPath.replaceAll(/(.*?)[\/]|([^\/]*)/g, '.children["$1"]');
	newPath = newPath.replaceAll('.children[""]', ''); // Remove any empty children

	// Accommodate for the '..' command
	// Get rid of the two most recent .children in the path
	if (path === '..') {
		newPath = newPath.split('.children').slice(0, -2).join('.children');
	}

	// Parse the newPath to get the target directory
	let targetDirectory = fileSystem['/'];
	newPath = newPath.split('fileSystem["/"]')[1];
	let pathArray = newPath.split('.children');
	pathArray = pathArray.map((child) => {
		return child.replaceAll('[', '').replaceAll(']', '').replaceAll('"', '').trim();
	});

	for (const child of pathArray) {
		if (child === '') continue;
		targetDirectory = targetDirectory.children[child];
	}
	return targetDirectory;
}

/**
 * List files in the current directory
 * @returns {string} - A string containing the files in the current directory
 */

function ls() {
	const userData = get(user);
	const currentDirectory = userData.currentServerDirectory;

	if (!userData.loggedIn[userData.currentServer.ip]) {
		return 'You must be logged in to list files';
	}

	const content = Object.keys(currentDirectory.children);
	return content.length ? content.join('  ') : 'No files or directories.';
}

/**
 * Read the contents of a file
 * @param {string} path - The path of the file to read
 * @returns {string} - The contents of the file
 * @throws {string} - Error message if the file does not exist
 * @throws {string} - Error message if the file is not a file
 */
function cat(path) {
	const userData = get(user);
	const targetDirectory = getFileFromPath(path);

	if (!targetDirectory) {
		return `File not found: ${path}`;
	}

	if (targetDirectory.type !== 'file') {
		return `${path} is not a file`;
	}

	return targetDirectory.children;
}

/**
 * Delete a file
 * @param {string} path - The path of the file to delete
 * @returns {string} - String indicating whether the file was deleted successfully
 * @throws {string} - Error message if the file does not exist
 * @throws {string} - Error message if the file is not a file
 */
function rm(path) {
	const targetFile = getFileFromPath(path);
	const parentDirPath = targetFile.path.split('/').slice(0, -1).join('/') || pwd();
	const parentDir = getFileFromPath(parentDirPath) || pwd();
	const fileName = path.split('/').slice(-1)[0];

	if (!targetFile) {
		return `File not found: ${path}`;
	}

	if (targetFile.type !== 'file') {
		return `${path} is not a file`;
	}

	delete parentDir.children[fileName];

	return `Deleted ${path}`;
}

/**
 * Copy a file
 * Should allow the destination to be a directory or a file
 * @param {string} source - The path of the file to copy
 * @param {string} destination - The path to copy the file to
 * @returns {string} - String indicating whether the file was copied successfully
 * @throws {string} - Error message if the source file does not exist
 * @throws {string} - Error message if the source file is not a file
 * @throws {string} - Error message if the destination file already exists
 */
function cp(source, destination) {
	const sourceFile = getFileFromPath(source);
	const destinationFile = getFileFromPath(destination);
	const fileName = destination.split('/').slice(-1)[0];

	if (!sourceFile) {
		return `File not found: ${source}`;
	}

	if (sourceFile.type !== 'file') {
		return `${source} is not a file`;
	}

	if (destinationFile && destinationFile.type === 'file') {
		return `File already exists at ${destination}`;
	}

	if (destinationFile && destinationFile.type === 'directory') {
		destinationFile.children[fileName] = structuredClone(sourceFile);
		destinationFile.children[fileName].path = destination + '/' + fileName;
	}

	if (!destinationFile) {
		const parentDirPath = destination.split('/').slice(0, -1).join('/') || pwd();
		const parentDir = getFileFromPath(parentDirPath);
		parentDir.children[fileName] = structuredClone(sourceFile);
		parentDir.children[fileName].path = destination;
	}

	return `Copied ${source} to ${destination}`;
}

/**
 * Move a file
 * Should allow the destination to be a directory or a file
 * @param {string} source - The path of the file to move
 * @param {string} destination - The path to move the file to
 * @returns {string} - String indicating whether the file was moved successfully
 * @throws {string} - Error message if the source file does not exist
 * @throws {string} - Error message if the source file is not a file
 * @throws {string} - Error message if the destination file already exists
 */
function mv(source, destination) {
	cp(source, destination);
	rm(source);
	return `Moved ${source} to ${destination}`;
}

/**
 * Create a new file
 * @param {string} path - The path of the file to create
 * @returns {string} - String indicating whether the file was created successfully
 */
function touch(path) {
	const fileName = path.split('/').slice(-1)[0];
	const parentDirPath = path.split('/').slice(0, -1).join('/') || pwd();
	const parentDir = getFileFromPath(parentDirPath);
	parentDir.children[fileName] = {
		type: 'file',
		path: path,
		children: ''
	};
	return `Created file ${path}`;
}

/**
 * Create a new directory
 * @param {string} path - The path of the directory to create
 * @returns {string} - String indicating whether the directory was created successfully
 */
function mkdir(path) {
	const dirName = path.split('/').slice(-1)[0];
	const parentDirPath = path.split('/').slice(0, -1).join('/') || pwd();
	const parentDir = getFileFromPath(parentDirPath);
	parentDir.children[dirName] = {
		type: 'directory',
		path: path,
		children: {}
	};
	return `Created directory ${path}`;
}

/**
 * Remove a directory
 * @param {string} path - The path of the directory to remove
 * @returns {string} - String indicating whether the directory was removed successfully
 */
function rmdir(path) {
	const targetDirectory = getFileFromPath(path);
	const parentDirPath = path.split('/').slice(0, -1).join('/') || pwd();
	const parentDir = getFileFromPath(parentDirPath);
	const dirName = path.split('/').slice(-1)[0];

	if (!targetDirectory) {
		return `Directory not found: ${path}`;
	}

	if (targetDirectory.type !== 'directory') {
		return `${path} is not a directory`;
	}

	delete parentDir.children[dirName];

	return `Removed directory ${path}`;
}

/**
 * Return the current user
 * @returns {string} - The current user
 */
function whoami() {
	const userData = get(user);
	const server = userData.currentServer;
	return userData.currentUser?.[server.ip]?.username || 'Guest';
}

export { commands, help, runCommand, getAllServers };
