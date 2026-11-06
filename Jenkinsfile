// ─────────────────────────────────────────────────────────
//  Jenkinsfile — DevOps CI/CD Pipeline
// ─────────────────────────────────────────────────────────
//  Declarative pipeline for building, testing, and deploying
//  the Dockerized Node.js web application.
// ─────────────────────────────────────────────────────────

pipeline {
    agent any

    environment {
        APP_NAME        = 'devops-cicd-pipeline'
        DOCKER_IMAGE    = 'devops-cicd-app'
        DOCKER_TAG      = "${env.BUILD_NUMBER}"
        CONTAINER_NAME  = 'devops-app'
        APP_PORT        = '3000'
    }

    options {
        timeout(time: 30, unit: 'MINUTES')
        disableConcurrentBuilds()
        buildDiscarder(logRotator(numToKeepStr: '10'))
        timestamps()
    }

    stages {
        // ── Stage 1: Checkout ────────────────────────────
        stage('Checkout') {
            steps {
                echo '📥 Checking out source code...'
                checkout scm
                echo "📋 Build Number: ${env.BUILD_NUMBER}"
                echo "📋 Branch: ${env.BRANCH_NAME ?: 'N/A'}"
            }
        }

        // ── Stage 2: Install Dependencies ────────────────
        stage('Install Dependencies') {
            steps {
                echo '📦 Installing Node.js dependencies...'
                sh 'npm ci'
            }
        }

        // ── Stage 3: Lint & Code Quality ─────────────────
        stage('Code Quality') {
            steps {
                echo '🔍 Running code quality checks...'
                sh 'npm audit --audit-level=high || true'
            }
        }

        // ── Stage 4: Run Tests ───────────────────────────
        stage('Test') {
            steps {
                echo '🧪 Running unit tests...'
                sh 'npm test'
            }
            post {
                always {
                    echo '📊 Test stage completed.'
                }
                failure {
                    echo '❌ Tests failed! Aborting pipeline.'
                }
            }
        }

        // ── Stage 5: Build Docker Image ──────────────────
        stage('Build Docker Image') {
            steps {
                echo '🐳 Building Docker image...'
                sh """
                    docker build \
                        -t ${DOCKER_IMAGE}:${DOCKER_TAG} \
                        -t ${DOCKER_IMAGE}:latest \
                        --build-arg APP_VERSION=${DOCKER_TAG} \
                        .
                """
                echo "✅ Docker image built: ${DOCKER_IMAGE}:${DOCKER_TAG}"
            }
        }

        // ── Stage 6: Deploy ──────────────────────────────
        stage('Deploy') {
            steps {
                echo '🚀 Deploying application...'
                sh """
                    # Stop and remove existing container (if any)
                    docker stop ${CONTAINER_NAME} || true
                    docker rm ${CONTAINER_NAME} || true

                    # Run new container
                    docker run -d \
                        --name ${CONTAINER_NAME} \
                        -p ${APP_PORT}:3000 \
                        -e NODE_ENV=production \
                        -e APP_VERSION=${DOCKER_TAG} \
                        --restart unless-stopped \
                        ${DOCKER_IMAGE}:${DOCKER_TAG}
                """
                echo "✅ Application deployed on port ${APP_PORT}"
            }
        }

        // ── Stage 7: Verify Deployment ───────────────────
        stage('Verify Deployment') {
            steps {
                echo '🔍 Verifying deployment...'
                sh """
                    # Wait for the container to start
                    sleep 5

                    # Check if container is running
                    docker ps | grep ${CONTAINER_NAME}

                    # Health check
                    curl -f http://localhost:${APP_PORT}/health || exit 1

                    echo '✅ Deployment verified successfully!'
                """
            }
        }
    }

    post {
        success {
            echo """
            ╔══════════════════════════════════════════════╗
            ║  ✅ PIPELINE COMPLETED SUCCESSFULLY!         ║
            ║                                              ║
            ║  App:   ${APP_NAME}                          ║
            ║  Image: ${DOCKER_IMAGE}:${DOCKER_TAG}        ║
            ║  URL:   http://localhost:${APP_PORT}          ║
            ╚══════════════════════════════════════════════╝
            """
        }
        failure {
            echo """
            ╔══════════════════════════════════════════════╗
            ║  ❌ PIPELINE FAILED!                         ║
            ║                                              ║
            ║  Check the logs for details.                 ║
            ╚══════════════════════════════════════════════╝
            """
        }
        always {
            echo '🧹 Cleaning up workspace...'
            cleanWs()
        }
    }
}
