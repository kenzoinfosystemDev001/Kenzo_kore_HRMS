import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting full seed...');
  await prisma.$connect();

  // Clean up
  console.log('Cleaning up existing data...');
  // Note: normally you'd want to use truncate or delete in proper order if needed
  
  // 1. Create Tenant
  const tenant = await prisma.tenant.create({
    data: {
      name: 'Kenzo Technologies Demo',
      slug: `kenzo-tech-${Date.now()}`,
      domain: 'kenzotech.local',
    },
  });

  // 2. Create Organization
  const org = await prisma.organization.create({
    data: {
      tenantId: tenant.id,
      name: 'Kenzo Technologies Demo',
      industry: 'Software Development',
    },
  });

  // 3. Create Permissions & Roles
  const permissionsData = [
    { module: 'employees', action: 'read', resource: 'Employee', code: 'employees:read' },
    { module: 'employees', action: 'create', resource: 'Employee', code: 'employees:create' },
    { module: 'employees', action: 'update', resource: 'Employee', code: 'employees:update' },
    { module: 'employees', action: 'delete', resource: 'Employee', code: 'employees:delete' },
    { module: 'attendance', action: 'read', resource: 'Attendance', code: 'attendance:read' },
    { module: 'attendance', action: 'manage', resource: 'Attendance', code: 'attendance:manage' },
    { module: 'leave', action: 'manage', resource: 'Leave', code: 'leave:manage' },
    { module: 'leave', action: 'approve', resource: 'Leave', code: 'leave:approve' },
  ];

  const permissions = [];
  for (const p of permissionsData) {
    const existing = await prisma.permission.findUnique({ where: { code: p.code } });
    if (existing) {
      permissions.push(existing);
    } else {
      const perm = await prisma.permission.create({ data: p });
      permissions.push(perm);
    }
  }

  const adminRole = await prisma.role.create({
    data: {
      tenantId: tenant.id,
      name: 'Super Admin',
      slug: 'super-admin',
      isSystemRole: true,
      rolePermissions: {
        create: permissions.map(p => ({ permissionId: p.id })),
      },
    },
  });

  // 4. Create Admin User
  const passwordHash = await bcrypt.hash('Admin@123', 12);
  const adminUser = await prisma.user.create({
    data: {
      tenantId: tenant.id,
      email: 'admin@kenzo.com',
      passwordHash,
      firstName: 'System',
      lastName: 'Admin',
      emailVerified: true,
      userRoles: {
        create: [{ roleId: adminRole.id }],
      },
    },
  });

  // 5. Create Departments
  const deptNames = ['Engineering', 'Design', 'Marketing', 'Sales', 'HR', 'Finance'];
  const departments = [];
  for (const name of deptNames) {
    departments.push(await prisma.department.create({
      data: { tenantId: tenant.id, organizationId: org.id, name, code: name.substring(0, 3).toUpperCase() },
    }));
  }

  // 6. Create Designations
  const desigNames = ['CTO', 'VP', 'Director', 'Senior', 'Mid', 'Junior'];
  const designations = [];
  for (const name of desigNames) {
    designations.push(await prisma.designation.create({
      data: { tenantId: tenant.id, name, code: name.substring(0, 3).toUpperCase() },
    }));
  }

  // 7. Create Shift
  const shift = await prisma.shift.create({
    data: { tenantId: tenant.id, name: 'General Shift', startTime: '09:00', endTime: '18:00', gracePeriodMinutes: 15 },
  });

  // 8. Create Leave Types
  const leaveTypes = ['Casual Leave', 'Sick Leave', 'Earned Leave', 'Maternity Leave', 'Paternity Leave'];
  for (const name of leaveTypes) {
    await prisma.leaveType.create({
      data: { tenantId: tenant.id, name, code: name.replace(' ', '').substring(0, 5).toUpperCase(), maxDaysPerYear: 12 },
    });
  }

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
