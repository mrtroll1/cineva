# Build client static assets
FROM node:22-alpine AS client-build
WORKDIR /app
COPY client/web/package.json client/web/package-lock.json ./
RUN npm ci
COPY client/web/ .
RUN npm run build

# Final nginx image
FROM nginx:1.27-alpine
COPY --from=client-build /app/dist /usr/share/nginx/html
COPY nginx/nginx.prod.conf /etc/nginx/conf.d/default.conf
EXPOSE 80 443
