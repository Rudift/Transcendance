FROM node:20-alpine

WORKDIR /app

COPY realtime/package*.json ./

RUN npm install

COPY realtime/ .

# Copier les certificats PKI
COPY .pki/realtime /app/certs

EXPOSE 7000 7001 9100

CMD ["npm", "start"]