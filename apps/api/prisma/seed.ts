import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Cleaning up existing database records...');
  await prisma.$connect();

  // 1. Wipe all old records cleanly to remove all duplicates
  try {
    await prisma.$executeRawUnsafe(`TRUNCATE TABLE "users", "employees", "user_roles", "role_permissions", "roles", "departments", "designations", "organizations", "tenants" CASCADE;`);
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
  const masterPasswordHash = await bcrypt.hash('kenzo123', 10);

  // 5. Create Departments
  const deptExecutive = await prisma.department.create({
    data: { tenantId: tenant.id, organizationId: org.id, name: 'Executive Management', code: 'EXEC' },
  });

  const deptEngineering = await prisma.department.create({
    data: { tenantId: tenant.id, organizationId: org.id, name: 'Engineering & Technology', code: 'ENG' },
  });

  const deptAdministration = await prisma.department.create({
    data: { tenantId: tenant.id, organizationId: org.id, name: 'Administration', code: 'ADMIN' },
  });

  const deptSales = await prisma.department.create({
    data: { tenantId: tenant.id, organizationId: org.id, name: 'Sales & Field Services', code: 'SALES' },
  });

  // 6. Master Accounts List to seed into PostgreSQL
  const seedAccounts = [
    {
      code: 'EMP-1001',
      firstName: 'Ankit',
      lastName: 'Sethi',
      email: 'Ankit.sethi@kenzoinfosystems.com',
      roleObj: superAdminRole,
      deptId: deptExecutive.id,
      designation: 'CEO & Founder',
      phone: '+91 98100 12345',
      joinDate: new Date('2020-01-01'),
    },
    {
      code: 'EMP-1002',
      firstName: 'Sujal',
      lastName: 'Kumar',
      email: 'Sujal.kumar@kenzoinfosystems.com',
      roleObj: empRole,
      deptId: deptEngineering.id,
      designation: 'Software Engineer',
      phone: '6207210784',
      joinDate: new Date('2024-01-15'),
    },
    {
      code: 'EMP-1003',
      firstName: 'Chanchal',
      lastName: 'Saini',
      email: 'Chanchal.saini@kenzoinfosystems.com',
      roleObj: adminRole,
      deptId: deptAdministration.id,
      designation: 'Managing Director',
      phone: '+91 98100 99887',
      joinDate: new Date('2026-08-07'),
    },
    {
      code: 'EMP-1004',
      firstName: 'Jitender',
      lastName: 'Saini',
      email: 'Jitender.saini@kenzoinfosystems.com',
      roleObj: superAdminRole,
      deptId: deptAdministration.id,
      designation: 'CEO',
      phone: '+91 98100 77665',
      joinDate: new Date('2026-08-07'),
    },
    {
      code: 'EMP-1005',
      firstName: 'Laxmi',
      lastName: 'Narayan',
      email: 'Laxminarayan.ojha@kenzoinfosystems.com',
      roleObj: empRole,
      deptId: deptSales.id,
      designation: 'Field Sales Executive',
      phone: '+91 98100 33221',
      joinDate: new Date('2026-08-06'),
    },
  ];

  for (const acc of seedAccounts) {
    const emp = await prisma.employee.create({
      data: {
        tenantId: tenant.id,
        organizationId: org.id,
        employeeCode: acc.code,
        firstName: acc.firstName,
        lastName: acc.lastName,
        workEmail: acc.email,
        departmentId: acc.deptId,
        dateOfJoining: acc.joinDate,
        employmentStatus: 'active',
        phone: acc.phone,
      },
    });

    await prisma.user.create({
      data: {
        tenantId: tenant.id,
        email: acc.email.toLowerCase().trim(),
        passwordHash: masterPasswordHash,
        firstName: acc.firstName,
        lastName: acc.lastName,
        emailVerified: true,
        employeeId: emp.id,
        userRoles: {
          create: [{ roleId: acc.roleObj.id }],
        },
      },
    });

    console.log(`Seeded User + Employee: ${acc.email} (${acc.roleObj.name})`);
  }

  console.log('✅ Clean PostgreSQL database seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
