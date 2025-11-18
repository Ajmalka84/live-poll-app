# client/Dockerfile for Vite (multi-stage)

# ---- Stage 1: build ----
FROM node:18-alpine AS build
WORKDIR /app

# copy package manifest and install deps
COPY package*.json ./
RUN npm ci

# Build-time API var for Vite must start with VITE_
ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}

COPY . .
RUN npm run build

# If output is in /app/dist (Vite), leave it as-is.
# ---- Stage 2: serve with nginx ----
FROM nginx:alpine
RUN rm -rf /usr/share/nginx/html/*
# Copy the Vite build output (dist) into nginx www root
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
