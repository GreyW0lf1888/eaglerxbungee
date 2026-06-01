# EaglercraftX (1.8.9) WebSocket Proxy

A WebSocket proxy that allows EaglercraftX 1.8 clients to connect to offline Minecraft servers with Eaglercraft skin support. This is a replacement for the official EaglercraftX bungee and supports all 1.8.9 servers, even offline server networks!

### ✨ Features

- ✅ **Multi-Platform Deployment**: GitHub Codespaces, Docker, Netlify, Railway, Render, and more
- ✅ **Persistent Proxy IP**: The proxy UUID remains consistent across restarts
- ✅ **Continuous Operation**: Proxy continuously runs and accepts player connections
- ✅ **Skin Support**: Full Eaglercraft skin support for connected players
- ✅ **Environment Configuration**: Fully configurable via environment variables
- ✅ **Private & Public Proxies**: Run separate instances for different use cases
- ✅ **Load Balancing Ready**: Nginx example configuration included

### 🎮 Demo

Try it: `wss://eaglercraft-18.worldeditaxe.repl.co/server` ([EaglerX 1.8.9 client](https://web.arch.lol/mc/1.8.8/) only)

## Prerequisites

- Node.js v12 and up
- An **OFFLINE** 1.8.9-compatible Minecraft server or proxy
- For deployment: Docker, Railway, Render, or Netlify account (optional)

## Quick Start

### 1. GitHub Codespaces (Recommended for Testing)

```bash
# Clone the repository
git clone https://github.com/idrkwhotbh/eaglerxbungee
cd eaglerxbungee

# Install dependencies
npm install

# Run the proxy
npm start
```

The proxy starts on port 8080. In Codespaces, forward port 8080 and open the link, then:
1. Enter your Minecraft server IP and port
2. Click "Forward to Eaglercraft"
3. Connect from an EaglercraftX 1.8.9 client

### 2. Docker (Recommended for Production)

```bash
# Build the image
docker build -t eagler-proxy .

# Run with environment variables
docker run -d \
  -p 8080:8080 \
  -e SERVER_HOST="your-server.com" \
  -e SERVER_PORT="25565" \
  -e ENABLE_PERSISTENT_IP="true" \
  -v proxy-data:/app/.proxy-data \
  --name eagler-proxy \
  eagler-proxy:latest
```

Or using Docker Compose:

```bash
# Copy and edit environment variables
cp .env.example .env
nano .env

# Start services
docker-compose -f docker-compose.example.yml up -d
```

### 3. Local Development

```bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Build TypeScript
npm run build

# Start the proxy
npm start
```

### 4. Netlify Deployment

1. Push your repository to GitHub
2. Connect to Netlify (https://app.netlify.com)
3. Set these environment variables:
   - `SERVER_HOST`: Your Minecraft server
   - `SERVER_PORT`: Your Minecraft server port (usually 25565)
   - `ENABLE_PERSISTENT_IP`: true
4. Deploy!

For more details, see [DEPLOYMENT.md](./DEPLOYMENT.md)

## Configuration

Create a `.env` file (copy from `.env.example`):

```bash
# Minecraft Server
SERVER_HOST=127.0.0.1
SERVER_PORT=25565

# Proxy Server
BIND_PORT=8080
BIND_HOST=0.0.0.0

# Persistence
ENABLE_PERSISTENT_IP=true
PROXY_PERSISTENCE_DIR=./.proxy-data

# Security (optional)
ENABLE_TLS=false
TLS_KEY=./certs/server.key
TLS_CERT=./certs/server.crt
```

Or edit `config.js` directly:

```javascript
export const config = {
    name: "My Proxy",
    bindPort: 8080,
    maxPlayers: 20,
    motd: {
        l1: "Welcome!",
        l2: "Enjoy!"
    },
    server: {
        host: "your-server.com",
        port: 25565
    }
}
```

## Persistent IP Explained

The proxy automatically generates and saves a unique UUID on first run. This UUID is stored in `proxy-state.json` and reused on subsequent restarts, ensuring:

- Players can connect to a consistent proxy address
- IP doesn't change after service restarts
- Works across different deployment platforms

**Storage locations:**
- **Local**: `./.proxy-data/proxy-state.json`
- **Docker**: `/app/.proxy-data/proxy-state.json` (volume mount)
- **Netlify**: `/tmp/eagler-proxy/proxy-state.json`

## Deployment Guides

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md):

- [✅ Local Development](./DEPLOYMENT.md#1-local-development)
- [🐳 Docker Deployment](./DEPLOYMENT.md#2-docker-deployment)
- [☁️ Netlify](./DEPLOYMENT.md#3-netlify-deployment)
- [🚂 Railway](./DEPLOYMENT.md#4-railway-deployment)
- [🎨 Render](./DEPLOYMENT.md#5-render-deployment)
- [💻 GitHub Codespaces](./DEPLOYMENT.md#6-github-codespaces-your-original-setup)

## Known Issues

- Occasional "End of Stream" error when disconnected
- Custom skins (non-Eaglercraft) may not render correctly
- Some advanced Minecraft features may not be supported

## Advanced Usage

### Run Both Private and Public Proxies

```bash
npm run start-both
```

### Enable Secure WebSocket (WSS)

Set these environment variables:

```bash
ENABLE_TLS=true
TLS_KEY=/path/to/server.key
TLS_CERT=/path/to/server.crt
```

### Multiple Server Proxying

Players can specify a custom server via URL parameters:

```
ws://your-proxy.com?server=custom-server.com&port=25565
```

### Load Balancing with Nginx

Copy and configure the provided nginx configuration:

```bash
cp nginx.conf.example nginx.conf
# Edit nginx.conf with your settings
```

Then run with Docker Compose:

```bash
docker-compose -f docker-compose.example.yml up -d
```

## System Requirements

**Minimum:**
- 256MB RAM
- 1 CPU core
- 100Mbps internet

**Recommended:**
- 512MB+ RAM
- 2+ CPU cores
- 100Mbps+ internet

**Performance:**
- ~2MB RAM per connected player
- ~1% CPU per 100 players
- ~5Mbps per 50 players

## Troubleshooting

### Proxy UUID changes after restart
- Check `ENABLE_PERSISTENT_IP=true` in environment
- Verify write permissions in `PROXY_PERSISTENCE_DIR`
- Check logs for permission errors

### Cannot connect to Minecraft server
- Verify `SERVER_HOST` and `SERVER_PORT` are correct
- Test connection: `telnet SERVER_HOST SERVER_PORT`
- Ensure server is running and accessible

### Port already in use
```bash
# Find process using port 8080
lsof -i :8080

# Or change the port
export BIND_PORT=9000
npm start
```

### High memory usage
- Reduce `maxPlayers` in config
- Check for memory leaks: `node --inspect build/index.js`
- Consider separate proxy instances

## Development

```bash
# Install dependencies
npm install

# Watch TypeScript files
tsc --watch

# Run tests
npm test

# Build for production
npm run build

# Start production server
npm start
```

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

[See LICENSE file]

## Support

- 📖 [Deployment Guide](./DEPLOYMENT.md)
- 🐛 [GitHub Issues](https://github.com/idrkwhotbh/eaglerxbungee/issues)
- 💬 [Discussions](https://github.com/idrkwhotbh/eaglerxbungee/discussions)

---

**Note**: This project is a community proxy implementation. For the official Eaglercraft client, visit [eaglercraft.com](https://eaglercraft.com)

