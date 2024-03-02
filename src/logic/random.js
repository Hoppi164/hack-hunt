/**
 * Generate a random string
 * @param {Number} length
 * @param {string} chars='0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
 * @returns {string} - A random string of length `length` with characters from `chars`
 */
function randomString(
	length,
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

export { randomString, randomNumber, randomIPAddress };