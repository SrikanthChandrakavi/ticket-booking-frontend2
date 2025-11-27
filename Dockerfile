# ---------- Build Stage ----------
FROM node:20-alpine as build
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the code and build the app
COPY . .
RUN npm run build

# ---------- Serve Stage ----------
FROM nginx:alpine
WORKDIR /usr/share/nginx/html

# Remove default nginx static assets and copy dist
RUN rm -rf ./*
COPY --from=build /app/dist .

# Copy custom nginx config (for API proxy + SPA routing)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
