FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy TypeScript files
COPY . .

# Build TypeScript
RUN npm run build

# Create persistence directory
RUN mkdir -p /app/.proxy-data

# Expose port
EXPOSE 8080

# Set environment variables
ENV BIND_HOST=0.0.0.0
ENV BIND_PORT=8080
ENV PROXY_PERSISTENCE_DIR=/app/.proxy-data
ENV ENABLE_PERSISTENT_IP=true

# Start the proxy
CMD ["node", "build/index.js"]
