# Multi-stage build for React (Vite)

# --- Builder stage ---
FROM node:22-alpine AS builder
WORKDIR /app

# Install deps
COPY package.json package-lock.json* ./
RUN npm ci

# Copy source and build
COPY . .
RUN npm run build

# --- Runtime stage ---
FROM nginx:alpine AS runtime

# Copy build output to Nginx html dir
COPY --from=builder /app/dist /usr/share/nginx/html

# Replace default Nginx config with SPA-friendly config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Healthcheck to ensure server responds
HEALTHCHECK --interval=20s --timeout=3s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost/ || exit 1

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
