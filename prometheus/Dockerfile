FROM prom/prometheus

USER root

COPY .pki/prometheus /etc/prometheus/certs

RUN chmod -R 755 /etc/prometheus/certs && \
    chmod 644 /etc/prometheus/certs/*.crt && \
    chmod 644 /etc/prometheus/certs/*.key && \
    chown -R nobody:nobody /etc/prometheus/certs

USER nobody