FROM node:20-alpine

WORKDIR /app

COPY user/package*.json ./

RUN npm install

COPY user/ .

# Copier les certificats PKI
COPY .pki/user /app/certs

EXPOSE 7000 9100

# Placeholder - en attente du code de l'application
CMD ["npm", "start"]