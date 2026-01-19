# Build stage
FROM node:18-alpine AS builder
WORKDIR /app

# Install server deps and build
COPY server/package*.json ./server/
RUN cd server && npm ci --production=false
COPY server/ ./server/
RUN cd server && npm run build

# Runtime stage
FROM node:18-alpine AS runtime
WORKDIR /app
COPY --from=builder /app/server/dist ./dist
COPY --from=builder /app/server/node_modules ./node_modules

ENV NODE_ENV=production
EXPOSE 4000
CMD ["node", "dist/index.js"]
