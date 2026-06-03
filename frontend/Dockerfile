# Étape 1 : Construction (Build)
FROM node:20-alpine as builder
WORKDIR /app

# Jeton d'accès au registre GitHub Packages pour @blain-projects/ui.
# Fourni au build via --build-arg NODE_AUTH_TOKEN=... (voir docker-compose.yml).
ARG NODE_AUTH_TOKEN

COPY package*.json ./

# .npmrc éphémère : authentifie le scope @blain-projects sur GitHub Packages
# le temps du npm install, puis est supprimé pour ne pas fuiter dans l'image.
RUN printf "@blain-projects:registry=https://npm.pkg.github.com\n//npm.pkg.github.com/:_authToken=%s\nalways-auth=true\n" "$NODE_AUTH_TOKEN" > .npmrc \
    && npm install \
    && rm -f .npmrc

COPY . .
RUN npm run build

# Étape 2 : Serveur de production (Nginx)
FROM nginx:stable-alpine
COPY --from=builder /app/dist /usr/share/nginx/html
# Configuration pour supporter le routage SPA (Single Page App)
RUN echo 'server { listen 80; root /usr/share/nginx/html; index index.html; location /assets/ { expires 1y; add_header Cache-Control "public, immutable"; } location / { try_files $uri $uri/ /index.html; add_header Cache-Control "no-cache"; } }' > /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
