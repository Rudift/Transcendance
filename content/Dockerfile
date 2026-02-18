FROM node:20-alpine

WORKDIR /app

COPY content/package*.json ./

RUN npm install

COPY content/ .

# Copier les certificats PKI
COPY .pki/content /app/certs

EXPOSE 7000 9100

CMD ["npm", "start"]