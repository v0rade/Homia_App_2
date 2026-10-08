import { z } from 'zod';

export const LoginDto = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const RegisterDto = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2),
  phone: z.string().optional(),
});

export const CreatePropertyDto = z.object({
  name: z.string(),
  address: z.string(),
  city: z.string(),
  province: z.string(),
  country: z.string(),
  postalCode: z.string(),
  type: z.enum(['BOARDING_HOUSE', 'APARTMENT', 'HOUSE', 'COMMERCIAL']),
  totalFloors: z.number().int().positive(),
  description: z.string().optional(),
});

export const UpdatePropertyDto = CreatePropertyDto.partial();

export const CreateRoomDto = z.object({
  propertyId: z.string(),
  number: z.string(),
  floor: z.number().int(),
  type: z.enum(['SINGLE', 'DOUBLE', 'SUITE', 'STUDIO']),
  monthlyPrice: z.number().positive(),
  description: z.string().optional(),
});

export const UpdateRoomDto = CreateRoomDto.partial();

export const CreateTenantDto = z.object({
  userId: z.string(),
  propertyId: z.string(),
  fullName: z.string(),
  email: z.string().email(),
  phone: z.string(),
});

export const UpdateTenantDto = CreateTenantDto.partial();

export const CreateLeaseDto = z.object({
  tenantId: z.string(),
  roomId: z.string(),
  propertyId: z.string(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  monthlyRent: z.number().positive(),
  deposit: z.number().nonnegative(),
});

export const GenerateInvoiceDto = z.object({
  leaseId: z.string(),
  periodMonth: z.number().int().min(1).max(12),
  periodYear: z.number().int(),
});

export const CreatePaymentDto = z.object({
  invoiceId: z.string(),
  amount: z.number().positive(),
  method: z.enum(['CASH', 'BANK_TRANSFER', 'EWALLET', 'GATEWAY', 'MANUAL']),
});

export const VerifyPaymentDto = z.object({
  status: z.enum(['VERIFIED', 'REJECTED']),
  rejectionReason: z.string().optional(),
});

export const CreateMaintenanceTicketDto = z.object({
  roomId: z.string(),
  propertyId: z.string(),
  title: z.string(),
  description: z.string(),
  category: z.enum(['AC', 'PLUMBING', 'ELECTRICAL', 'INTERNET', 'DOOR', 'WINDOW', 'FURNITURE', 'CLEANING', 'OTHER']),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']),
});

export const UpdateMaintenanceTicketDto = CreateMaintenanceTicketDto.partial();

export const CreateAnnouncementDto = z.object({
  title: z.string(),
  content: z.string(),
  targetType: z.enum(['ALL', 'PROPERTY', 'FLOOR', 'ROOM']),
  targetValue: z.string().optional(),
  propertyId: z.string().optional(),
});

export const GenerateAccessCodeDto = z.object({
  roomId: z.string(),
  validFrom: z.string().datetime(),
  validUntil: z.string().datetime(),
});
