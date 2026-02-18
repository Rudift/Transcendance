FROM nginx:alpine

COPY gateway/nginx.conf /etc/nginx/nginx.conf
COPY .pki/gateway /etc/nginx/ssl

EXPOSE 8443 9100

CMD [ "nginx", "-g", "daemon off;" ]