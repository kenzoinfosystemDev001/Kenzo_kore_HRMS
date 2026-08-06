import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting Kenzo Enterprise production seed...');
  await prisma.$connect();

  // 1. Create Primary Tenant
  const tenant = await prisma.tenant.create({
    data: {
      name: 'Kenzo Technologies',
      slug: `kenzo-tech-${Date.now()}`,
      domain: 'kenzoinfosystems.com',
    },
  });

  // 2. Create Primary Organization
  const org = await prisma.organization.create({
    data: {
      tenantId: tenant.id,
      name: 'Kenzo Technologies Inc.',
      industry: 'Information Technology & Cloud Systems',
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

  // Passwords
  const adminPasswordHash = await bcrypt.hash('Admin@123', 12);
  const empPasswordHash = await bcrypt.hash('Emp@123', 12);

  // 4. Create Admin: Ankit Sethi
  const adminUser = await prisma.user.create({
    data: {
      tenantId: tenant.id,
      email: 'ankit.sethi@kenzo.com',
      passwordHash: adminPasswordHash,
      firstName: 'Ankit',
      lastName: 'Sethi',
      emailVerified: true,
      userRoles: {
        create: [{ roleId: adminRole.id }],
      },
    },
  });

  // Alias Admin email
  await prisma.user.create({
    data: {
      tenantId: tenant.id,
      email: 'admin@kenzo.com',
      passwordHash: adminPasswordHash,
      firstName: 'Ankit',
      lastName: 'Sethi',
      emailVerified: true,
      userRoles: {
        create: [{ roleId: adminRole.id }],
      },
    },
  });

  // 5. Create Employee: Sujal Kumar
  const employeeUser = await prisma.user.create({
    data: {
      tenantId: tenant.id,
      email: 'sujal.k@kenzo.com',
      passwordHash: empPasswordHash,
      firstName: 'Sujal',
      lastName: 'Kumar',
      emailVerified: true,
      userRoles: {
        create: [{ roleId: empRole.id }],
      },
    },
  });

  // Alias Employee email
  await prisma.user.create({
    data: {
      tenantId: tenant.id,
      email: 'employee@kenzo.com',
      passwordHash: empPasswordHash,
      firstName: 'Sujal',
      lastName: 'Kumar',
      emailVerified: true,
      userRoles: {
        create: [{ roleId: empRole.id }],
      },
    },
  });

  // 6. Create Departments
  const deptEngineering = await prisma.department.create({
    data: { tenantId: tenant.id, organizationId: org.id, name: 'Engineering & Technology', code: 'ENG' },
  });

  const deptExecutive = await prisma.department.create({
    data: { tenantId: tenant.id, organizationId: org.id, name: 'Executive Operations', code: 'EXEC' },
  });

  const deptSales = await prisma.department.create({
    data: { tenantId: tenant.id, organizationId: org.id, name: 'Field Sales & Marketing', code: 'SALES' },
  });

  // 7. Create Employee: Laxmi Narayan
  const laxmiPasswordHash = await bcrypt.hash('Laxmi@123', 12);
  const laxmiUser = await prisma.user.create({
    data: {
      tenantId: tenant.id,
      email: 'laxmi.narayan@kenzoinfosystems.com',
      passwordHash: laxmiPasswordHash,
      firstName: 'Laxmi',
      lastName: 'Narayan',
      emailVerified: true,
      userRoles: {
        create: [{ roleId: empRole.id }],
      },
    },
  });

  // 8. Create Employee Profiles
  const emp1 = await prisma.employee.create({
    data: {
      tenantId: tenant.id,
      organizationId: org.id,
      employeeCode: 'EMP-1001',
      firstName: 'Ankit',
      lastName: 'Sethi',
      workEmail: 'ankit.sethi@kenzo.com',
      departmentId: deptExecutive.id,
      dateOfJoining: new Date('2024-01-01'),
      employmentStatus: 'active',
    },
  });
  await prisma.user.update({
    where: { id: adminUser.id },
    data: { employeeId: emp1.id },
  });

  const emp2 = await prisma.employee.create({
    data: {
      tenantId: tenant.id,
      organizationId: org.id,
      employeeCode: 'EMP-1002',
      firstName: 'Sujal',
      lastName: 'Kumar',
      workEmail: 'sujal.k@kenzo.com',
      departmentId: deptEngineering.id,
      dateOfJoining: new Date('2024-01-15'),
      employmentStatus: 'active',
    },
  });
  await prisma.user.update({
    where: { id: employeeUser.id },
    data: { employeeId: emp2.id },
  });

  const emp3 = await prisma.employee.create({
    data: {
      tenantId: tenant.id,
      organizationId: org.id,
      employeeCode: 'EMP-7297',
      firstName: 'Laxmi',
      lastName: 'Narayan',
      workEmail: 'laxmi.narayan@kenzoinfosystems.com',
      departmentId: deptSales.id,
      dateOfJoining: new Date('2026-08-08'),
      employmentStatus: 'active',
    },
  });
  await prisma.user.update({
    where: { id: laxmiUser.id },
    data: { employeeId: emp3.id },
  });

  console.log('Kenzo Enterprise Seed completed successfully! Ankit Sethi, Sujal Kumar, and Laxmi Narayan created in PostgreSQL DB.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
