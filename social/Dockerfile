FROM node:20-alpine

WORKDIR /app

COPY social/package*.json ./

RUN npm install

COPY social/ .

# Copier les certificats PKI
COPY .pki/social /app/certs

EXPOSE 7000 9100

CMD ["npm", "start"]