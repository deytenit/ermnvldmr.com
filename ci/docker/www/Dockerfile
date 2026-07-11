# Stage 1: Build
FROM node:20-alpine AS builder

# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
RUN npm install -g pnpm@9.12.3

WORKDIR /app

# Copy monorepo configuration
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./

# Copy all package.json files to allow pnpm to fetch dependencies
COPY packages/eslint-config/package.json ./packages/eslint-config/
COPY packages/rsbuild-config/package.json ./packages/rsbuild-config/
COPY packages/ssg/package.json ./packages/ssg/
COPY packages/stl/package.json ./packages/stl/
COPY packages/storybook-config/package.json ./packages/storybook-config/
COPY packages/ui/package.json ./packages/ui/
COPY packages/i18n/package.json ./packages/i18n/
COPY services/www/package.json ./services/www/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build dependencies
RUN pnpm --filter @ermnvldmr/rsbuild-config build
RUN pnpm --filter @ermnvldmr/stl build
RUN pnpm --filter @ermnvldmr/i18n build
RUN pnpm --filter @ermnvldmr/ui build

# Build the website (all locales)
RUN pnpm --filter @ermnvldmr/www build:all

# Stage 2: Runtime
FROM nginx:alpine

COPY --from=builder /app/services/www/dist /usr/share/nginx/html
COPY ci/config/nginx/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]