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
#### Normally, use Github Codespaces, but repl.it is also acceptable.
1. Get a github account
2. Fork this repo and open codespaces for it
3. Open a terminal and run the codespace and forward it to port 8080
4. Openn the link of the forwarded port, and enter your server IP and port, then press the forward to eaglercraft button.
5. Connect to your server.

### Config file
*Irrelevant*
