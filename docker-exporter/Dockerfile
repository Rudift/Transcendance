FROM node:24-alpine
WORKDIR /app

RUN addgroup -g 999 docker 2>/dev/null || true && \
    adduser -D -u 1000 appuser 2>/dev/null || true && \
    adduser appuser docker 2>/dev/null || true

COPY docker-exporter/package.json .
RUN npm install
COPY docker-exporter/server.js .
COPY docker-exporter/entrypoint.sh .
COPY .pki/docker-exporter /app/certs

RUN chmod +x entrypoint.sh

USER root
EXPOSE 9200
CMD ["sh", "./entrypoint.sh"]
