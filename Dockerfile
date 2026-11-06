# ─────────────────────────────────────────────────────────
#  Dockerfile — DevOps CI/CD Pipeline Demo
# ─────────────────────────────────────────────────────────
#  Multi-stage build for a production-ready Node.js app
# ─────────────────────────────────────────────────────────

# ── Stage 1: Build ────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency manifests first (layer caching)
COPY package*.json ./

# Install ALL dependencies (including devDependencies for testing)
RUN npm ci

# Copy application source
COPY . .

# Run tests during build to ensure quality
RUN npm test

# ── Stage 2: Production ──────────────────────────────────
FROM node:20-alpine AS production

# Add labels for image metadata
LABEL maintainer="Moaaz Mohamed <MoaazMoh@icloud.com>"
LABEL description="DevOps CI/CD Pipeline Demo Application"
LABEL version="1.0.0"

# Create non-root user for security
RUN addgroup -g 1001 -S appgroup && \
    adduser -S appuser -u 1001 -G appgroup

WORKDIR /app

# Copy dependency manifests
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production && \
    npm cache clean --force

# Copy application source from builder
COPY --from=builder /app/src ./src

# Change ownership to non-root user
RUN chown -R appuser:appgroup /app

# Switch to non-root user
USER appuser

# Expose the application port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Start the application
CMD ["node", "src/app.js"]
