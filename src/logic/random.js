import { businessFirstName, businessLastName, personFirstName, personLastName } from './const.js';

/**
 * Generate a random string
 * @param {Number} length
 * @param {string} chars='0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
 * @returns {string} - A random string of length `length` with characters from `chars`
 */
function randomString(
	length=10,
	chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
) {
	let result = '';
	for (let i = length; i > 0; --i) {
		result += chars[Math.floor(Math.random() * chars.length)];
	}
	return result;
}

/**
 * Generate a random number
 * @param {Number} min
 * @param {Number} max
 * @returns {Number} - A random number between `min` and `max`
 */
function randomNumber(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Generate a random IP address
 *
 * @returns {string} - A random IP address
 */
function randomIPAddress() {
	return `${randomNumber(1, 255)}.${randomNumber(0, 255)}.${randomNumber(0, 255)}.${randomNumber(0, 255)}`;
}

/**
 * Generate a random business name
 * Should sound like a real business
 * @returns {string} - A random business name
 */
function randomBusinessName() {
	const acronym = randomString(randomNumber(0, 4), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ');

	const businessType = randomNumber(0, 3);

	if (businessType === 0) {
		return `${businessFirstName[randomNumber(0, businessFirstName.length - 1)]} ${businessLastName[randomNumber(0, businessLastName.length - 1)]}`;
	} else if (businessType === 1) {
		return `${businessFirstName[randomNumber(0, businessFirstName.length - 1)]} ${businessLastName[randomNumber(0, businessLastName.length - 1)]} ${businessLastName[randomNumber(0, businessLastName.length - 1)]}`;
	} else if (businessType === 2) {
		return `${acronym} ${businessLastName[randomNumber(0, businessLastName.length - 1)]}`;
	} else if (businessType === 3) {
		return `${acronym} ${businessFirstName[randomNumber(0, businessFirstName.length - 1)]}`;
	}
	return acronym;
}

/**
 * Generate a random persons name
 * Should sound like a real name
 * @returns {string} - A random name
 */
function randomPersonName() {
	const shouldHaveMiddleInitial = randomNumber(0, 1);
	const middleInitial = shouldHaveMiddleInitial
		? randomString(1, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ')
		: '';

	return `${personFirstName[randomNumber(0, personFirstName.length - 1)]} ${middleInitial} ${personLastName[randomNumber(0, personLastName.length - 1)]}`;
}

/**
 * Get Firstname MiddleInitial and LastName from a full name
 * @param {string} fullName
 * @returns {Object} - An object with first, middle, and last properties
 */
function splitFullName(fullName) {
	const parts = fullName.split(' ');
	const first = parts[0];
	const last = parts[parts.length - 1];
	const middle = parts.length === 3 ? parts[1] : '';
	return { first, middle, last };
}

/**
 * Generate a random email address
 * optional name, optional domain
 * @param {string} name - The name of the email address
 * @param {string} domain - The domain of the email address
 * @returns {string} - A random email address
 */
function randomEmail(name = '', domain = '') {
	const emailName = name || randomString(randomNumber(5, 10));
	const emailDomain = domain || randomString(randomNumber(5, 10));
	return `${emailName}@${emailDomain}.com`;
}

/**
 * Generate Random File Name
 * @param {string} extension
 * @returns {string} - A random file name
 */
function randomFileName(extension = 'txt') {
	// Either a random string or a random persons name, or a random business name
	const chance = randomNumber(1, 100);
	let filename = '';

	if (chance <= 25) {
		filename = `${splitFullName(randomBusinessName()).first}`;
	} else if (chance <= 50) {
		filename = `${splitFullName(randomBusinessName()).last}`;
	} else if (chance <= 75) {
		filename = `${splitFullName(randomPersonName()).first}`;
	} else if (chance <= 90) {
		filename = `${splitFullName(randomPersonName()).last}`;
	} else {
		filename = `${randomString(randomNumber(5, 10))}`;
	}

	if (randomNumber(1, 100) <= 50) {
		filename = mystifyString(filename);
	}

	return `${filename}.${extension}`;
}

/**
 * Given a string, return a mystified version of it
 * - Sometimes Trim off certain characters
 * - Sometimes Replace characters with similar looking characters
 * - Sometimes add extra characters or numbers
 */
function mystifyString(str) {
	let mystifiedString = str;
	if (randomNumber(1, 100) <= 25) {
		// Remove vowels
		mystifiedString = mystifiedString.replace(/[aeiou]/g, '');
	}
	if (randomNumber(1, 100) <= 50) {
		// Replace characters with similar looking characters
		mystifiedString = mystifiedString.replace(/[aA]/g, '4');
		mystifiedString = mystifiedString.replace(/[eE]/g, '3');
		mystifiedString = mystifiedString.replace(/[iI]/g, '1');
		mystifiedString = mystifiedString.replace(/[oO]/g, '0');
		mystifiedString = mystifiedString.replace(/[sS]/g, '5');
		mystifiedString = mystifiedString.replace(/[tT]/g, '7');
	}
	if (randomNumber(1, 100) <= 75) {
		// Add extra characters or numbers to the start or end
		const extraLetters = randomString(randomNumber(1, 5), 'abcdefghijklmnopqrstuvwxyz');
		const extraNumbers = randomString(randomNumber(1, 5), '0123456789');
		const extraCharacters = randomNumber(1, 2) === 1 ? extraLetters : extraNumbers;
		const extraStart = randomNumber(1, 2) === 1 ? extraCharacters : '';
		const extraEnd = randomNumber(1, 2) === 1 ? extraCharacters : '';
		mystifiedString = `${extraStart}${mystifiedString}${extraEnd}`;
	}
	return mystifiedString;
}

/**
 * Generate Random fileSystem
 * @param {string} [username]
 * @param {string} [password]
 * @param {string} [ip]
 * @param {string} [businessName]
 * @param {string} [personName]
 * @returns {Object} - A random fileSystem
 */
function randomFileSystem(username = 'admin', password, ip, businessName, personName) {
	// Directory Structure should always contain a root directory, a logs directory, a bin directory, and a home directory
	// The home directory should contain a directory with the username, and a directory with the business name
	// The home directory should be messy with random files

	const fileSystem = {
		'/': {
			type: 'directory',
			path: '/',
			children: {
				logs: {
					type: 'directory',
					path: '/logs',
					children: {}
				},
				bin: {
					type: 'directory',
					path: '/bin',
					children: {
						'test.sh': {
							type: 'file',
							path: '/bin/test.sh',
							children: 'echo "Hello World"'
						}
					}
				},
				home: {
					type: 'directory',
					path: '/home',
					children: {}
				}
			}
		}
	};

	// Add a directory for the username or business name or person name
	const homeDirectory = fileSystem['/'].children.home.children;
	if (username && randomNumber(1, 100) <= 25) {
		homeDirectory[username] = {
			type: 'directory',
			path: `/home/${username}`,
			children: {}
		};
	}
	if (businessName && randomNumber(1, 100) <= 25) {
		homeDirectory[businessName] = {
			type: 'directory',
			path: `/home/${businessName}`,
			children: {}
		};
	}
	if (personName && randomNumber(1, 100) <= 25) {
		homeDirectory[personName] = {
			type: 'directory',
			path: `/home/${personName}`,
			children: {}
		};
	}

	// Add a bunch of random files to the home directory and all subdirectories
	const allHomeDirectories = Object.keys(homeDirectory);
	for (const dir of allHomeDirectories) {
		const currentDir = homeDirectory[dir];
		for (let i = 0; i < randomNumber(0, 5); i++) {
			const rubbishDataFileName = randomFileName();
			currentDir.children[rubbishDataFileName] = {
				type: 'file',
				path: `${currentDir.path}/${rubbishDataFileName}`,
				children: randomString(randomNumber(100, 500))
			};

			// Sometimes add a file with the username and password
			if (randomNumber(1, 100) <= 25) {
				const credentialFileName = randomFileName();
				currentDir.children[credentialFileName] = {
					type: 'file',
					path: `${currentDir.path}/${credentialFileName}`,
					children: `username: ${username} password: ${password}`
				};
			}
		}
	}

	return fileSystem;
}

function randomDeviceType() {
	const allDeviceTypes = ['server', 'desktop', 'laptop', 'phone', 'tablet'];
	return allDeviceTypes[randomNumber(0, allDeviceTypes.length - 1)];
}

/**
 * Return a random choice from an array
 * @param {Array} choices - An array of options to choose from
 * @returns {any} - A random choice from the array
 */
function randomChoice(choices = ['a', 'b', 'c']) {
	return choices[Math.floor(Math.random() * choices.length)];
}

/**
 * Generate a random date between start and end
 * @param {Date} start - The start date
 * @param {Date} end - The end date
 * @returns {Date} - A random date between `start` and `end`
 */
function randomDate(start = new Date(1970, 0, 1), end = new Date()) {
	// If start and end are strings attempt to parse them as dates
	if (typeof start === 'string') start = new Date(start);
	if (typeof end === 'string') end = new Date(end);

	return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

export {
	randomString,
	randomNumber,
	randomIPAddress,
	randomBusinessName,
	randomPersonName,
	splitFullName,
	randomEmail,
	randomFileName,
	mystifyString,
	randomFileSystem,
	randomDeviceType
};
