import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { randomUUID } from "crypto";
import { Logger } from "./logger.js";

const logger = new Logger("Persistence");

interface ProxyPersistence {
    proxyUUID: string;
    createdAt: string;
    lastUpdated: string;
}

export class PersistenceManager {
    private persistenceDir: string;
    private persistenceFile: string;
    private enabled: boolean;

    constructor(persistenceDir: string = "./.proxy-data", enabled: boolean = true) {
        this.persistenceDir = persistenceDir;
        this.persistenceFile = join(persistenceDir, "proxy-state.json");
        this.enabled = enabled && process.env.ENABLE_PERSISTENT_IP !== "false";

        if (this.enabled) {
            this.ensureDirectoryExists();
        }
    }

    private ensureDirectoryExists(): void {
        try {
            if (!existsSync(this.persistenceDir)) {
                mkdirSync(this.persistenceDir, { recursive: true });
                logger.info(`Created persistence directory: ${this.persistenceDir}`);
            }
        } catch (error) {
            logger.error(`Failed to create persistence directory: ${error}`);
            this.enabled = false;
        }
    }

    public getOrCreateProxyUUID(): string {
        if (!this.enabled) {
            logger.debug("Persistence disabled, generating new UUID");
            return randomUUID();
        }

        try {
            if (existsSync(this.persistenceFile)) {
                const data = readFileSync(this.persistenceFile, "utf8");
                const state: ProxyPersistence = JSON.parse(data);
                logger.info(`Loaded persisted proxy UUID: ${state.proxyUUID}`);
                logger.debug(`Proxy created at: ${state.createdAt}`);
                
                // Update last accessed time
                this.updatePersistence(state.proxyUUID);
                return state.proxyUUID;
            }
        } catch (error) {
            logger.warn(`Failed to load persisted UUID: ${error}`);
        }

        // Create new UUID if no persistence file exists
        const newUUID = randomUUID();
        this.createNewPersistence(newUUID);
        return newUUID;
    }

    private createNewPersistence(proxyUUID: string): void {
        if (!this.enabled) return;

        try {
            const state: ProxyPersistence = {
                proxyUUID,
                createdAt: new Date().toISOString(),
                lastUpdated: new Date().toISOString()
            };
            writeFileSync(this.persistenceFile, JSON.stringify(state, null, 2));
            logger.info(`Created new persistent proxy UUID: ${proxyUUID}`);
        } catch (error) {
            logger.error(`Failed to create persistence file: ${error}`);
        }
    }

    private updatePersistence(proxyUUID: string): void {
        if (!this.enabled) return;

        try {
            const state: ProxyPersistence = {
                proxyUUID,
                createdAt: new Date().toISOString(),
                lastUpdated: new Date().toISOString()
            };
            writeFileSync(this.persistenceFile, JSON.stringify(state, null, 2));
        } catch (error) {
            logger.warn(`Failed to update persistence file: ${error}`);
        }
    }

    public reset(): void {
        if (!this.enabled) return;

        try {
            if (existsSync(this.persistenceFile)) {
                const data = readFileSync(this.persistenceFile, "utf8");
                const state: ProxyPersistence = JSON.parse(data);
                logger.info(`Reset called. Old proxy UUID was: ${state.proxyUUID}`);
            }
        } catch (error) {
            logger.warn(`Failed to read UUID before reset: ${error}`);
        }
    }
}
