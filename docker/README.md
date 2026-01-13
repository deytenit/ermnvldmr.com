# Docker Configuration

This directory contains Docker configurations for containerizing the www.ermnvldmr.com website and Storybook component library.

## Structure

```
docker/
├── astro/
│   └── Dockerfile              # Astro static site container
├── storybook/
│   └── Dockerfile              # Storybook component library container
└── nginx/
    ├── nginx.conf              # Main nginx configuration
    ├── astro.conf               # Astro site server configuration
    └── storybook.conf           # Storybook server configuration
```

## Images

### Main Website
- **Image**: `ghcr.io/deytenit/www.ermnvldmr.com`
- **Source**: `docker/astro/Dockerfile`
- **Purpose**: Serves the static Astro website

### Component Library
- **Image**: `ghcr.io/deytenit/www.ermnvldmr.com/storybook`
- **Source**: `docker/storybook/Dockerfile`
- **Purpose**: Serves the Storybook component documentation

## Quick Start

### Local Development

```bash
# Start both containers
docker-compose up

# Build and start
docker-compose up --build

# Access services
# Main site: http://localhost:3000
# Storybook: http://localhost:6006
```

### Manual Build

```bash
# Build Astro site
docker build -f docker/astro/Dockerfile -t www-astro .

# Build Storybook
docker build -f docker/storybook/Dockerfile -t www-storybook .

# Run containers
docker run -p 3000:8080 www-astro
docker run -p 6006:8080 www-storybook
```

## Key Features

### Security
- **Non-root execution**: Containers run as `nginx-user` (UID 1001)
- **Minimal attack surface**: Alpine Linux base with minimal packages
- **Security headers**: Comprehensive HTTP security headers configured
- **Non-privileged ports**: Expose port 8080 instead of 80

### Performance
- **Multi-stage builds**: Separate build and runtime stages for smaller images
- **Static content optimization**: nginx tuned for static file serving
- **Compression**: Gzip compression for all text-based assets
- **Caching**: Proper cache headers for optimal performance

### Reliability
- **Health checks**: Built-in health monitoring endpoints
- **Signal handling**: Proper signal handling with dumb-init
- **Graceful shutdown**: Clean container shutdown procedures
- **Resource limits**: Configurable resource constraints

## Configuration

### Environment Variables

The containers are designed to be stateless and don't require runtime environment variables. All configuration is baked into the build process.

### nginx Customization

Modify nginx configurations in the `nginx/` directory:

- **nginx.conf**: Global nginx settings (workers, gzip, security)
- **astro.conf**: Astro-specific routing and caching
- **storybook.conf**: Storybook-specific SPA routing and CSP

### Build Arguments

No build arguments are currently required, but can be added for customization:

```dockerfile
ARG NODE_VERSION=20
FROM node:${NODE_VERSION}-alpine
```

## Deployment

### CI/CD Integration

Images are automatically built and pushed via GitHub Actions when:
- **Pre-release**: Push to `next` branch triggers semantic pre-release
- **Release**: Manual workflow dispatch creates stable release

### Production Usage

```bash
# Pull latest images
docker pull ghcr.io/deytenit/www.ermnvldmr.com:latest
docker pull ghcr.io/deytenit/www.ermnvldmr.com/storybook:latest

# Run with restart policy
docker run -d \
  --name www-astro \
  -p 3000:8080 \
  --restart unless-stopped \
  ghcr.io/deytenit/www.ermnvldmr.com:latest

docker run -d \
  --name www-storybook \
  -p 6006:8080 \
  --restart unless-stopped \
  ghcr.io/deytenit/www.ermnvldmr.com/storybook:latest
```

### Reverse Proxy Integration

Both containers are designed to work behind a reverse proxy:

- Expose port 8080 (non-privileged)
- Include proper health check endpoints
- Forward client IP and headers correctly
- Support SSL termination at proxy level

## Monitoring

### Health Checks

```bash
# Container health
curl http://localhost:3000/health
curl http://localhost:6006/health

# Docker health status
docker ps  # Shows health status
```

### Logs

```bash
# View logs
docker logs container-name

# Follow logs
docker logs -f container-name

# Docker Compose logs
docker-compose logs -f
```

## Troubleshooting

### Common Issues

1. **Build failures**: Check Node.js version and pnpm compatibility
2. **Permission errors**: Verify nginx user configuration
3. **Port conflicts**: Ensure ports 3000 and 6006 are available
4. **Health check failures**: Verify nginx configuration and file permissions

### Debug Access

```bash
# Interactive shell
docker exec -it container-name sh

# Debug container without starting services
docker run -it --entrypoint=/bin/sh image-name
```

## Security

### Vulnerability Scanning

Images are automatically scanned for vulnerabilities in the CI/CD pipeline. For manual scanning:

```bash
# Using Docker Scout
docker scout cves ghcr.io/deytenit/www.ermnvldmr.com:latest

# Using Trivy
trivy image ghcr.io/deytenit/www.ermnvldmr.com:latest
```

### Security Best Practices

- Regular base image updates
- Non-root user execution
- Minimal package installation
- Security header enforcement
- Access logging enabled

---

For detailed deployment and development guides, see:
- [Container Deployment Guide](../docs/container-deployment.md)
- [Container Development Guide](../docs/container-development.md)
