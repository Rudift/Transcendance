FROM prom/prometheus

USER root

RUN mkdir -p /etc/prometheus/rules

COPY .pki/prometheus /etc/prometheus/certs
COPY prometheus/prometheus.yml /etc/prometheus/
COPY prometheus/rules/warning.yml /etc/prometheus/rules/warning.yml
COPY prometheus/rules/critical.yml /etc/prometheus/rules/critical.yml
COPY prometheus/rules/network.yml /etc/prometheus/rules/network.yml

RUN chmod -R 755 /etc/prometheus/certs && \
    chmod 644 /etc/prometheus/certs/*.crt && \
    chmod 644 /etc/prometheus/certs/*.key && \
    chown -R nobody:nobody /etc/prometheus/certs

USER nobody