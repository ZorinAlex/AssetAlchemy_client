FROM nginx:stable-alpine
WORKDIR /usr/src/app

COPY dist /usr/share/nginx/html
COPY default.conf /etc/nginx/conf.d/default.conf

EXPOSE 8083
CMD ["nginx", "-g", "daemon off;"]
