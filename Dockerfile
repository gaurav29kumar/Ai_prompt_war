# Stage 1: Build Phase
FROM node:20-alpine AS builder

# Set directory
WORKDIR /app

# Install dependencies rapidly leveraging cache bounds
COPY package*.json ./
COPY server/package*.json ./server/
RUN npm ci && cd server && npm install

# Copy configuration and source structurally
COPY . .

# Run Vite build and Type checks natively
RUN npm run build

# Stage 2: Hardened Runtime Container
FROM node:20-alpine AS runner

# Hardened Security: Drop root permissions mapping everything to generic 'node' user
USER node
WORKDIR /home/node/app

# Copy Production UI assets
COPY --from=builder --chown=node:node /app/dist ./dist

# Copy Server logic bypassing source raw blocks selectively where mapped
COPY --from=builder --chown=node:node /app/server ./server
COPY --from=builder --chown=node:node /app/package*.json ./

# Install core runtime dependencies (ts-node requires dev map locally if uncompiled)
RUN npm install --omit=dev
RUN cd server && npm install 

# Bind generic environment limits preventing production crashes
ENV NODE_ENV=production
ENV PORT=3001

# Expose strictly the Socket Gateway
EXPOSE 3001

# Execute explicitly targeting ESM TypeScript module without compilation phase safely
CMD ["node", "--loader", "ts-node/esm", "server/index.ts"]
