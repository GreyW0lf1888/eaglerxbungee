export const config = {
    // The name of the proxy. (used for MOTD and logging)
    name: "BasedProxy",
    // The address to bind the WebSocket server to.
    bindHost: "0.0.0.0",
    // The port to bind the WebSocket proxy to.
    bindPort: 80,
    // The maximum number of connected players allowed.
    maxPlayers: 20,
    motd: {
        // Path to an optional image file for the MOTD icon.
        iconURL: null,
        // The first line of the MOTD.
        l1: "hi",
        // The second line of the MOTD.
        l2: "lol"
    },
    server: {
        // Remote Minecraft server host or IP that the proxy connects to.
        host: "127.0.0.1",
        // Remote Minecraft server port.
        port: 25565
    },
    security: {
        // Set this to true to enable WSS (secure WebSocket)
        enabled: false,
        // Path to your TLS private key file if using secure mode.
        key: null,
        // Path to your TLS certificate file if using secure mode.
        cert: null
    }
};
