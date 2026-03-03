#!/bin/sh
chmod 666 /var/run/docker.sock
exec node server.js