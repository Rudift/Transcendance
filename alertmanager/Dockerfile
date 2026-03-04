FROM prom/alertmanager

USER root

COPY alertmanager/alertmanager.yml /etc/alertmanager/
COPY .pki/alertmanager /etc/alertmanager/certs
COPY .pki/ca/ca.crt /etc/alertmanager/certs/

RUN chmod -R 755 /etc/alertmanager/certs && \
    chmod 644 /etc/alertmanager/certs/*.crt && \
    chmod 644 /etc/alertmanager/certs/*.key && \
    chown -R nobody:nobody /etc/alertmanager/certs

USER nobody

EXPOSE 9093