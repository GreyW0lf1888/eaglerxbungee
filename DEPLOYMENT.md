# 🚀 EaglerXProxy Deployment Guide

Complete guide for deploying EaglerXProxy with persistent proxy IP and continuous operation across multiple platforms.

## ⚡ Quick Summary

| Platform | WebSocket | Persistent IP | Cost | Best For |
|----------|-----------|----------------|------|----------|
| **Docker** | ✅ | ✅ | Free | Development & Production |
| **Railway** | ✅ | ✅ | $5-50/mo | Production (Recommended) |
| **Render** | ✅ | ✅ | $7-50/mo | Production (US) |
| **DigitalOcean** | ✅ | ✅ | $12-50/mo | Production (Enterprise) |
| **GitHub Codespaces** | ✅ | ⚠️ Limited | Free/$4/mo | Testing & Development |
| **Netlify/Vercel** | ❌ No | ❌ | Free | Static Frontend Only |

> **Important**: Netlify Functions cannot run long-lived WebSocket servers. Use Docker on other platforms if you want to deploy through Netlify's infrastructure.

---

## 🎯 Key Features

✅ **Persistent Proxy UUID**: Maintains same UUID across restarts  
✅ **Continuous Operation**: Accepts connections 24/7  
✅ **Multi-Platform**: Works on 5+ cloud platforms  
✅ **Easy Configuration**: Environment variables for all settings  
✅ **Skin Support**: Full Eaglercraft skin proxying included  

---

## 📋 Environment Setup

### Basic Configuration

```bash
# 1. Copy the environment template
cp .env.example .env

# 2. Edit with your Minecraft server details
nano .env

# 3. Set these required variables:
SERVER_HOST=your-minecraft-server.com  # Your Minecraft server IP/domain
SERVER_PORT=25565                      # Minecraft server port
ENABLE_PERSISTENT_IP=true              # Keep UUID persistent
```

See `.env.example` for all available options and platform-specific paths.

---

## 🐳 Docker Deployment (Recommended)

### Prerequisites
- Docker installed ([install guide](https://docs.docker.com/get-docker/))
- Minecraft server accessible from proxy

### Quick Start with Docker Compose

```bash
# 1. Clone repository
git clone https://github.com/idrkwhotbh/eaglerxbungee
cd eaglerxbungee

# 2. Setup environment
cp .env.example .env
nano .env  # Edit SERVER_HOST and SERVER_PORT

# 3. Run with Docker Compose
docker-compose up -d

# 4. Check status
docker-compose logs -f
docker-compose ps

# 5. Access proxy
# WebSocket URL: ws://localhost:8080/server
```

### Docker Compose with Multiple Instances

For production with load balancing, use `docker-compose.example.yml`:

```bash
# Copy the advanced configuration
cp docker-compose.example.yml docker-compose.prod.yml
nano docker-compose.prod.yml

# Run production setup
docker-compose -f docker-compose.prod.yml up -d

# Optional: Add Nginx reverse proxy for TLS
# See docker-compose.example.yml for nginx configuration
```

### Manual Docker Commands

```bash
# Build image
docker build -t eagler-proxy:latest .

# Run container
docker run -d \
  --name eagler-proxy \
  -p 8080:8080 \
  -e SERVER_HOST="mc.example.com" \
  -e SERVER_PORT="25565" \
  -e ENABLE_PERSISTENT_IP="true" \
  -v proxy-data:/app/.proxy-data \
  eagler-proxy:latest

# View logs
docker logs -f eagler-proxy

# Check volume (persistent data)
docker volume inspect proxy-data

# Stop and remove
docker-compose down
docker volume rm proxy-data  # ⚠️ This deletes persistent data!
```

### Persistent Storage

The proxy stores its UUID in `/app/.proxy-data/proxy-state.json`. To ensure it persists:

```bash
# Check what's stored
docker-compose exec eagler-proxy cat /app/.proxy-data/proxy-state.json

# Backup your proxy state
docker cp eagler-proxy:/app/.proxy-data ./backup-proxy-data

# Restore from backup
docker cp ./backup-proxy-data eagler-proxy:/app/.proxy-data
```

---

## 🚂 Railway Deployment

Railway is the easiest platform for hosting Node.js WebSocket applications.

### Step 1: Prepare GitHub Repository

```bash
# Ensure your repo is on GitHub
git remote -v
# Should show: origin https://github.com/YOUR_USERNAME/eaglerxbungee

# Push latest changes
git push origin master
```

### Step 2: Create Railway Project

1. Go to [railway.app](https://railway.app)
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Choose your `eaglerxbungee` repository
5. Click **"Deploy"**

### Step 3: Configure Environment Variables

In Railway Dashboard:
- **Settings** → **Variables**
- Add these variables:

```
SERVER_HOST=your-minecraft-server.com
SERVER_PORT=25565
BIND_PORT=8080
ENABLE_PERSISTENT_IP=true
PROXY_PERSISTENCE_DIR=/app/.proxy-data
```

### Step 4: Enable Persistent Storage

In Railway Dashboard:
- **Settings** → **Data Storage**
- Create volume:
  - **Mount Path**: `/app/.proxy-data`
  - **Size**: 1GB minimum

### Step 5: Deploy & Test

1. Click **"Deploy"**
2. Wait for deployment to complete
3. Copy the public URL from **Deployments**
4. Test WebSocket connection:

```bash
# Get your Railway URL (example: railway-abc123.railway.app)
# Connect from EaglerX 1.8.9 client using:
wss://railway-abc123.railway.app/server

# Or test with curl
curl https://railway-abc123.railway.app/
```

### Advantages
✅ Automatic HTTPS/WSS with free certificates  
✅ Persistent volumes included  
✅ Generous free tier ($5/month)  
✅ Easy scaling for more players  

---

## ⚡ Render Deployment

Render provides excellent uptime and performance.

### Step 1: Create render.yaml

Add this file to your repository root:

```yaml
services:
  - type: web
    name: eagler-proxy
    env: node
    buildCommand: npm run build
    startCommand: npm start
    envVars:
      - key: SERVER_HOST
        value: your-minecraft-server.com
      - key: SERVER_PORT
        value: "25565"
      - key: ENABLE_PERSISTENT_IP
        value: "true"
      - key: PROXY_PERSISTENCE_DIR
        value: /var/data/.proxy-data
    disk:
      name: proxy-data
      mountPath: /var/data
      sizeGB: 1
```

### Step 2: Deploy on Render

1. Go to [render.com](https://render.com)
2. Click **"New"** → **"Web Service"**
3. Connect your GitHub repository
4. Select **"Use existing config"** (finds render.yaml)
5. Click **"Create Web Service"**

### Step 3: Configure & Monitor

- Environment variables auto-load from `render.yaml`
- Persistent disk automatically mounted
- Logs available in Render dashboard
- Auto-deploy on git push (optional)

### Test Connection

```
wss://your-service-name.onrender.com/server
```

### Advantages
✅ Fast deployment times  
✅ Reliable persistent storage  
✅ Good global performance  
✅ Affordable pricing  

---

## 💧 DigitalOcean App Platform

For enterprise deployments with global reach.

### Step 1: Deploy

1. Go to [DigitalOcean Dashboard](https://cloud.digitalocean.com)
2. Click **"Create"** → **"Apps"**
3. Connect GitHub and select `eaglerxbungee`
4. Click **"Next"**

### Step 2: Configure Build & Run

- **Build Command**: `npm run build`
- **Run Command**: `npm start`
- **HTTP Port**: `8080`

### Step 3: Set Environment Variables

Click **"Edit" → "Environment"**:

```
SERVER_HOST=your-minecraft-server.com
SERVER_PORT=25565
ENABLE_PERSISTENT_IP=true
PROXY_PERSISTENCE_DIR=/var/data/.proxy-data
```

### Step 4: Add Persistent Volume

1. Click **"Resources"** → **"Add"** → **"Volume"**
2. **Mount Path**: `/var/data/.proxy-data`
3. **Size**: 1GB

### Step 5: Deploy

Click **"Create Resources"** and wait for deployment.

### Test

```
wss://your-app-slug.ondigitalocean.app/server
```

### Advantages
✅ Global deployment regions  
✅ Enterprise-grade infrastructure  
✅ Excellent documentation  
✅ Professional support available  

---

## 💻 GitHub Codespaces (Testing)

Perfect for quick testing without setup.

```bash
# Open Codespace from GitHub
# Or create with: github.com/codespaces/new

# Clone repo
git clone https://github.com/idrkwhotbh/eaglerxbungee
cd eaglerxbungee

# Install & run
npm install
npm start

# Forward port 8080
# (Codespaces automatically handles this)

# Access: https://your-codespace-url-8080.github.dev/
```

### ⚠️ Limitations
- Proxy UUID resets when Codespace is recreated
- Only for testing/development
- Limited persistence

### Best For
- Testing features locally in cloud
- Team collaboration
- Quick prototyping

---

## 📦 Traditional VPS/Droplet Deployment

For maximum control with DigitalOcean, Linode, Hetzner, etc.

```bash
# SSH into your server
ssh root@your-server-ip

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Clone repository
git clone https://github.com/idrkwhotbh/eaglerxbungee
cd eaglerxbungee

# Setup
cp .env.example .env
nano .env  # Configure SERVER_HOST and SERVER_PORT

# Install PM2 for auto-restart
sudo npm install -g pm2

# Run with PM2
pm2 start npm --name eagler-proxy -- start
pm2 save
pm2 startup

# View logs
pm2 logs eagler-proxy

# Or use Docker (recommended)
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
docker-compose up -d
```

---

## 🌐 Nginx Reverse Proxy Setup

For TLS termination and load balancing:

```nginx
upstream eagler_proxies {
    server proxy1.internal:8080;
    server proxy2.internal:8080;
    server proxy3.internal:8080;
}

server {
    listen 80;
    server_name eagler.example.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name eagler.example.com;

    ssl_certificate /etc/letsencrypt/live/eagler.example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/eagler.example.com/privkey.pem;

    location / {
        proxy_pass http://eagler_proxies;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

---

## 🔒 TLS/SSL Configuration

### Self-Signed Certificate (Development)

```bash
openssl req -x509 -newkey rsa:4096 -keyout server.key -out server.crt -days 365 -nodes
```

### Let's Encrypt (Production)

```bash
# Using Certbot
sudo apt install certbot
sudo certbot certonly --standalone -d eagler.example.com

# Use in .env
ENABLE_TLS=true
TLS_KEY=/etc/letsencrypt/live/eagler.example.com/privkey.pem
TLS_CERT=/etc/letsencrypt/live/eagler.example.com/fullchain.pem
```

---

## 🧪 Testing & Troubleshooting

### Test Health Endpoint

```bash
# HTTP test
curl http://localhost:8080/

# HTTPS test
curl https://localhost:8080/ --insecure

# WebSocket test
# Use wscat or similar tool
npx wscat -c ws://localhost:8080/server
```

### Check Proxy UUID Persistence

```bash
# Docker
docker exec eagler-proxy cat /app/.proxy-data/proxy-state.json

# Direct
cat .proxy-data/proxy-state.json

# Expected output:
# {
#   "proxyUUID": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
#   "createdAt": "2024-06-01T12:00:00.000Z",
#   "lastUpdated": "2024-06-01T12:00:00.000Z"
# }
```

### Common Issues

**Problem: Proxy UUID changes on restart**
- Solution: Ensure `ENABLE_PERSISTENT_IP=true`
- Check volume is mounted at `PROXY_PERSISTENCE_DIR`
- Verify directory has write permissions

**Problem: Can't connect to Minecraft server**
- Solution: Verify `SERVER_HOST` and `SERVER_PORT`
- Test: `nc -zv $SERVER_HOST $SERVER_PORT`
- Check firewall allows connection

**Problem: WebSocket connection refused**
- Solution: Verify proxy is running and listening
- Check port mapping: `netstat -tuln | grep 8080`
- Check CORS headers if needed

**Problem: High memory usage**
- Solution: Check number of connections
- Monitor with: `docker stats`
- Consider increasing container memory limit

---

## 📊 Monitoring & Maintenance

### Basic Monitoring

```bash
# Check if running
curl http://localhost:8080/

# Monitor in Docker
docker stats eagler-proxy

# Check proxy state
docker logs -f eagler-proxy

# Memory usage
docker exec eagler-proxy ps aux
```

### Backup Procedure

```bash
# Backup persistent data
docker cp eagler-proxy:/app/.proxy-data ./backup-$(date +%Y%m%d)

# List backups
ls -la backup-*/

# Restore if needed
docker cp ./backup-20240601 eagler-proxy:/app/.proxy-data
docker restart eagler-proxy
```

### Updating the Proxy

```bash
# Pull latest code
git pull origin master

# Rebuild and restart
docker-compose up -d --build

# Or manually
npm run build
npm start
```

---

## 🎮 Connecting Clients

### EaglerX 1.8.9 Client Connection

1. Launch EaglerX 1.8.9
2. Click "Direct Connect"
3. Enter WebSocket URL:
   - Local: `ws://localhost:8080/server`
   - Remote: `wss://your-domain.com/server`
4. Press Enter to connect

### Connection URL Format

| Environment | URL |
|---|---|
| Local Docker | `ws://localhost:8080/server` |
| Remote HTTP | `ws://your-domain.com:8080/server` |
| Remote HTTPS | `wss://your-domain.com/server` |

---

## 📚 Advanced Topics

### High Availability Setup

For production with multiple proxies:

1. Deploy 3-5 proxy instances on Railway/Render
2. Use Nginx load balancer
3. Each proxy has its own persistent volume
4. Clients connect through load balancer URL
5. If one proxy fails, others handle traffic

### Custom Domain Setup

```bash
# Point your domain to proxy
# DNS A record: your-domain.com → proxy-ip

# Or use CNAME with Platform (Railway, Render, etc.)
# CNAME: proxy.your-domain.com → railway-app.railway.app
```

### Performance Tuning

- Increase Node.js heap: `NODE_OPTIONS=--max-old-space-size=1024`
- Tune file descriptors: `ulimit -n 65536`
- Monitor with: `docker stats --no-stream`

---

## ❓ FAQ

**Q: Will my proxy UUID persist if the server restarts?**  
A: Yes, if `ENABLE_PERSISTENT_IP=true` and storage is properly mounted.

**Q: Can I run multiple proxy instances?**  
A: Yes, each should have its own persistent volume and UUID.

**Q: Does this work with offline-mode Minecraft servers?**  
A: Yes, this proxy is designed specifically for offline servers.

**Q: What about authentication and skins?**  
A: Full Eaglercraft skin proxying is built-in.

**Q: Can I use this with a real Minecraft server?**  
A: Yes, it works with any 1.8.9 compatible server.

---

## 🆘 Getting Help

- **GitHub Issues**: [Report bugs](https://github.com/idrkwhotbh/eaglerxbungee/issues)
- **Documentation**: Check `.env.example` for all options
- **Community**: Join Eaglercraft Discord

---

## 📄 License & Credits

EaglerXProxy • Designed for [EaglerCraftX](https://eaglercraft.com) servers

---

**Last Updated**: June 2024  
**Version**: 1.0.0

volumes:
  proxy-data:
```

### 3. Netlify Deployment

#### Prerequisites
- Netlify account (free tier supported)
- GitHub repository with this code

#### Steps

1. **Connect Repository to Netlify**
   - Go to https://app.netlify.com
   - Click "New site from Git"
   - Select GitHub and authorize
   - Choose your eaglerxbungee repository

2. **Configure Build Settings**
   - Build command: `npm run build`
   - Publish directory: `build`
   - Node version: 20.x or higher

3. **Set Environment Variables**
   In Netlify Dashboard → Site settings → Environment:
   ```
   SERVER_HOST=your-minecraft-server.com
   SERVER_PORT=25565
   ENABLE_PERSISTENT_IP=true
   PROXY_PERSISTENCE_DIR=/tmp/eagler-proxy
   ```

4. **Deploy**
   - Push code to main branch
   - Netlify automatically builds and deploys
   - Proxy runs at your Netlify domain

**Note**: Netlify's serverless functions have limitations. For persistent long-running proxy connections, consider Docker or Railway instead.

### 4. Railway Deployment

#### Prerequisites
- Railway account (free tier available)
- GitHub repository

#### Steps

1. **Create Railway Project**
   - Go to https://railway.app
   - Click "Create New Project" → "Deploy from GitHub"
   - Authorize and select your repository

2. **Configure Variables**
   In Railway Dashboard → Variables:
   ```
   SERVER_HOST=your-minecraft-server.com
   SERVER_PORT=25565
   BIND_PORT=8080
   ENABLE_PERSISTENT_IP=true
   ```

3. **Deploy**
   ```bash
   railway up
   ```

### 5. Render Deployment

#### Steps

1. **Create New Web Service**
   - Go to https://render.com
   - Click "New +" → "Web Service"
   - Connect GitHub repository

2. **Configure**
   - Build command: `npm install && npm run build`
   - Start command: `node build/index.js`
   - Environment: Node

3. **Add Environment Variables**
   ```
   SERVER_HOST=your-minecraft-server.com
   SERVER_PORT=25565
   ENABLE_PERSISTENT_IP=true
   ```

4. **Deploy**
   - Click "Deploy"

### 6. GitHub Codespaces (Your Original Setup)

```bash
# In Codespaces terminal
npm install
npm start
```

The proxy automatically gets a public URL via Codespaces port forwarding.

## Persistent Proxy IP Explanation

The `PersistenceManager` ensures your proxy's UUID remains constant:

1. **First Run**: Generates a new UUID and saves to `proxy-state.json`
2. **Subsequent Runs**: Loads the saved UUID from storage
3. **Restart Consistency**: Players can connect to the same proxy IP across service restarts

### Storage Locations by Platform

| Platform | Storage Path | Notes |
|----------|--------------|-------|
| Local | `./.proxy-data/` | Git-ignored directory |
| Docker | `/app/.proxy-data/` (volume mount) | Persists across container restarts |
| Netlify | `/tmp/eagler-proxy/` | Temporary (requires Volume storage) |
| Railway | `./.proxy-data/` | Persists on platform |
| Render | `./.proxy-data/` | Persists on platform |
| Codespaces | `./.proxy-data/` | Persists in your workspace |

## Troubleshooting

### Proxy UUID Changes on Restart
- Check `ENABLE_PERSISTENT_IP` is set to `true`
- Verify persistence directory is writable
- Check logs for permission errors

### Cannot Connect to Minecraft Server
- Verify `SERVER_HOST` and `SERVER_PORT` are correct
- Test direct connection: `telnet SERVER_HOST SERVER_PORT`
- Check firewall rules allow outbound connections

### High Memory Usage
- Reduce `maxPlayers` in config
- Check for memory leaks in connection handling
- Consider using separate private/public proxy instances

### Port Already in Use
- Check what's using the port: `lsof -i :8080`
- Change `BIND_PORT` environment variable
- Kill the conflicting process

## Performance Optimization

For production deployments:

1. **Use Separate Instances**
   - Run private and public proxies separately
   - Use load balancer to distribute traffic

2. **Monitor Resources**
   - CPU usage per player (typically < 1%)
   - Memory per player (typically < 2MB)

3. **Network Optimization**
   - Place proxy geographically close to Minecraft server
   - Use persistent connections
   - Consider connection pooling

4. **Scaling**
   - Horizontal: Deploy multiple proxy instances
   - Vertical: Increase server resources
   - Use reverse proxy (nginx) for load balancing

## Advanced Configuration

### Custom MOTD (Message of the Day)

Edit `config.js`:

```javascript
export const config = {
    name: "My Awesome Proxy",
    motd: {
        iconURL: "./assets/icon.png",
        l1: "Welcome to My Proxy",
        l2: "Join Now!"
    },
    // ... other config
}
```

### Enable TLS/WSS (Secure WebSocket)

Set environment variables:
```
ENABLE_TLS=true
TLS_KEY=/path/to/server.key
TLS_CERT=/path/to/server.crt
```

Or in `config.js`:
```javascript
security: {
    enabled: true,
    key: "./certs/server.key",
    cert: "./certs/server.crt"
}
```

### Multiple Server Proxying

Players can specify custom server via URL parameters:
```
ws://your-proxy.com?server=custom-server.com&port=25565
```

## Support & Contribution

For issues or questions:
1. Check existing GitHub issues
2. Create a new issue with detailed logs
3. Include environment details (platform, Node version, etc.)

## License

[Your License Here]
