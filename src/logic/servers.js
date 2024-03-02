import { randomIPAddress } from './random'; 
const allServers = {};

/**
 * Generate a new IP address that is not already in use
 * @returns {string} - A new IP address
 */
function getNewIP(){
    let ip = randomIPAddress();
    while (allServers[ip]){
        ip = randomIPAddress();
    }
    return ip;
}

/**
 * Initialize the servers with a given number of servers
 * This should be called when the game starts
 * @param {Number} numServers - The number of servers to initialize
 * @returns {void} - No return value
 */
function initServers(numServers=100){
    for (let i = 0; i < numServers; i++){
        let ip = getNewIP();
        allServers[ip] = {
            ip,
            status: 'off',
        };
        
    }
}




export { allServers, initServers, getNewIP };