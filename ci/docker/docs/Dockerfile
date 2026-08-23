# Stage 1: Build
FROM ghcr.io/gohugoio/hugo:v0.154.5 AS builder

WORKDIR /src
# Copy git directory for git info metadata
COPY --chown=hugo:hugo .git /src/.git
COPY --chown=hugo:hugo services/docs /src/services/docs

USER hugo

WORKDIR /src/services/docs
RUN hugo --gc --minify

# Stage 2: Runtime
FROM nginx:alpine

ARG COMMIT_SHA="unknown"
ARG VERSION="latest"

COPY --from=builder /src/services/docs/public /usr/share/nginx/html
COPY ci/config/nginx/default.conf /etc/nginx/conf.d/default.conf

# Generate version metadata for automated rollout verification
RUN printf '{\n  "service": "docs",\n  "version": "%s",\n  "commit": "%s",\n  "builtAt": "%s"\n}\n' \
    "${VERSION}" "${COMMIT_SHA}" "$(date -u +'%Y-%m-%dT%H:%M:%SZ')" > /usr/share/nginx/html/version.json

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
