FROM node:20-alpine

WORKDIR /app

COPY frontend/package*.json ./

RUN npm ci

COPY frontend/ .

COPY .pki/frontend /app/certs

RUN npm run build

RUN npm install -g serve

EXPOSE 3000

CMD ["serve", "-s", "build", "-l", "3000", "--ssl-cert", "/app/certs/frontend.crt", "--ssl-key", "/app/certs/frontend.key"]