import { PrismaClient, UserRole, PropertyType, RoomType, RoomStatus, LeaseStatus, InvoiceStatus, InvoiceItemType, PaymentMethod, PaymentStatus, UtilityType, MaintenanceCategory, Priority, MaintenanceStatus, NotificationType, TargetType, AccessAction } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seeding...');
  
  await prisma.auditLog.deleteMany();
  await prisma.accessLog.deleteMany();
  await prisma.accessCode.deleteMany();
  await prisma.announcement.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.maintenanceComment.deleteMany();
  await prisma.maintenanceTicket.deleteMany();
  await prisma.utilityReading.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.invoiceItem.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.lease.deleteMany();
  await prisma.tenant.deleteMany();
  await prisma.room.deleteMany();
  await prisma.property.deleteMany();
  await prisma.user.deleteMany();

  const password = await bcrypt.hash('Admin123!', 12);

  const admin = await prisma.user.create({
    data: { email: 'admin@homia-os.com', password, name: 'Super Admin', role: UserRole.SUPER_ADMIN }
  });

  const owner1 = await prisma.user.create({ data: { email: 'owner1@homia.com', password, name: 'Budi Owner', role: UserRole.PROPERTY_OWNER, phone: '0811111111' }});
  const owner2 = await prisma.user.create({ data: { email: 'owner2@homia.com', password, name: 'Siti Owner', role: UserRole.PROPERTY_OWNER, phone: '0822222222' }});
  
  const staff1 = await prisma.user.create({ data: { email: 'staff1@homia.com', password, name: 'Andi Staff', role: UserRole.STAFF, phone: '0833333333' }});
  const staff2 = await prisma.user.create({ data: { email: 'staff2@homia.com', password, name: 'Rina Staff', role: UserRole.STAFF, phone: '0844444444' }});

  const tenantUsers = [];
  for (let i = 1; i <= 6; i++) {
    tenantUsers.push(await prisma.user.create({
      data: { email: `tenant${i}@homia.com`, password, name: `Tenant ${i}`, role: UserRole.TENANT, phone: `085555555${i}` }
    }));
  }

  const prop1 = await prisma.property.create({
    data: {
      name: 'Homia Stay Menteng', address: 'Jl. Menteng Raya 1', city: 'Jakarta Pusat', province: 'DKI Jakarta', country: 'Indonesia', postalCode: '10310', type: PropertyType.BOARDING_HOUSE, totalFloors: 3, ownerId: owner1.id,
    }
  });

  const prop2 = await prisma.property.create({
    data: {
      name: 'Homia Stay Kemang', address: 'Jl. Kemang Raya 2', city: 'Jakarta Selatan', province: 'DKI Jakarta', country: 'Indonesia', postalCode: '12730', type: PropertyType.APARTMENT, totalFloors: 5, ownerId: owner2.id,
    }
  });

  const roomsProp1 = [];
  for (let i = 1; i <= 6; i++) {
    roomsProp1.push(await prisma.room.create({
      data: { propertyId: prop1.id, number: `10${i}`, floor: 1, type: i % 2 === 0 ? RoomType.DOUBLE : RoomType.SINGLE, status: RoomStatus.AVAILABLE, monthlyPrice: 2500000 + (i * 100000) }
    }));
  }

  const roomsProp2 = [];
  for (let i = 1; i <= 6; i++) {
    roomsProp2.push(await prisma.room.create({
      data: { propertyId: prop2.id, number: `20${i}`, floor: 2, type: i % 2 === 0 ? RoomType.SUITE : RoomType.STUDIO, status: RoomStatus.AVAILABLE, monthlyPrice: 4000000 + (i * 200000) }
    }));
  }

  const tenants = [];
  for (let i = 0; i < 3; i++) {
    tenants.push(await prisma.tenant.create({
      data: { userId: tenantUsers[i].id, propertyId: prop1.id, fullName: tenantUsers[i].name, email: tenantUsers[i].email, phone: tenantUsers[i].phone || '' }
    }));
  }
  for (let i = 3; i < 6; i++) {
    tenants.push(await prisma.tenant.create({
      data: { userId: tenantUsers[i].id, propertyId: prop2.id, fullName: tenantUsers[i].name, email: tenantUsers[i].email, phone: tenantUsers[i].phone || '' }
    }));
  }

  const leases = [];
  const now = new Date();
  const nextYear = new Date();
  nextYear.setFullYear(now.getFullYear() + 1);

  for (let i = 0; i < 4; i++) {
    const room = i < 2 ? roomsProp1[i] : roomsProp2[i - 2];
    await prisma.room.update({ where: { id: room.id }, data: { status: RoomStatus.OCCUPIED } });
    
    leases.push(await prisma.lease.create({
      data: {
        tenantId: tenants[i].id, roomId: room.id, propertyId: room.propertyId, startDate: now, endDate: nextYear, monthlyRent: room.monthlyPrice, deposit: room.monthlyPrice, status: LeaseStatus.ACTIVE
      }
    }));
  }

  for (let i = 0; i < 8; i++) {
    const lease = leases[i % 4];
    const inv = await prisma.invoice.create({
      data: {
        invoiceNumber: `INV-${Date.now()}-${i}`, tenantId: lease.tenantId, leaseId: lease.id, propertyId: lease.propertyId, roomId: lease.roomId, periodMonth: now.getMonth() + 1, periodYear: now.getFullYear(), dueDate: new Date(now.getFullYear(), now.getMonth() + 1, 10), subtotal: lease.monthlyRent, total: lease.monthlyRent, status: i % 3 === 0 ? InvoiceStatus.PAID : i % 3 === 1 ? InvoiceStatus.PENDING : InvoiceStatus.OVERDUE
      }
    });

    await prisma.invoiceItem.create({
      data: { invoiceId: inv.id, type: InvoiceItemType.RENT, description: 'Monthly Rent', unitPrice: lease.monthlyRent, amount: lease.monthlyRent }
    });
    
    if (i % 2 === 0) {
      await prisma.invoiceItem.create({
        data: { invoiceId: inv.id, type: InvoiceItemType.ELECTRICITY, description: 'Electricity', unitPrice: 1500, quantity: 100, amount: 150000 }
      });
      await prisma.invoice.update({ where: { id: inv.id }, data: { subtotal: inv.subtotal + 150000, total: inv.total + 150000 } });
    }

    if (inv.status === InvoiceStatus.PAID) {
      await prisma.payment.create({
        data: { paymentNumber: `PAY-${Date.now()}-${i}`, invoiceId: inv.id, tenantId: inv.tenantId, amount: inv.total, method: PaymentMethod.BANK_TRANSFER, status: PaymentStatus.VERIFIED, verifiedById: admin.id, verifiedAt: new Date() }
      });
    }
  }

  for (let i = 0; i < 4; i++) {
    await prisma.utilityReading.create({
      data: { roomId: leases[i].roomId, propertyId: leases[i].propertyId, type: UtilityType.ELECTRICITY, previousReading: 1000, currentReading: 1100, usage: 100, unitPrice: 1500, amount: 150000, readingDate: now, periodMonth: now.getMonth() + 1, periodYear: now.getFullYear(), createdById: staff1.id }
    });
  }

  const categories = [MaintenanceCategory.AC, MaintenanceCategory.PLUMBING, MaintenanceCategory.ELECTRICAL];
  const priorities = [Priority.LOW, Priority.MEDIUM, Priority.HIGH];
  const statuses = [MaintenanceStatus.OPEN, MaintenanceStatus.IN_PROGRESS, MaintenanceStatus.RESOLVED];

  for (let i = 0; i < 6; i++) {
    const ticket = await prisma.maintenanceTicket.create({
      data: {
        ticketNumber: `MT-${Date.now()}-${i}`, tenantId: tenants[i % 4].id, roomId: leases[i % 4].roomId, propertyId: leases[i % 4].propertyId, title: `Fix issue ${i}`, description: 'Details about the issue', category: categories[i % 3], priority: priorities[i % 3], status: statuses[i % 3], assignedToId: i % 2 === 0 ? staff1.id : null
      }
    });

    if (i < 4) {
      await prisma.maintenanceComment.create({
        data: { ticketId: ticket.id, authorId: staff1.id, content: 'Will check this tomorrow.' }
      });
    }
  }

  for (let i = 0; i < 8; i++) {
    await prisma.notification.create({
      data: { userId: tenantUsers[i % 6].id, title: 'Invoice Due', message: 'Please pay your invoice.', type: NotificationType.INVOICE }
    });
  }

  await prisma.announcement.create({
    data: { propertyId: prop1.id, title: 'Water Maintenance', content: 'Water will be off tomorrow.', targetType: TargetType.PROPERTY, targetValue: prop1.id, authorId: owner1.id }
  });
  await prisma.announcement.create({
    data: { title: 'System Update', content: 'Homia OS will be updated tonight.', targetType: TargetType.ALL, authorId: admin.id }
  });

  for (let i = 0; i < 3; i++) {
    await prisma.accessCode.create({
      data: { roomId: roomsProp1[i].id, code: `12345${i}`, validFrom: now, validUntil: nextYear, generatedById: admin.id }
    });
  }

  for (let i = 0; i < 10; i++) {
    await prisma.auditLog.create({
      data: { userId: admin.id, action: 'CREATE', entity: 'USER', entityId: tenantUsers[0].id }
    });
  }

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
