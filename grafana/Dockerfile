FROM grafana/grafana:latest

# Création du dossier pour les certificats
USER root
RUN mkdir -p /etc/grafana/certs
RUN mkdir -p /etc/grafana/provisioning/datasources

# Copie des certificats lors du build
COPY .pki/grafana/grafana.crt /etc/grafana/certs/grafana.crt
COPY .pki/grafana/grafana.key /etc/grafana/certs/grafana.key
COPY .pki/ca/ca.crt /etc/grafana/certs/ca.crt

# Copie des fichiers de provisioning
COPY grafana/provisioning/datasources/prometheus.yml /etc/grafana/provisioning/datasources/prometheus.yml
COPY grafana/provisioning/dashboards/dashboards.yml /etc/grafana/provisioning/dashboards/dashboards.yml
COPY grafana/provisioning/dashboards/dashboard.json /etc/grafana/provisioning/dashboards/dashboard.json

RUN chmod 644 /etc/grafana/certs/grafana.crt && \
    chmod 600 /etc/grafana/certs/grafana.key && \
    chmod 644 /etc/grafana/certs/ca.crt && \
    chmod 644 /etc/grafana/provisioning/datasources/prometheus.yml && \
    chmod 644 /etc/grafana/provisioning/dashboards/dashboards.yml && \
    chmod 644 /etc/grafana/provisioning/dashboards/dashboard.json && \
    chown -R 472:0 /etc/grafana/certs && \
    chown -R 472:0 /etc/grafana/provisioning

USER 472

