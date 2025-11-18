# server/Dockerfile
FROM node:18-alpine

# Create app dir
WORKDIR /app

# Copy package manifests first (takes advantage of Docker cache)
COPY package*.json ./

# Install only production deps (change to npm install for dev/build workflow)
RUN npm ci --only=production

# Copy the rest of the source
COPY . .

# Ensure the app listens to PORT env var
ENV PORT=8080
EXPOSE 8080

# Healthcheck (optional, useful in some platforms)
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
    CMD wget -qO- http://localhost:8080/health || exit 1

# Use a simple start command; make sure package.json has "start"
CMD ["node", "server.js"]

