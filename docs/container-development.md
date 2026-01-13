# Container Development Guide

This guide covers development workflow with the containerized setup.

## Quick Start

### Prerequisites

- Docker and Docker Compose installed
- pnpm v9.12.3+
- Node.js v20+

### Local Development

1. **Clone and setup**:
   ```bash
   git clone https://github.com/deytenit/www.ermnvldmr.com.git
   cd www.ermnvldmr.com
   pnpm install
   ```

2. **Start development servers** (non-containerized):
   ```bash
   pnpm dev        # Astro dev server on :4321
   pnpm storybook  # Storybook dev server on :6006
   ```

3. **Test containerized build**:
   ```bash
   docker-compose up --build
   ```

### Container Development Workflow

#### Building Images Locally

```bash
# Build both images
docker-compose build

# Build specific image
docker-compose build astro
docker-compose build storybook

# Build with no cache
docker-compose build --no-cache
```

#### Testing Container Changes

```bash
# Start containers
docker-compose up -d

# Check logs
docker-compose logs -f astro
docker-compose logs -f storybook

# Test health endpoints
curl http://localhost:3000/health
curl http://localhost:6006/health

# Stop containers
docker-compose down
```

### Debugging Containers

#### Interactive Shell Access

```bash
# Access running container
docker-compose exec astro sh
docker-compose exec storybook sh

# Or start debug container
docker run -it --entrypoint=/bin/sh $(docker-compose config | grep image: | head -1 | cut -d: -f2-)
```

#### Common Debug Commands

```bash
# Inside container:
whoami                           # Check user
nginx -t                         # Test nginx config
ls -la /usr/share/nginx/html/   # Check files
ps aux                          # Check processes
netstat -tlnp                   # Check ports
```

## Docker Configuration

### File Structure

```
docker/
├── astro/
│   └── Dockerfile              # Astro site container
├── storybook/
│   └── Dockerfile              # Storybook container
└── nginx/
    ├── nginx.conf              # Main nginx config
    ├── astro.conf               # Astro site config
    └── storybook.conf           # Storybook config
```

### Build Context

The `.dockerignore` file optimizes build context:
- Excludes `node_modules/`, `dist/`, build artifacts
- Includes source files, package files, configs
- Reduces build time and image size

### Multi-stage Build Benefits

1. **Smaller Images**: Only runtime dependencies in final image
2. **Security**: No build tools in production image
3. **Caching**: Efficient layer caching for faster builds
4. **Consistency**: Same build environment across all environments

## nginx Configuration

### Security Features

- Non-root user execution
- Security headers (HSTS, CSP, etc.)
- Rate limiting capabilities
- Access controls for sensitive paths

### Performance Optimizations

- Gzip compression for assets
- Caching headers for static files
- Connection keep-alive
- Efficient static file serving

### Configuration Customization

Edit files in `docker/nginx/`:
- `nginx.conf`: Global nginx settings
- `astro.conf`: Astro-specific server block
- `storybook.conf`: Storybook-specific server block

## CI/CD Integration

### GitHub Actions Workflow

The workflows are triggered by semantic versioning:

1. **Development**: Push to feature branches
2. **Pre-release**: Merge to `next` branch
3. **Release**: Manual dispatch or release branch

### Build Process

1. Install dependencies with pnpm
2. Build Astro static site
3. Build Storybook static site
4. Create semantic release
5. Build and push Docker images (if release created)

### Image Tagging

Images follow semantic versioning:
- Release: `latest`, `v1.2.3`, `v1.2`, `v1`
- Pre-release: `latest-next`, `v1.2.3-next.1`, etc.

## Testing

### Container Testing

```bash
# Test image builds
docker build -f docker/astro/Dockerfile -t test-astro .
docker build -f docker/storybook/Dockerfile -t test-storybook .

# Test containers run
docker run -p 3000:8080 test-astro &
docker run -p 6006:8080 test-storybook &

# Test endpoints
curl -f http://localhost:3000/
curl -f http://localhost:6006/
curl -f http://localhost:3000/health
curl -f http://localhost:6006/health

# Cleanup
docker stop $(docker ps -q)
```

### Security Testing

```bash
# Scan images for vulnerabilities
docker scout cves test-astro
docker scout cves test-storybook

# Check for non-root execution
docker run --rm test-astro whoami  # Should output: nginx-user

# Test file permissions
docker run --rm test-astro ls -la /usr/share/nginx/html/
```

## Performance Optimization

### Image Size Optimization

Current optimizations:
- Multi-stage builds
- Alpine Linux base images
- Minimal runtime dependencies
- Optimized layer ordering

### Build Performance

- Layer caching in GitHub Actions
- Efficient `.dockerignore`
- Parallel builds for multiple platforms
- Registry cache utilization

### Runtime Performance

- nginx optimizations for static content
- Gzip compression
- Proper caching headers
- Health check optimizations

## Troubleshooting

### Common Build Issues

1. **pnpm version mismatch**:
   ```bash
   # Update Dockerfile pnpm version
   RUN corepack prepare pnpm@9.12.3 --activate
   ```

2. **Permission issues**:
   ```bash
   # Check user creation in Dockerfile
   RUN adduser -S -D -H -u 1001 nginx-user
   ```

3. **Missing dependencies**:
   ```bash
   # Ensure all deps in package.json
   pnpm install --frozen-lockfile
   ```

### Common Runtime Issues

1. **Container won't start**:
   ```bash
   docker logs container-name
   # Check nginx config: nginx -t
   ```

2. **404 errors**:
   ```bash
   # Check file permissions and paths
   docker exec container ls -la /usr/share/nginx/html/
   ```

3. **Health check failures**:
   ```bash
   # Test health endpoint manually
   curl -v http://localhost:8080/health
   ```

### Performance Issues

```bash
# Monitor resource usage
docker stats

# Check nginx access logs
docker exec container tail -f /var/log/nginx/access.log

# Profile application
docker exec container top
```

## Contributing

### Making Changes to Containers

1. Modify Docker configurations
2. Test locally with `docker-compose up --build`
3. Validate with security and performance tests
4. Update documentation
5. Create pull request

### Release Process

1. Changes merged to `next` create pre-releases
2. Manual workflow dispatch creates stable releases
3. Both trigger automated container builds
4. Images are automatically tagged and pushed

---

For more detailed deployment information, see [container-deployment.md](./container-deployment.md).
