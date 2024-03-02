// Contains the logic for the user

const user = {
    currentServer: null,
    currentServerPath: '/',
    connectedToServer: false,
    loggedIn: false,
    username: null,
    password: null,
    homeComputer: null,
    connectedToHomeComputer: false,
    homeComputerPath: '/',
    knownCompromisedCredentials: {},
    knownServers: [],
}

export default user;