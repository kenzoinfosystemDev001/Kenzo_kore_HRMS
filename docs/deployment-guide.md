# Kenzo HRMS - Deployment Guide

This guide covers the setup and deployment of Kenzo HRMS for both local development and production environments.

## 1. Prerequisites
- **Node.js**: v20.x or higher
- **Package Manager**: pnpm v9.x or higher
- **Docker & Docker Compose**: For local services and containerization
- **PostgreSQL**: v16+ (Local or Managed, e.g., Neon)
- **Redis**: v7+ (For caching and queues)

## 2. Local Development Setup

We use Docker Compose to spin up local infrastructure dependencies.

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-org/kenzo-hrms.git
   cd kenzo-hrms
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   ```

3. **Start local infrastructure (DB & Redis):**
   ```bash
   docker-compose -f docker-compose.dev.yml up -d
   ```

4. **Environment Variables:**
   Copy the example env files for both frontend and backend.
   ```bash
   cp apps/api/.env.example apps/api/.env
   cp apps/web/.env.example apps/web/.env
   ```

5. **Database Setup:**
   Run Prisma migrations to set up the schema.
   ```bash
   cd apps/api
   npx prisma migrate dev
   npx prisma db seed
   ```

6. **Run the application:**
   From the project root:
   ```bash
   pnpm run dev
   ```
   - API runs on `http://localhost:3001`
   - Web app runs on `http://localhost:3000`

## 3. Production Deployment

### 3.1 Database (Neon PostgreSQL)
1. Create a project in Neon.
2. Obtain the connection string (Connection pooling enabled).
3. Set `DATABASE_URL` in your production environment variables.
4. Run migrations during the CI/CD deployment phase: `npx prisma migrate deploy`.

### 3.2 Backend Deployment (Docker)
The NestJS backend is containerized.
1. Build the image:
   ```bash
   docker build -t kenzo-api -f apps/api/Dockerfile .
   ```
2. Deploy to AWS ECS, Google Cloud Run, or a Kubernetes cluster.
3. Ensure environment variables (`JWT_SECRET`, `DATABASE_URL`, `REDIS_URL`) are securely injected via Secrets Manager.

### 3.3 Frontend Deployment (Vercel)
The Next.js application is optimized for Vercel.
1. Connect the GitHub repository to Vercel.
2. Set the Root Directory to `apps/web`.
3. Configure build command: `pnpm run build`.
4. Add environment variables (e.g., `NEXT_PUBLIC_API_URL`).
5. Deploy.

## 4. CI/CD Pipeline
We use GitHub Actions for continuous integration and deployment.

- **PR Checks:** On every PR, the pipeline runs linting (`pnpm lint`), type checking, unit tests (`pnpm test`), and E2E tests.
- **Deploy to Staging:** Merges to `develop` trigger automatic deployments to the staging environment.
- **Deploy to Prod:** Tagging a release (e.g., `v1.0.0`) builds production Docker images and triggers the production deployment webhooks.

## 5. Monitoring & Observability
- **Logs:** Centralized logging using Datadog or ELK stack.
- **APM:** New Relic or Datadog APM for backend performance monitoring.
- **Errors:** Sentry integrated into both Next.js frontend and NestJS backend for real-time error tracking.
- **Uptime:** BetterUptime or Pingdom for health check monitoring (`/api/v1/health`).
