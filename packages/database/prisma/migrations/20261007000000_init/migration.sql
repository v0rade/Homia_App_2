-- ============================================================================
-- Homia OS: Initial Schema Migration (PostgreSQL DDL)
-- Migration: 20261007000000_init
-- ============================================================================

-- Create Enums
CREATE TYPE "UserRole" AS ENUM ('SUPER_ADMIN', 'PROPERTY_OWNER', 'STAFF', 'TENANT');
CREATE TYPE "PropertyType" AS ENUM ('BOARDING_HOUSE', 'APARTMENT', 'HOUSE', 'COMMERCIAL');
CREATE TYPE "RoomType" AS ENUM ('SINGLE', 'DOUBLE', 'SUITE', 'STUDIO');
CREATE TYPE "RoomStatus" AS ENUM ('AVAILABLE', 'OCCUPIED', 'RESERVED', 'MAINTENANCE', 'OVERDUE');
CREATE TYPE "IdDocumentType" AS ENUM ('KTP', 'PASSPORT', 'DRIVERS_LICENSE', 'OTHER');
CREATE TYPE "LeaseStatus" AS ENUM ('ACTIVE', 'EXPIRED', 'TERMINATED', 'PENDING');
CREATE TYPE "InvoiceStatus" AS ENUM ('PENDING', 'PAID', 'PARTIAL', 'OVERDUE', 'CANCELLED');
CREATE TYPE "InvoiceItemType" AS ENUM ('RENT', 'ELECTRICITY', 'WATER', 'INTERNET', 'PARKING', 'LATE_FEE', 'DISCOUNT', 'OTHER');
CREATE TYPE "PaymentMethod" AS ENUM ('CASH', 'BANK_TRANSFER', 'EWALLET', 'GATEWAY', 'MANUAL');
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'VERIFIED', 'REJECTED', 'CANCELLED');
CREATE TYPE "UtilityType" AS ENUM ('ELECTRICITY', 'WATER');
CREATE TYPE "MaintenanceCategory" AS ENUM ('AC', 'PLUMBING', 'ELECTRICAL', 'INTERNET', 'DOOR', 'WINDOW', 'FURNITURE', 'CLEANING', 'OTHER');
CREATE TYPE "Priority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');
CREATE TYPE "MaintenanceStatus" AS ENUM ('OPEN', 'IN_PROGRESS', 'WAITING', 'RESOLVED', 'CLOSED');
CREATE TYPE "NotificationType" AS ENUM ('INVOICE', 'PAYMENT', 'LEASE', 'MAINTENANCE', 'ANNOUNCEMENT', 'SYSTEM');
CREATE TYPE "TargetType" AS ENUM ('ALL', 'PROPERTY', 'FLOOR', 'ROOM');
CREATE TYPE "AccessAction" AS ENUM ('ENTER', 'EXIT', 'FAILED', 'GENERATED', 'REVOKED');
CREATE TYPE "JobStatus" AS ENUM ('PENDING', 'RUNNING', 'COMPLETED', 'FAILED');

-- Create Tables

CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL UNIQUE,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "avatar" TEXT,
    "role" "UserRole" NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "refreshToken" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3)
);

CREATE TABLE "Property" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "province" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "postalCode" TEXT NOT NULL,
    "description" TEXT,
    "type" "PropertyType" NOT NULL,
    "totalFloors" INTEGER NOT NULL,
    "amenities" JSONB,
    "coverImage" TEXT,
    "ownerId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3)
);
CREATE INDEX "Property_ownerId_idx" ON "Property"("ownerId");

CREATE TABLE "Room" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "propertyId" TEXT NOT NULL REFERENCES "Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    "number" TEXT NOT NULL,
    "floor" INTEGER NOT NULL,
    "type" "RoomType" NOT NULL,
    "status" "RoomStatus" NOT NULL DEFAULT 'AVAILABLE',
    "monthlyPrice" DOUBLE PRECISION NOT NULL,
    "description" TEXT,
    "amenities" JSONB,
    "images" JSONB,
    "area" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    CONSTRAINT "Room_propertyId_number_key" UNIQUE ("propertyId", "number")
);
CREATE INDEX "Room_propertyId_idx" ON "Room"("propertyId");

CREATE TABLE "Tenant" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL UNIQUE REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    "propertyId" TEXT NOT NULL REFERENCES "Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMP(3),
    "idNumber" TEXT,
    "idType" "IdDocumentType",
    "idDocumentUrl" TEXT,
    "profilePhoto" TEXT,
    "emergencyContact" TEXT,
    "emergencyPhone" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3)
);
CREATE INDEX "Tenant_propertyId_idx" ON "Tenant"("propertyId");

CREATE TABLE "Lease" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tenantId" TEXT NOT NULL REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    "roomId" TEXT NOT NULL REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    "propertyId" TEXT NOT NULL REFERENCES "Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "monthlyRent" DOUBLE PRECISION NOT NULL,
    "deposit" DOUBLE PRECISION NOT NULL,
    "paymentDueDay" INTEGER NOT NULL DEFAULT 10,
    "status" "LeaseStatus" NOT NULL DEFAULT 'ACTIVE',
    "terminationReason" TEXT,
    "renewedFromId" TEXT UNIQUE REFERENCES "Lease"("id") ON DELETE SET NULL ON UPDATE CASCADE,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);
CREATE INDEX "Lease_tenantId_idx" ON "Lease"("tenantId");
CREATE INDEX "Lease_roomId_idx" ON "Lease"("roomId");
CREATE INDEX "Lease_propertyId_idx" ON "Lease"("propertyId");

CREATE TABLE "Invoice" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "invoiceNumber" TEXT NOT NULL UNIQUE,
    "tenantId" TEXT NOT NULL REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    "leaseId" TEXT NOT NULL REFERENCES "Lease"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    "propertyId" TEXT NOT NULL REFERENCES "Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    "roomId" TEXT NOT NULL REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    "periodMonth" INTEGER NOT NULL,
    "periodYear" INTEGER NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "subtotal" DOUBLE PRECISION NOT NULL,
    "discounts" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "lateFee" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "total" DOUBLE PRECISION NOT NULL,
    "status" "InvoiceStatus" NOT NULL DEFAULT 'PENDING',
    "notes" TEXT,
    "billingJobId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Invoice_tenantId_leaseId_periodMonth_periodYear_key" UNIQUE ("tenantId", "leaseId", "periodMonth", "periodYear")
);
CREATE INDEX "Invoice_tenantId_idx" ON "Invoice"("tenantId");
CREATE INDEX "Invoice_leaseId_idx" ON "Invoice"("leaseId");
CREATE INDEX "Invoice_propertyId_idx" ON "Invoice"("propertyId");

CREATE TABLE "InvoiceItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "invoiceId" TEXT NOT NULL REFERENCES "Invoice"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    "type" "InvoiceItemType" NOT NULL,
    "description" TEXT NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL DEFAULT 1,
    "unitPrice" DOUBLE PRECISION NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX "InvoiceItem_invoiceId_idx" ON "InvoiceItem"("invoiceId");

CREATE TABLE "Payment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "paymentNumber" TEXT NOT NULL UNIQUE,
    "invoiceId" TEXT NOT NULL REFERENCES "Invoice"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    "tenantId" TEXT NOT NULL REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    "amount" DOUBLE PRECISION NOT NULL,
    "method" "PaymentMethod" NOT NULL,
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "proofUrl" TEXT,
    "notes" TEXT,
    "verifiedById" TEXT REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE,
    "verifiedAt" TIMESTAMP(3),
    "rejectionReason" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);
CREATE INDEX "Payment_invoiceId_idx" ON "Payment"("invoiceId");
CREATE INDEX "Payment_tenantId_idx" ON "Payment"("tenantId");

CREATE TABLE "UtilityReading" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "roomId" TEXT NOT NULL REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    "propertyId" TEXT NOT NULL REFERENCES "Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    "type" "UtilityType" NOT NULL,
    "previousReading" DOUBLE PRECISION NOT NULL,
    "currentReading" DOUBLE PRECISION NOT NULL,
    "usage" DOUBLE PRECISION NOT NULL,
    "unitPrice" DOUBLE PRECISION NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "readingDate" TIMESTAMP(3) NOT NULL,
    "periodMonth" INTEGER NOT NULL,
    "periodYear" INTEGER NOT NULL,
    "createdById" TEXT NOT NULL REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX "UtilityReading_roomId_idx" ON "UtilityReading"("roomId");
CREATE INDEX "UtilityReading_propertyId_idx" ON "UtilityReading"("propertyId");

CREATE TABLE "MaintenanceTicket" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "ticketNumber" TEXT NOT NULL UNIQUE,
    "tenantId" TEXT REFERENCES "Tenant"("id") ON DELETE SET NULL ON UPDATE CASCADE,
    "roomId" TEXT NOT NULL REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    "propertyId" TEXT NOT NULL REFERENCES "Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" "MaintenanceCategory" NOT NULL,
    "priority" "Priority" NOT NULL,
    "status" "MaintenanceStatus" NOT NULL DEFAULT 'OPEN',
    "images" JSONB,
    "assignedToId" TEXT REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE,
    "estimatedCost" DOUBLE PRECISION,
    "actualCost" DOUBLE PRECISION,
    "resolvedAt" TIMESTAMP(3),
    "closedAt" TIMESTAMP(3),
    "slaHours" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);
CREATE INDEX "MaintenanceTicket_roomId_idx" ON "MaintenanceTicket"("roomId");
CREATE INDEX "MaintenanceTicket_propertyId_idx" ON "MaintenanceTicket"("propertyId");
CREATE INDEX "MaintenanceTicket_tenantId_idx" ON "MaintenanceTicket"("tenantId");
CREATE INDEX "MaintenanceTicket_assignedToId_idx" ON "MaintenanceTicket"("assignedToId");

CREATE TABLE "MaintenanceComment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "ticketId" TEXT NOT NULL REFERENCES "MaintenanceTicket"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    "authorId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    "content" TEXT NOT NULL,
    "images" JSONB,
    "isInternal" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);
CREATE INDEX "MaintenanceComment_ticketId_idx" ON "MaintenanceComment"("ticketId");
CREATE INDEX "MaintenanceComment_authorId_idx" ON "MaintenanceComment"("authorId");

CREATE TABLE "Notification" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "relatedId" TEXT,
    "relatedType" TEXT,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "readAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX "Notification_userId_idx" ON "Notification"("userId");

CREATE TABLE "Announcement" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "propertyId" TEXT REFERENCES "Property"("id") ON DELETE SET NULL ON UPDATE CASCADE,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "targetType" "TargetType" NOT NULL,
    "targetValue" TEXT,
    "publishedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "authorId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);
CREATE INDEX "Announcement_propertyId_idx" ON "Announcement"("propertyId");
CREATE INDEX "Announcement_authorId_idx" ON "Announcement"("authorId");

CREATE TABLE "AccessCode" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "roomId" TEXT NOT NULL REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    "code" TEXT NOT NULL,
    "description" TEXT,
    "validFrom" TIMESTAMP(3) NOT NULL,
    "validUntil" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "generatedById" TEXT NOT NULL REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    "usageCount" INTEGER NOT NULL DEFAULT 0,
    "maxUsage" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);
CREATE INDEX "AccessCode_roomId_idx" ON "AccessCode"("roomId");

CREATE TABLE "AccessLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "accessCodeId" TEXT REFERENCES "AccessCode"("id") ON DELETE SET NULL ON UPDATE CASCADE,
    "roomId" TEXT NOT NULL REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    "userId" TEXT REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE,
    "action" "AccessAction" NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ipAddress" TEXT,
    "deviceInfo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX "AccessLog_roomId_idx" ON "AccessLog"("roomId");
CREATE INDEX "AccessLog_accessCodeId_idx" ON "AccessLog"("accessCodeId");
CREATE INDEX "AccessLog_userId_idx" ON "AccessLog"("userId");

CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE,
    "action" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "oldValues" JSONB,
    "newValues" JSONB,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX "AuditLog_userId_idx" ON "AuditLog"("userId");
CREATE INDEX "AuditLog_entity_entityId_idx" ON "AuditLog"("entity", "entityId");

CREATE TABLE "BillingJob" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "status" "JobStatus" NOT NULL DEFAULT 'PENDING',
    "periodMonth" INTEGER NOT NULL,
    "periodYear" INTEGER NOT NULL,
    "propertyId" TEXT REFERENCES "Property"("id") ON DELETE SET NULL ON UPDATE CASCADE,
    "processedCount" INTEGER NOT NULL DEFAULT 0,
    "failedCount" INTEGER NOT NULL DEFAULT 0,
    "totalAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "error" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX "BillingJob_propertyId_idx" ON "BillingJob"("propertyId");
