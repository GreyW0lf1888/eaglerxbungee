import { readFileSync } from "fs";
import * as http from "http"
import * as https from "https"
import { WebSocketServer } from "ws";
import { BRANDING, config, NETWORK_VERSION, VERSION } from "./config.js";
import { handlePacket } from "./listener.js";
import { Logger } from "./logger.js";
import { disconnect, generateMOTDImage } from "./utils.js";
import { ChatColor, ProxiedPlayer, State } from "./types.js";
import { genUUID } from "./utils.js";

const logger = new Logger("EagXProxy")
const connectionLogger = new Logger("ConnectionHandler")

global.PROXY = {
    brand: BRANDING,
    version: VERSION,
    MOTDVersion: NETWORK_VERSION,

    serverName: config.name,
    secure: false,
    proxyUUID: genUUID(config.name),
    MOTD: {
        icon: config.motd.iconURL ? await generateMOTDImage(readFileSync(config.motd.iconURL)) : undefined,
        motd: [config.motd.l1, config.motd.l2]
    },

    wsServer: null as unknown as WebSocketServer,
    players: new Map(),
    logger: logger,
    config: config
}

let server: WebSocketServer
let httpServer: http.Server | https.Server

const requestHandler = (req: http.IncomingMessage, res: http.ServerResponse) => {
    const url = req.url || "/"
    if (url === "/" || url === "/index.html") {
        const html = readFileSync(new URL("../index.html", import.meta.url), "utf8")
        res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" })
        return res.end(html)
    }

    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" })
    res.end("Not found")
}

if (PROXY.config.security.enabled) {
    logger.info(`Starting SECURE WebSocket proxy on port ${config.bindPort}...`)
    if (process.env.REPL_SLUG) {
        logger.warn("You appear to be running the proxy on Repl.it with encryption enabled. Please note that Repl.it by default provides encryption, and enabling encryption may or may not prevent you from connecting to the server.")
    }
    httpServer = https.createServer({
        key: readFileSync(config.security.key!),
        cert: readFileSync(config.security.cert!)
    }, requestHandler).listen(config.bindPort, config.bindHost)
    server = new WebSocketServer({ server: httpServer })
} else {
    logger.info(`Starting INSECURE WebSocket proxy on port ${config.bindPort}...`)
    httpServer = http.createServer(requestHandler).listen(config.bindPort, config.bindHost)
    server = new WebSocketServer({ server: httpServer })
}

PROXY.wsServer = server

server.addListener('connection', (c, req) => {
    connectionLogger.debug(`[CONNECTION] New inbound WebSocket connection from [/${(c as any)._socket.remoteAddress}:${(c as any)._socket.remotePort}]. (${(c as any)._socket.remotePort} -> ${config.bindPort})`)
    const url = new URL(req.url!, `http://${req.headers.host}`)
    const serverParam = url.searchParams.get('server')
    const portParam = url.searchParams.get('port')
    const plr = new ProxiedPlayer()
    plr.ws = c
    plr.ip = (c as any)._socket.remoteAddress
    plr.remotePort = (c as any)._socket.remotePort
    plr.state = State.PRE_HANDSHAKE
    plr.queuedEaglerSkinPackets = []
    plr.serverHost = serverParam || config.server.host
    const parsedPort = portParam ? parseInt(portParam) : config.server.port
    if (isNaN(parsedPort) || parsedPort < 1 || parsedPort > 65535) {
        connectionLogger.warn(`Invalid port parameter: ${portParam}, using default ${config.server.port}`)
        plr.serverPort = config.server.port
    } else {
        plr.serverPort = parsedPort
    }
    c.on('message', msg => {
        handlePacket(msg as Buffer, plr)
    })
})

server.on('listening', () => {
    logger.info(`Successfully started${config.security.enabled ? " [secure]" : ""} WebSocket proxy on port ${config.bindPort}!`)
})

process.on('uncaughtException', err => {
    logger.error(`An uncaught exception was caught! Exception: ${err.stack ?? err}`)
})
process.on('unhandledRejection', err => {
    logger.error(`An unhandled promise rejection was caught! Rejection: ${(err != null ? (err as any).stack : err) ?? err}`)
})
process.on('SIGTERM', () => {
    logger.info("Cleaning up before exiting...")
    for (const [username, plr] of PROXY.players) {
        if (plr.remoteConnection != null) plr.remoteConnection.end()
        disconnect(plr, ChatColor.YELLOW + "Proxy is shutting down.")
    }
    process.exit(0)
})
process.on('SIGINT', () => {
    logger.info("Cleaning up before exiting...")
    for (const [username, plr] of PROXY.players) {
        if (plr.remoteConnection != null) plr.remoteConnection.end()
        disconnect(plr, ChatColor.YELLOW + "Proxy is shutting down.")
    }
    process.exit(0)
})