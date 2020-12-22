FROM nginxinc/nginx-unprivileged
COPY dist/* /usr/share/nginx/html/
