FROM node:18-slim

# Create app directory
WORKDIR /usr/src/app

# Copy package configuration files
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy the rest of the application source code
COPY . .

# Expose the internal network port
EXPOSE 8080

# Run the proxy with memory optimization flags
CMD ["node", "--expose-gc", "--max-old-space-size=2048", "index.js"]
