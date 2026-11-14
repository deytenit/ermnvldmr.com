FROM node:24-alpine AS builder

RUN npm install -g pnpm@9.12.3
WORKDIR /app

COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY packages/eslint-config/package.json ./packages/eslint-config/
COPY packages/i18n/package.json ./packages/i18n/
COPY packages/kits/package.json ./packages/kits/
COPY packages/rsbuild-config/package.json ./packages/rsbuild-config/
COPY packages/stl/package.json ./packages/stl/
COPY packages/storybook-config/package.json ./packages/storybook-config/
COPY packages/ui/package.json ./packages/ui/
COPY services/exp/package.json ./services/exp/

RUN pnpm --filter '@ermnvldmr/exp...' install --frozen-lockfile

COPY tsconfig.json ./
COPY packages ./packages
COPY services/exp ./services/exp

RUN pnpm -r --filter '@ermnvldmr/exp^...' --if-present build
RUN pnpm --filter @ermnvldmr/exp lint && pnpm exp:build

FROM nginx:alpine

ARG COMMIT_SHA=unknown

COPY --from=builder /app/services/exp/dist /usr/share/nginx/html
COPY ci/docker/exp/nginx.conf /etc/nginx/conf.d/default.conf

RUN printf '{"service":"exp","version":"%s","commit":"%s"}\n' \
    "${COMMIT_SHA}" "${COMMIT_SHA}" > /usr/share/nginx/html/version.json
