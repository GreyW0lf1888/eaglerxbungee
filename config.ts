import { Config } from "./types.js";
const { config: userConfig } = (await import(new URL("../config.js", import.meta.url).href)) as { config: Config };

export const config: Config = {
    name: userConfig.name ?? "BasedProxy",
    bindHost: userConfig.bindHost ?? "0.0.0.0",
    bindPort: parseInt(process.env.BIND_PORT || String(userConfig.bindPort || 80)),
    maxPlayers: userConfig.maxPlayers ?? 20,
    motd: {
        iconURL: userConfig.motd?.iconURL ?? null,
        l1: userConfig.motd?.l1 ?? "hi",
        l2: userConfig.motd?.l2 ?? "lol"
    },
    server: {
        host: process.env.SERVER_HOST || userConfig.server?.host || "localhost",
        port: parseInt(process.env.SERVER_PORT || String(userConfig.server?.port || 25565))
    },
    security: {
        enabled: process.env.ENABLE_TLS === "true" ? true : (userConfig.security?.enabled ?? false),
        key: process.env.TLS_KEY || userConfig.security?.key || null,
        cert: process.env.TLS_CERT || userConfig.security?.cert || null
    }
}

export const BRANDING: Readonly<string> = Object.freeze("EaglerXProxy")
export const VERSION: Readonly<string> = "1.0.0"
export const NETWORK_VERSION: Readonly<string> = Object.freeze(BRANDING + "/" + VERSION)