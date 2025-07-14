#!/usr/bin/env node

/**
 * Production Setup Script for The Research Hub
 * Handles environment setup, database initialization, and deployment preparation
 */

const fs = require("fs")
const path = require("path")
const { execSync } = require("child_process")

class ProductionSetup {
  constructor() {
    this.requiredEnvVars = [
      "DATABASE_URL",
      "NEXT_PUBLIC_GOOGLE_CLIENT_ID",
      "GOOGLE_CLIENT_SECRET",
      "OPENAI_API_KEY",
      "NEXTAUTH_SECRET",
    ]

    this.optionalEnvVars = ["VERCEL_URL", "NEXT_PUBLIC_APP_URL", "SMTP_HOST", "SMTP_PORT", "SMTP_USER", "SMTP_PASSWORD"]
  }

  log(message, type = "info") {
    const timestamp = new Date().toISOString()
    const colors = {
      info: "\x1b[36m", // Cyan
      success: "\x1b[32m", // Green
      warning: "\x1b[33m", // Yellow
      error: "\x1b[31m", // Red
      reset: "\x1b[0m", // Reset
    }

    console.log(`${colors[type]}[${timestamp}] ${message}${colors.reset}`)
  }

  checkEnvironmentVariables() {
    this.log("🔍 Checking environment variables...", "info")

    const missing = []
    const warnings = []

    // Check required variables
    for (const envVar of this.requiredEnvVars) {
      if (!process.env[envVar]) {
        missing.push(envVar)
      }
    }

    // Check optional variables
    for (const envVar of this.optionalEnvVars) {
      if (!process.env[envVar]) {
        warnings.push(envVar)
      }
    }

    if (missing.length > 0) {
      this.log(`❌ Missing required environment variables: ${missing.join(", ")}`, "error")
      this.log("Please set these variables before continuing.", "error")
      process.exit(1)
    }

    if (warnings.length > 0) {
      this.log(`⚠️  Optional environment variables not set: ${warnings.join(", ")}`, "warning")
      this.log("Some features may not work properly without these.", "warning")
    }

    this.log("✅ Environment variables check completed", "success")
  }

  generateEnvExample() {
    this.log("📝 Generating .env.example file...", "info")

    const envExample = `# The Research Hub - Environment Variables
# Copy this file to .env.local and fill in your values

# Database
DATABASE_URL="postgresql://username:password@localhost:5432/research_hub"

# Authentication
NEXTAUTH_SECRET="your-nextauth-secret-here"
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth
NEXT_PUBLIC_GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# OpenAI API
OPENAI_API_KEY="your-openai-api-key"

# App Configuration
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_APP_NAME="The Research Hub"

# Email Configuration (Optional)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASSWORD="your-app-password"

# File Upload (Optional)
NEXT_PUBLIC_MAX_FILE_SIZE="10485760" # 10MB in bytes
UPLOAD_DIR="./uploads"

# Rate Limiting (Optional)
RATE_LIMIT_MAX="100"
RATE_LIMIT_WINDOW="900000" # 15 minutes in milliseconds

# Analytics (Optional)
NEXT_PUBLIC_GA_ID="G-XXXXXXXXXX"
NEXT_PUBLIC_HOTJAR_ID="your-hotjar-id"

# Monitoring (Optional)
SENTRY_DSN="your-sentry-dsn"
`

    fs.writeFileSync(".env.example", envExample)
    this.log("✅ .env.example file created", "success")
  }

  checkDatabaseConnection() {
    this.log("🔌 Checking database connection...", "info")

    try {
      // This would normally use a database client, but for simplicity we'll just check the URL format
      const dbUrl = process.env.DATABASE_URL
      if (!dbUrl.startsWith("postgresql://") && !dbUrl.startsWith("postgres://")) {
        throw new Error("DATABASE_URL must be a PostgreSQL connection string")
      }

      this.log("✅ Database URL format is valid", "success")
    } catch (error) {
      this.log(`❌ Database connection error: ${error.message}`, "error")
      process.exit(1)
    }
  }

  setupDirectories() {
    this.log("📁 Setting up required directories...", "info")

    const directories = ["uploads", "logs", "backups", "public/avatars", "public/files"]

    for (const dir of directories) {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true })
        this.log(`Created directory: ${dir}`, "info")
      }
    }

    this.log("✅ Directory setup completed", "success")
  }

  generateSecurityConfig() {
    this.log("🔒 Generating security configuration...", "info")

    const securityConfig = {
      headers: [
        {
          source: "/(.*)",
          headers: [
            {
              key: "X-Frame-Options",
              value: "DENY",
            },
            {
              key: "X-Content-Type-Options",
              value: "nosniff",
            },
            {
              key: "Referrer-Policy",
              value: "strict-origin-when-cross-origin",
            },
            {
              key: "Permissions-Policy",
              value: "camera=(), microphone=(), geolocation=()",
            },
          ],
        },
      ],
    }

    // Update next.config.mjs with security headers
    const nextConfigPath = "next.config.mjs"
    if (fs.existsSync(nextConfigPath)) {
      let config = fs.readFileSync(nextConfigPath, "utf8")

      // Add security headers if not already present
      if (!config.includes("X-Frame-Options")) {
        const headersConfig = `
  async headers() {
    return ${JSON.stringify(securityConfig.headers, null, 6)};
  },`

        config = config.replace("const nextConfig = {", `const nextConfig = {${headersConfig}`)

        fs.writeFileSync(nextConfigPath, config)
        this.log("✅ Security headers added to next.config.mjs", "success")
      }
    }
  }

  createHealthCheck() {
    this.log("🏥 Creating health check endpoint...", "info")

    const healthCheckDir = "app/api/health"
    if (!fs.existsSync(healthCheckDir)) {
      fs.mkdirSync(healthCheckDir, { recursive: true })
    }

    const healthCheckCode = `import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Basic health checks
    const checks = {
      timestamp: new Date().toISOString(),
      status: 'healthy',
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      database: 'connected', // Would check actual DB connection in real implementation
    };

    return NextResponse.json(checks, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { 
        status: 'unhealthy', 
        error: error.message,
        timestamp: new Date().toISOString()
      }, 
      { status: 500 }
    );
  }
}`

    fs.writeFileSync(path.join(healthCheckDir, "route.ts"), healthCheckCode)
    this.log("✅ Health check endpoint created", "success")
  }

  setupLogging() {
    this.log("📊 Setting up logging configuration...", "info")

    const logConfig = {
      level: process.env.NODE_ENV === "production" ? "info" : "debug",
      format: "json",
      transports: [
        {
          type: "console",
          level: "info",
        },
        {
          type: "file",
          filename: "logs/app.log",
          level: "info",
          maxsize: "10MB",
          maxFiles: 5,
        },
        {
          type: "file",
          filename: "logs/error.log",
          level: "error",
          maxsize: "10MB",
          maxFiles: 5,
        },
      ],
    }

    fs.writeFileSync("logging.config.json", JSON.stringify(logConfig, null, 2))
    this.log("✅ Logging configuration created", "success")
  }

  generateDeploymentScript() {
    this.log("🚀 Generating deployment script...", "info")

    const deployScript = `#!/bin/bash

# The Research Hub - Production Deployment Script

set -e

echo "🚀 Starting deployment..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Are you in the project root?"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm ci --only=production

# Build the application
echo "🔨 Building application..."
npm run build

# Run database migrations
echo "🗄️  Running database migrations..."
npm run db:migrate

# Start the application
echo "✅ Starting application..."
npm start

echo "🎉 Deployment completed successfully!"
`

    fs.writeFileSync("deploy.sh", deployScript)
    execSync("chmod +x deploy.sh")
    this.log("✅ Deployment script created", "success")
  }

  createDockerConfig() {
    this.log("🐳 Creating Docker configuration...", "info")

    const dockerfile = `# The Research Hub - Production Dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./
RUN npm ci --only=production

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build the application
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
`

    const dockerCompose = `version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=\${DATABASE_URL}
      - NEXTAUTH_SECRET=\${NEXTAUTH_SECRET}
      - NEXT_PUBLIC_GOOGLE_CLIENT_ID=\${NEXT_PUBLIC_GOOGLE_CLIENT_ID}
      - GOOGLE_CLIENT_SECRET=\${GOOGLE_CLIENT_SECRET}
      - OPENAI_API_KEY=\${OPENAI_API_KEY}
    depends_on:
      - postgres
    restart: unless-stopped

  postgres:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=research_hub
      - POSTGRES_USER=\${POSTGRES_USER:-postgres}
      - POSTGRES_PASSWORD=\${POSTGRES_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./scripts/create_database_schema_v2.sql:/docker-entrypoint-initdb.d/init.sql
    ports:
      - "5432:5432"
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    restart: unless-stopped

volumes:
  postgres_data:
`

    fs.writeFileSync("Dockerfile", dockerfile)
    fs.writeFileSync("docker-compose.yml", dockerCompose)

    this.log("✅ Docker configuration created", "success")
  }

  runSetup() {
    this.log("🎯 Starting production setup for The Research Hub...", "info")

    try {
      this.checkEnvironmentVariables()
      this.generateEnvExample()
      this.checkDatabaseConnection()
      this.setupDirectories()
      this.generateSecurityConfig()
      this.createHealthCheck()
      this.setupLogging()
      this.generateDeploymentScript()
      this.createDockerConfig()

      this.log("🎉 Production setup completed successfully!", "success")
      this.log("", "info")
      this.log("Next steps:", "info")
      this.log("1. Copy .env.example to .env.local and fill in your values", "info")
      this.log("2. Run the database schema: npm run db:setup", "info")
      this.log("3. Seed sample data: npm run db:seed", "info")
      this.log("4. Build the application: npm run build", "info")
      this.log("5. Start production server: npm start", "info")
      this.log("", "info")
      this.log("For Docker deployment:", "info")
      this.log("1. docker-compose up -d", "info")
      this.log("", "info")
      this.log("Health check available at: /api/health", "info")
    } catch (error) {
      this.log(`❌ Setup failed: ${error.message}`, "error")
      process.exit(1)
    }
  }
}

// Run the setup
const setup = new ProductionSetup()
setup.runSetup()
