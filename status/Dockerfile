FROM node:24-alpine

WORKDIR /app

COPY status/package*.json ./

RUN npm install

COPY status/ .

# Copier les certificats PKI
COPY .pki/status /app/certs

EXPOSE 7000 9100

CMD ["npm", "start"]