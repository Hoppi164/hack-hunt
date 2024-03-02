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

import { allServers, initServers, getNewIP } from './servers';
import user from './user';
/**
 * Connect to a server
 * @param {string} ip - The IP address of the server to connect to
 * @returns {boolean} - Whether the connection was successful
 */

function connect(ip) {
	if (allServers[ip]) {
		user.currentServer = allServers[ip];
		user.currentServerPath = '/';
		user.connectedToServer = true;
		return true;
	}
	return false;
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
