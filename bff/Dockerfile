FROM node:20-alpine

WORKDIR /app
# copy both package.json and package-lock.json if present (cache-friendly)
COPY backend/package*.json ./
# If a lockfile is present use `npm ci` for reproducible installs, otherwise fall back to `npm install`
RUN if [ -f package-lock.json ]; then \
			npm ci --omit=dev; \
		else \
			npm install --omit=dev; \
		fi
COPY backend/ .
RUN npm run build --if-present
CMD [ "npm", "start" ]