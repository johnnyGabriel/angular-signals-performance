# Stage 1: Build the Angular app
FROM node:22-alpine AS build

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Build the Angular app
RUN npm run build -- --configuration development --output-path=dist

# Stage 2: Serve with nginx
# FROM nginx:latest AS server

# # Copy built files from previous stage
# COPY --from=build /app/dist/browser /usr/share/nginx/html

# # Copy custom nginx config if needed (optional)
# # COPY nginx.conf /etc/nginx/nginx.conf

# # support running as arbitrary user which belogs to the root group
# RUN chmod g+rwx /var/cache/nginx /var/run /var/log/nginx
# # users are not allowed to listen on priviliged ports
# RUN sed -i.bak 's/listen\(.*\)80;/listen 8081;/' /etc/nginx/conf.d/default.conf
# EXPOSE 8081
# # comment user directive as master process is run as user in OpenShift anyhow
# RUN sed -i.bak 's/^user/#user/' /etc/nginx/nginx.conf

# # EXPOSE 80

# CMD ["nginx", "-g", "daemon off;"]

FROM node:22-alpine AS ssr

# # Copy built files from previous stage
COPY --from=build /app/dist /front

EXPOSE 4000

CMD node front/server/server.mjs