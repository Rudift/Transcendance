FROM node:24-alpine

WORKDIR /app

COPY bff/backend/package*.json ./

# COPY bff/package*.json ./

# Install Python and build dependencies for native modules (bcrypt)
RUN apk add --no-cache --virtual .build-deps python3 make g++ && \
	if [ -f package-lock.json ]; then \
			npm ci --omit=dev; \
		else \
			npm install --omit=dev; \
		fi && \
	apk del .build-deps
COPY bff/backend/ .

COPY .pki/bff /app/certs

RUN npm run build --if-present

CMD [ "npm", "start" ]