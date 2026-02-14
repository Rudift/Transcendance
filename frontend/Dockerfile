FROM node:20-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
RUN npm install -g serve
EXPOSE 3000
CMD ["serve", "-s", "build", "-l", "3000", "--ssl-cert", "/app/certs/frontend.crt", "--ssl-key", "/app/certs/frontend.key"]