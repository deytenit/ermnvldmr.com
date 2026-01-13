# Container Deployment Guide

This guide covers the containerized deployment setup for the www.ermnvldmr.com website, including both the main Astro site and the Storybook component library.

## Overview

The project uses Docker containers to package and deploy:
- **Main Site**: Astro static website served via nginx
- **Storybook**: Component library served via nginx
- **Registry**: GitHub Container Registry (ghcr.io)
- **CI/CD**: GitHub Actions with semantic versioning

## Container Architecture

### Multi-stage Build Strategy

Both containers follow a multi-stage build pattern:

1. **Builder Stage**: Node.js 20 Alpine with pnpm for building assets
2. **Production Stage**: nginx:1.25-alpine for serving static content

### Security Features

- **Non-root user**: Containers run as `nginx-user` (UID 1001)
- **Non-privileged ports**: Expose port 8080 instead of 80
- **Security headers**: CSP, HSTS, and other security headers configured
- **Signal handling**: dumb-init for proper signal handling

### Images

- **Main Site**: `ghcr.io/deytenit/www.ermnvldmr.com`
- **Storybook**: `ghcr.io/deytenit/www.ermnvldmr.com/storybook`

## Tagging Strategy

### Release Tags (from `release/semantic-dispatch`)

For both images:
- `vX.X.X` - Full version (e.g., `v1.2.3`)
- `vX.X` - Minor version (e.g., `v1.2`)
- `vX` - Major version (e.g., `v1`)
- `latest` - Latest stable release
- `{sha}` - Commit SHA for traceability

### Pre-release Tags (from `next/semantic-dispatch`)

For both images:
- `vX.X.X-next.X` - Full prerelease version (e.g., `v1.2.3-next.1`)
- `vX.X.X-next` - Latest prerelease for that version
- `vX.X-next` - Latest prerelease for minor version
- `vX-next` - Latest prerelease for major version
- `latest-next` - Latest prerelease overall
- `{sha}` - Commit SHA for traceability

## Local Development

### Using Docker Compose

Start both services locally:

```bash
# Start both containers
docker-compose up

# Start in background
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

Access points:
- **Main Site**: http://localhost:3000
- **Storybook**: http://localhost:6006

### Building Individual Images

```bash
# Build Astro site
docker build -f docker/astro/Dockerfile -t www-astro .

# Build Storybook
docker build -f docker/storybook/Dockerfile -t www-storybook .

# Run containers
docker run -p 3000:8080 www-astro
docker run -p 6006:8080 www-storybook
```

## Production Deployment

### Manual Container Deployment

Pull and run the latest images:

```bash
# Pull latest stable images
docker pull ghcr.io/deytenit/www.ermnvldmr.com:latest
docker pull ghcr.io/deytenit/www.ermnvldmr.com/storybook:latest

# Run main site
docker run -d \
  --name www-ermnvldmr-astro \
  -p 3000:8080 \
  --restart unless-stopped \
  ghcr.io/deytenit/www.ermnvldmr.com:latest

# Run storybook
docker run -d \
  --name www-ermnvldmr-storybook \
  -p 6006:8080 \
  --restart unless-stopped \
  ghcr.io/deytenit/www.ermnvldmr.com/storybook:latest
```

### Environment Variables

The containers are designed to be stateless and don't require runtime environment variables. Configuration is baked into the build.

### Health Checks

Both containers include health check endpoints:

```bash
# Check container health
curl http://localhost:3000/health  # Astro site
curl http://localhost:6006/health  # Storybook
```

### Resource Requirements

**Recommended minimums per container:**
- **CPU**: 0.1 cores
- **Memory**: 64MB
- **Storage**: 100MB

**Production recommendations:**
- **CPU**: 0.25 cores
- **Memory**: 128MB
- **Storage**: 500MB (for logs and cache)

## Reverse Proxy Configuration

### nginx Configuration Example

```nginx
server {
    listen 80;
    server_name www.ermnvldmr.com;
    
    location / {
        proxy_pass http://astro-container:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

server {
    listen 80;
    server_name storybook.ermnvldmr.com;
    
    location / {
        proxy_pass http://storybook-container:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### Traefik Configuration Example

```yaml
# docker-compose.yml with Traefik
version: '3.8'

services:
  astro:
    image: ghcr.io/deytenit/www.ermnvldmr.com:latest
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.astro.rule=Host(`www.ermnvldmr.com`)"
      - "traefik.http.services.astro.loadbalancer.server.port=8080"

  storybook:
    image: ghcr.io/deytenit/www.ermnvldmr.com/storybook:latest
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.storybook.rule=Host(`storybook.ermnvldmr.com`)"
      - "traefik.http.services.storybook.loadbalancer.server.port=8080"
```

## Troubleshooting

### Common Issues

#### Container Won't Start

```bash
# Check logs
docker logs container-name

# Common causes:
# - Missing dependencies in build
# - Permission issues
# - Port conflicts
```

#### Build Failures

```bash
# Check build logs
docker build -f docker/astro/Dockerfile -t test .

# Common causes:
# - Node version mismatch
# - pnpm cache issues
# - Missing build dependencies
```

#### Permission Denied

```bash
# Check if running as correct user
docker exec container-name whoami

# Should output: nginx-user
```

### Debugging

Enable debug mode in nginx:

```bash
# Create debug container
docker run -it --entrypoint=/bin/sh ghcr.io/deytenit/www.ermnvldmr.com:latest

# Check nginx config
nginx -t

# Check file permissions
ls -la /usr/share/nginx/html/
```

### Performance Tuning

#### nginx Optimization

For high-traffic deployments, consider:

- Adjusting worker processes
- Enabling gzip compression levels
- Tuning keepalive settings
- Adding rate limiting

#### Container Resources

Monitor and adjust:

```bash
# Check resource usage
docker stats

# Update container limits
docker run --memory=256m --cpus=0.5 ...
```

## Security Considerations

### Container Security

- Containers run as non-root user
- Minimal attack surface with Alpine base
- Regular security updates via base image updates
- No sensitive data in containers

### Network Security

- Expose only necessary ports
- Use internal networks for service communication
- Implement proper firewall rules
- Enable HTTPS with reverse proxy

### Registry Security

- Images are signed and scanned
- Access controlled via GitHub permissions
- Automatic vulnerability scanning
- Regular base image updates

## Monitoring

### Health Monitoring

```bash
# Simple health check script
#!/bin/bash
if curl -f http://localhost:3000/health >/dev/null 2>&1; then
    echo "Astro site: healthy"
else
    echo "Astro site: unhealthy"
    exit 1
fi
```

### Log Management

```bash
# View logs
docker-compose logs -f astro
docker-compose logs -f storybook

# Log rotation (configure docker daemon)
# /etc/docker/daemon.json
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  }
}
```

### Metrics Collection

Consider integrating with:
- Prometheus + Grafana
- nginx prometheus exporter
- Container metrics exporters
- Application performance monitoring

## CI/CD Integration

The containers are automatically built and pushed when:

1. **Pre-release**: Merge to `next` branch triggers prerelease
2. **Release**: Manual workflow dispatch creates stable release

### Workflow Outputs

Each workflow provides:
- `new_release_published`: Boolean indicating if release was created
- `new_release_version`: The version number of the release

### Manual Triggers

```bash
# Trigger release workflow via GitHub CLI
gh workflow run "release/semantic-dispatch" --ref main

# Trigger prerelease via merge to next branch
git checkout next
git merge feature-branch
git push origin next
```

## Maintenance

### Regular Updates

1. **Base Image Updates**: Rebuild monthly for security patches
2. **Dependency Updates**: Follow project dependency update schedule
3. **Configuration Review**: Quarterly review of nginx and security settings

### Backup Strategy

Since containers are stateless:
- Source code is backed up in Git repository
- Container images are versioned in registry
- No persistent data to backup

### Rollback Procedure

```bash
# Rollback to previous version
docker pull ghcr.io/deytenit/www.ermnvldmr.com:v1.2.2
docker stop current-container
docker run -d --name new-container ghcr.io/deytenit/www.ermnvldmr.com:v1.2.2

# Or use docker-compose with specific version
docker-compose down
# Edit docker-compose.yml to specify version
docker-compose up -d
```

---

For additional support or questions, refer to the project repository issues or documentation.
