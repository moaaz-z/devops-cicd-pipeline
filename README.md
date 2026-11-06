# DevOps CI/CD Pipeline Demo

A complete DevOps project demonstrating containerization with **Docker** and automated CI/CD with **Jenkins** for a Node.js web application.

![Node.js](https://img.shields.io/badge/Node.js-20-green?logo=node.js)
![Docker](https://img.shields.io/badge/Docker-Containerized-blue?logo=docker)
![Jenkins](https://img.shields.io/badge/Jenkins-CI%2FCD-red?logo=jenkins)
![License](https://img.shields.io/badge/License-MIT-yellow)

---

## Table of Contents

- [Project Overview](#-project-overview)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Quick Start](#-quick-start)
- [Docker Setup](#-docker-setup)
- [Jenkins CI/CD Pipeline](#-jenkins-cicd-pipeline)
- [API Endpoints](#-api-endpoints)
- [Testing](#-testing)
- [Architecture](#-architecture)
- [Troubleshooting](#-troubleshooting)

---

## Project Overview

This project provides a fully configured DevOps environment that includes:

| Component | Description |
|-----------|-------------|
| **Web Application** | Node.js + Express.js web app with EJS templating |
| **Dockerfile** | Multi-stage build for optimized production images |
| **Docker Compose** | Orchestrates app + Jenkins containers |
| **Jenkinsfile** | Declarative pipeline with 7 automated stages |
| **Unit Tests** | Jest + Supertest for API testing |
| **Health Checks** | Built-in health monitoring for Docker & Jenkins |

---

## Project Structure

```
devops-cicd-pipeline/
├── src/
│ ├── app.js # Express.js application entry point
│ ├── views/
│ │ └── index.ejs # Home page template
│ └── public/
│ └── css/
│ └── style.css # Application styles
├── tests/
│ └── app.test.js # Unit tests (Jest + Supertest)
├── Dockerfile # Multi-stage Docker build
├── docker-compose.yml # Docker Compose orchestration
├── Jenkinsfile # CI/CD pipeline configuration
├── .dockerignore # Docker build exclusions
├── .gitignore # Git exclusions
├── package.json # Node.js dependencies & scripts
└── README.md # This file
```

---

## Prerequisites

Make sure you have the following installed:

- **Node.js** (v18 or later) — [Download](https://nodejs.org/)
- **Docker** (v20 or later) — [Download](https://www.docker.com/get-started)
- **Docker Compose** (v2 or later) — Included with Docker Desktop
- **Jenkins** (optional, for CI/CD) — [Download](https://www.jenkins.io/)

---

## Quick Start

### 1. Clone the repository

```bash
git clone https://github.com/MoaazMohamed/devops-cicd-pipeline.git
cd devops-cicd-pipeline
```

### 2. Install dependencies

```bash
npm install
```

### 3. Run locally

```bash
npm start
```

Open your browser at **http://localhost:3000**

### 4. Run tests

```bash
npm test
```

---

## Docker Setup

### Build and Run with Docker

```bash
# Build the Docker image
docker build -t devops-cicd-app:latest .

# Run the container
docker run -d \
 --name devops-app \
 -p 3000:3000 \
 -e NODE_ENV=production \
 devops-cicd-app:latest

# Check if the container is running
docker ps

# View container logs
docker logs devops-app

# Check the health status
curl http://localhost:3000/health
```

### Build and Run with Docker Compose

```bash
# Start all services (app + Jenkins)
docker-compose up -d

# Check running services
docker-compose ps

# View logs
docker-compose logs -f app

# Stop all services
docker-compose down
```

### Docker Image Details

The Dockerfile uses a **multi-stage build** for optimal image size and security:

| Stage | Purpose |
|-------|---------|
| **Builder** | Installs all dependencies, runs tests |
| **Production** | Only production dependencies, non-root user |

**Security features:**
- Runs as non-root user (`appuser`)
- Only production dependencies in final image
- Built-in health check
- Alpine-based (minimal attack surface)

---

## Jenkins CI/CD Pipeline

### Pipeline Stages

```
 Checkout → Install → Quality → Test → Build → Deploy → Verify
```

| Stage | Description |
|-------|-------------|
| **1. Checkout** | Clones the repository from Git |
| **2. Install Dependencies** | Runs `npm ci` for clean install |
| **3. Code Quality** | Runs `npm audit` for security checks |
| **4. Test** | Executes unit tests with Jest |
| **5. Build Docker Image** | Builds production Docker image |
| **6. Deploy** | Stops old container, starts new one |
| **7. Verify Deployment** | Health check to confirm deployment |

### Setting Up Jenkins

1. **Access Jenkins** at `http://localhost:8080`

2. **Get the initial admin password:**
 ```bash
 docker exec devops-jenkins cat /var/jenkins_home/secrets/initialAdminPassword
 ```

3. **Install suggested plugins** + the following:
 - Docker Pipeline
 - NodeJS Plugin
 - Git Plugin

4. **Create a new Pipeline job:**
 - Go to **New Item** → **Pipeline**
 - Under **Pipeline**, select **Pipeline script from SCM**
 - Set **SCM** to **Git**
 - Enter the repository URL
 - Set the script path to `Jenkinsfile`
 - Save and click **Build Now**

### Pipeline Configuration

The pipeline includes these features:
- **30-minute timeout** — prevents hung builds
- **No concurrent builds** — avoids conflicts
- **Build log rotation** — keeps last 10 builds
- **Timestamps** — for debugging

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | Home page with dashboard |
| `GET` | `/health` | Health check (JSON) |
| `GET` | `/api/info` | Application information (JSON) |

### Example Responses

**GET /health**
```json
{
 "status": "healthy",
 "uptime": 123.456,
 "timestamp": "2026-11-06T01:00:00.000Z",
 "version": "1.0.0"
}
```

**GET /api/info**
```json
{
 "name": "devops-cicd-pipeline",
 "version": "1.0.0",
 "description": "A simple web application demonstrating Docker & Jenkins CI/CD",
 "environment": "production",
 "nodeVersion": "v20.x.x",
 "platform": "linux",
 "architecture": "x64"
}
```

---

## Testing

The project uses **Jest** and **Supertest** for automated testing.

```bash
# Run tests
npm test

# Run tests with coverage report
npm run test:coverage
```

### Test Coverage

| Test Suite | Tests | Description |
|------------|-------|-------------|
| Home Page | 2 | Verifies page renders with correct content |
| Health Check | 2 | Validates health endpoint response |
| API Info | 2 | Checks application info endpoint |
| 404 Handling | 1 | Ensures unknown routes return 404 |

---

## Architecture

```
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ Developer │────▶│ GitHub │────▶│ Jenkins │
│ (Push) │ │ (SCM) │ │ (CI/CD) │
└──────────────┘ └──────────────┘ └──────┬───────┘
                                                  │
                                          ┌───────▼───────┐
                                          │  Build & Test  │
                                          │  Docker Image  │
                                          └───────┬───────┘
                                                  │
                                          ┌───────▼───────┐
                                          │    Deploy      │
                                          │   Container    │
                                          └───────┬───────┘
                                                  │
                                          ┌───────▼───────┐
                                          │   Running      │
                                          │   App :3000    │
                                          └───────────────┘
```

---

## Troubleshooting

### Common Issues

**Port 3000 is already in use:**
```bash
# Find the process using port 3000
netstat -ano | findstr :3000
# Kill the process
taskkill /PID <PID> /F
```

**Docker build fails:**
```bash
# Clear Docker cache and rebuild
docker system prune -f
docker build --no-cache -t devops-cicd-app:latest .
```

**Jenkins can't access Docker:**
```bash
# Add Jenkins user to docker group (Linux)
sudo usermod -aG docker jenkins
sudo systemctl restart jenkins
```

---

## License

This project is licensed under the MIT License.

---

## Author

**Moaaz Mohamed** 
 MoaazMoh@icloud.com

---

> Built with and automation
