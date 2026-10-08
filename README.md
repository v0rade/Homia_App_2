# Homia OS

![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue)
![Prisma](https://img.shields.io/badge/Prisma-5.14-blue)
![Next.js](https://img.shields.io/badge/Next.js-14-black)

Homia OS is a production-grade SaaS property management platform. It allows property owners to manage boarding houses, apartments, and commercial spaces efficiently.

## Features
- 🏢 Multi-property Management
- 👥 Role-based Access Control (Super Admin, Property Owner, Staff, Tenant)
- 🛏️ Room & Lease Management
- 💰 Automated Invoicing & Payment Verification
- 🛠️ Maintenance Ticketing System
- 📊 Utility Tracking
- 🔔 Notification System
- 🔑 Access Code Generation

## Tech Stack
- **Monorepo**: Turborepo
- **Database**: PostgreSQL (Prisma ORM)
- **Cache & Jobs**: Redis
- **Backend API**: Node.js / Express / NestJS (Configurable)
- **Frontend Web**: Next.js
- **Validation**: Zod
- **Infrastructure**: Docker & Docker Compose

## Architecture Diagram

```ascii
+----------------+        +-----------------+
|   Web Client   | <----> |     API App     |
|   (Next.js)    |        | (Node.js/Nest)  |
+----------------+        +-----------------+
                                |  |
       +------------------------+  +----------------------+
       |                                                  |
       v                                                  v
+----------------+                              +-----------------+
|  PostgreSQL    |                              |      Redis      |
|  (Database)    |                              | (Cache / Jobs)  |
+----------------+                              +-----------------+
```

## Getting Started

### Quick Start with Docker
```bash
docker-compose up -d
```

### Manual Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Setup environment variables:
   ```bash
   cp .env.example .env
   ```
3. Generate Prisma client & migrate:
   ```bash
   npm run db:generate
   npm run db:migrate
   ```
4. Seed database:
   ```bash
   npm run db:seed
   ```
5. Start development server:
   ```bash
   npm run dev
   ```

## Default Credentials
- **Super Admin**: `admin@homia-os.com` / `Admin123!`
- **Property Owner**: `owner1@homia.com` / `Admin123!`
- **Tenant**: `tenant1@homia.com` / `Admin123!`

## Project Structure
```text
homia-os/
├── apps/
│   ├── api/          # Backend API application
│   └── web/          # Frontend Web application
├── packages/
│   ├── database/     # Prisma schema and client
│   ├── types/        # Shared TypeScript types
│   └── validation/   # Shared Zod validation schemas
├── docker-compose.yml
└── package.json
```

## Contributing
Please read the contribution guidelines before opening a pull request.
