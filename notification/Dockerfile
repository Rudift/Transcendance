FROM node:24-alpine

WORKDIR /app

COPY notification/package*.json ./

RUN npm install

COPY notification/ .

# Copier les certificats PKI
COPY .pki/notification /app/certs

EXPOSE 7000 9100

CMD ["npm", "start"]