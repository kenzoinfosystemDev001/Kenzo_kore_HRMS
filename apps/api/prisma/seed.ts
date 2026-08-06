import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Cleaning up existing database records...');
  await prisma.$connect();

  // 1. Wipe all old records cleanly to remove all duplicates
  try {
    await prisma.$executeRawUnsafe(`TRUNCATE TABLE "users", "employees", "user_roles", "role_permissions", "roles", "departments", "designations", "organizations", "tenants" CASCADE;`)
  } catch (err) {
    console.log('Cleanup warning:', err);
  }

  console.log('Creating fresh production database setup...');

  // 2. Create Single Primary Tenant
  const tenant = await prisma.tenant.create({
    data: {
      name: 'Kenzo Technologies',
      slug: 'kenzo-technologies',
      domain: 'kenzoinfosystems.com',
    },
  });

  // 3. Create Primary Organization
  const org = await prisma.organization.create({
    data: {
      tenantId: tenant.id,
      name: 'Kenzo Infosystems Pvt. Ltd.',
      industry: 'Information Technology & Enterprise HRMS Systems',
    },
  });

  // 4. Create Permissions & Roles
  const permissionsData = [
    { module: 'employees', action: 'read', resource: 'Employee', code: 'employees:read' },
    { module: 'employees', action: 'create', resource: 'Employee', code: 'employees:create' },
    { module: 'employees', action: 'update', resource: 'Employee', code: 'employees:update' },
    { module: 'employees', action: 'delete', resource: 'Employee', code: 'employees:delete' },
    { module: 'attendance', action: 'read', resource: 'Attendance', code: 'attendance:read' },
    { module: 'attendance', action: 'manage', resource: 'Attendance', code: 'attendance:manage' },
    { module: 'leave', action: 'manage', resource: 'Leave', code: 'leave:manage' },
    { module: 'leave', action: 'approve', resource: 'Leave', code: 'leave:approve' },
    { module: 'payroll', action: 'manage', resource: 'Payroll', code: 'payroll:manage' },
    { module: 'organization', action: 'manage', resource: 'Organization', code: 'organization:manage' },
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

  const superAdminRole = await prisma.role.create({
    data: {
      tenantId: tenant.id,
      name: 'Super_admin',
      slug: 'super-admin',
      isSystemRole: true,
      rolePermissions: {
        create: permissions.map(p => ({ permissionId: p.id })),
      },
    },
  });

  const adminRole = await prisma.role.create({
    data: {
      tenantId: tenant.id,
      name: 'Admin',
      slug: 'admin',
      isSystemRole: true,
      rolePermissions: {
        create: permissions.map(p => ({ permissionId: p.id })),
      },
    },
  });

  const hrRole = await prisma.role.create({
    data: {
      tenantId: tenant.id,
      name: 'HR',
      slug: 'hr',
      isSystemRole: true,
      rolePermissions: {
        create: permissions.map(p => ({ permissionId: p.id })),
      },
    },
  });

  const empRole = await prisma.role.create({
    data: {
      tenantId: tenant.id,
      name: 'Employee',
      slug: 'employee',
      isSystemRole: true,
      rolePermissions: {
        create: permissions.filter(p => ['employees:read', 'attendance:read'].includes(p.code)).map(p => ({ permissionId: p.id })),
      },
    },
  });

  // Master Password: kenzo123
  const masterPasswordHash = await bcrypt.hash('kenzo123', 12);

  // 5. Create Departments
  const deptExecutive = await prisma.department.create({
    data: { tenantId: tenant.id, organizationId: org.id, name: 'Executive Management', code: 'EXEC' },
  });

  const deptEngineering = await prisma.department.create({
    data: { tenantId: tenant.id, organizationId: org.id, name: 'Engineering & Technology', code: 'ENG' },
  });

  // 6. Create Account 1 (ADMIN): Ankit.sethi@kenzoinfosystems.com
  const adminEmployee = await prisma.employee.create({
    data: {
      tenantId: tenant.id,
      organizationId: org.id,
      employeeCode: 'EMP-1001',
      firstName: 'Ankit',
      lastName: 'Sethi',
      workEmail: 'Ankit.sethi@kenzoinfosystems.com',
      departmentId: deptExecutive.id,
      dateOfJoining: new Date('2020-01-01'),
      employmentStatus: 'active',
      workPhone: '+91 98100 12345',
    },
  });

  const adminUser = await prisma.user.create({
    data: {
      tenantId: tenant.id,
      email: 'Ankit.sethi@kenzoinfosystems.com',
      passwordHash: masterPasswordHash,
      firstName: 'Ankit',
      lastName: 'Sethi',
      emailVerified: true,
      employeeId: adminEmployee.id,
      userRoles: {
        create: [{ roleId: superAdminRole.id }],
      },
    },
  });

  // 7. Create Account 2 (EMPLOYEE): Sujal.kumar@kenzoinfosystems.com
  const employeeRecord = await prisma.employee.create({
    data: {
      tenantId: tenant.id,
      organizationId: org.id,
      employeeCode: 'EMP-1002',
      firstName: 'Sujal',
      lastName: 'Kumar',
      workEmail: 'Sujal.kumar@kenzoinfosystems.com',
      departmentId: deptEngineering.id,
      dateOfJoining: new Date('2024-01-15'),
      employmentStatus: 'active',
      workPhone: '6207210784',
    },
  });

  const employeeUser = await prisma.user.create({
    data: {
      tenantId: tenant.id,
      email: 'Sujal.kumar@kenzoinfosystems.com',
      passwordHash: masterPasswordHash,
      firstName: 'Sujal',
      lastName: 'Kumar',
      emailVerified: true,
      employeeId: employeeRecord.id,
      userRoles: {
        create: [{ roleId: empRole.id }],
      },
    },
  });

  console.log('✅ Clean database seed completed successfully!');
  console.log('Admin Account: Ankit.sethi@kenzoinfosystems.com | Password: kenzo123');
  console.log('Employee Account: Sujal.kumar@kenzoinfosystems.com | Password: kenzo123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
