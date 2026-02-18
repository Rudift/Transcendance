FROM node:20-alpine

WORKDIR /app

COPY auth/package*.json ./

RUN npm install

COPY auth/ .

COPY .pki/auth /app/certs

EXPOSE 9100

CMD ["npm", "start"]