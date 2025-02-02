FROM node:18 as builder
WORKDIR /maputnik

# Only copy package.json to prevent npm install from running on every build
COPY package.json package-lock.json ./
RUN npm install

# Build maputnik
COPY . .
RUN npm run build

#---------------------------------------------------------------------------
# Create a clean nginx-alpine slim image with just the build results
FROM nginx:alpine-slim

COPY --from=builder /maputnik/dist /usr/share/nginx/html/
