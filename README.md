# EaglercraftX (1.8.9) WebSocket Proxy
### Demo: `wss://eaglercraft-18.worldeditaxe.repl.co/server` ([EaglerX 1.8.9 client](https://web.arch.lol/mc/1.8.8/) only)
![Two EaglerX clients connected to the same server](./assets/demo.png)
## What is this?
A WebSocket proxy that allows EaglercraftX 1.8 clients to connect to an offline vanilla Minecraft server with (mostly working) Eaglercraft skin support. This is meant to be a replacement for the unreleased official EaglercraftX bungee until it releases. It supports all 1.8.9 servers, even offline server networks!
## Issues
* Occasional vague "End of Stream" error when disconnected
* Custom skins (excluding custom Eaglercraft skins) do not render correctly
## Setup Guide
### Prerequisites
* Node.js v12 and up
* TypeScript installed (`npm i -g typescript`, may require `sudo` or administrator permissions)
* An **OFFLINE** 1.8.9-compatible Minecraft server or proxy
### Setup Guide
#### If Repl.it is acceptable, fork the [demo](https://replit.com/@WorldEditAxe/eaglerx-server) and connect to it. All proxy files will be under the `proxy` folder.
1. Download and extract this repository to a folder on your computer.
2. Open a terminal and go to the folder of the repository. Run `npm i`, followed by `tsc`.
3. Run the server (`npm run start`).
4. Connect to your server. For the server address, use the following format: `ws://<IP>:<port>`. If you are using encryption, replace `ws://` with `wss://`.

### Config file
Edit `config.js` to configure the proxy, including the `server.host` and `server.port` values for the remote Minecraft server.
