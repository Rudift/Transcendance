#!/usr/bin/env bash
set -e

PKI_DIR=".pki"
CA_DIR="$PKI_DIR/ca"
ISSUED_DIR="$PKI_DIR/issued"

SERVICES=(
  nginx
  gateway
  auth
  auth-db
  user
  user-db
  social
  social-db
  content
  content-db
  realtime
  realtime-db
  prometheus
  grafana
  bff
  frontend
)

echo "==> Reset PKI"
rm -rf "$PKI_DIR"
mkdir -p "$CA_DIR"

echo "==> Generate CA"
openssl genrsa -out "$CA_DIR/ca.key" 4096
openssl req -x509 -new -nodes \
  -key "$CA_DIR/ca.key" \
  -sha256 -days 3650 \
  -subj "/CN=Dev-Internal-CA" \
  -out "$CA_DIR/ca.crt"

for svc in "${SERVICES[@]}"; do
  echo "==> Generate cert for $svc"

  SVC_DIR="$PKI_DIR/$svc"
  mkdir -p "$SVC_DIR"

  openssl genrsa -out "$SVC_DIR/$svc.key" 2048

  openssl req -new \
    -key "$SVC_DIR/$svc.key" \
    -subj "/CN=$svc" \
    -out "$SVC_DIR/$svc.csr"

  openssl x509 -req \
    -in "$SVC_DIR/$svc.csr" \
    -CA "$CA_DIR/ca.crt" \
    -CAkey "$CA_DIR/ca.key" \
    -CAcreateserial \
    -out "$SVC_DIR/$svc.crt" \
    -days 365 \
    -sha256

  rm "$SVC_DIR/$svc.csr"

  chmod 600 "$SVC_DIR/$svc.key"

  cp $CA_DIR/ca.crt $SVC_DIR/ca.crt
done

chmod 600 "$CA_DIR/ca.key"

echo "PKI ready in ./pki"