# Stage 1: Build
FROM ghcr.io/gohugoio/hugo:v0.154.5 AS builder

WORKDIR /src
COPY services/docs /src

RUN hugo --gc --minify

# Stage 2: Runtime
FROM nginx:alpine

COPY --from=builder /src/public /usr/share/nginx/html
COPY ci/config/nginx/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
