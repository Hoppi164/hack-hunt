import {
	randomIPAddress,
	randomNumber,
	randomPersonName,
	randomString,
	splitFullName,
	randomBusinessName,
	mystifyString,
	randomFileSystem,
	randomDeviceType
} from './random';
const allServers = {};

/**
 * Generate a new IP address that is not already in use
 * @returns {string} - A new IP address
 */
function getNewIP() {
	let ip = randomIPAddress();
	while (allServers[ip]) {
		ip = randomIPAddress();
	}
	return ip;
}

/**
 * Initialize the servers with a given number of servers
 * This should be called when the game starts
 * @param {Number} numServers - The number of servers to initialize
 * @returns {Object} - The allServers object
 */
function initServers(numServers = 100) {
	for (let i = 0; i < numServers; i++) {
		let ip = getNewIP();

		// Random chance of either being admin, a persons firstname, or a persons lastname
		// With a strong weight to being admin
		let username = 'admin';
		const chance1 = randomNumber(1, 100);
		if (chance1 <= 70) {
			username = 'admin';
		} else if (chance1 <= 90) {
			username = splitFullName(randomPersonName()).first;
		} else {
			username = splitFullName(randomPersonName()).last;
		}

		// Password should either be a random string, or a persons first/last name or portion of a random business name
		let password = randomString(10);
		const chance2 = randomNumber(1, 100);
		if (chance2 <= 50) {
			password = randomString(10);
		} else if (chance2 <= 60) {
			password = splitFullName(randomPersonName()).first;
		} else if (chance2 <= 70) {
			password = splitFullName(randomPersonName()).last;
		} else {
			password = randomBusinessName().split(' ')[0];
		}

		password = password || randomString(10);

		// Sometimes mystify the password
		if (randomNumber(1, 100) <= 50) {
			password = mystifyString(password);
		}

		// Generate a random business name for the server, it could also be a personal computer
		const serverType = randomNumber(1, 100) <= 25 ? 'business' : 'personal';
		const businessName = serverType === 'business' ? randomBusinessName() : '';
		const personName = serverType === 'personal' ? randomPersonName() : '';
		let serverName = serverType === 'business' ? businessName : personName;
		serverName = `${serverName}'s ${randomDeviceType()}`;

		// Generate a random file system for the server
		const fileSystem = randomFileSystem(username, password, ip, businessName, personName);

		allServers[ip] = {
			ip,
			name: serverName,
			users: [{ username, password }],
			securityLevel: randomNumber(1, 100),
			network: [],
			status: 'off',
			fileSystem
		};
	}
	return allServers;
}

export { initServers, getNewIP };
