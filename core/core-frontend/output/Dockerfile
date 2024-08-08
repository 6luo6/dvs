FROM docker.funi.local:5000/funi_nginx:2

EXPOSE 80
WORKDIR /usr/share/nginx/html
RUN rm -rf /usr/share/nginx/html/*
COPY ./dist/ /usr/share/nginx/html/dvsapp/
