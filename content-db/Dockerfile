FROM postgres:15-alpine

# Copie des certificats depuis le PKI
COPY .pki/content-db/content-db.crt /var/lib/postgresql/server.crt
COPY .pki/content-db/content-db.key /var/lib/postgresql/server.key
COPY .pki/ca/ca.crt /var/lib/postgresql/root.crt

USER root
RUN chmod 600 /var/lib/postgresql/server.key && \
	chown postgres:postgres /var/lib/postgresql/server.key \
                            /var/lib/postgresql/server.crt \
                            /var/lib/postgresql/root.crt

USER postgres