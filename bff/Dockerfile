FROM node:20-alpine

WORKDIR /app

COPY bff/backend/package*.json ./

RUN if [ -f package-lock.json ]; then \
			npm ci --omit=dev; \
		else \
			npm install --omit=dev; \
		fi
COPY bff/backend/ .

COPY .pki/bff /app/certs

RUN npm run build --if-present

CMD [ "npm", "start" ]