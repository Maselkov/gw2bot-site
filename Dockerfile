# syntax=docker/dockerfile:1

# ---- Build stage ----
FROM node:20-bookworm-slim AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build \
  && npm prune --omit=dev \
  && npm cache clean --force

# ---- Runtime stage ----
FROM node:20-bookworm-slim
WORKDIR /app

ENV NODE_ENV=production \
    NUXT_HOST=0.0.0.0 \
    NUXT_PORT=3000

COPY --from=build --chown=node:node /app ./

USER node
EXPOSE 3000

CMD ["npm", "start"]
