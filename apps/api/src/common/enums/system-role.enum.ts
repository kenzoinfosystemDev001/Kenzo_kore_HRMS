export enum SystemRole {
  SUPER_ADMIN = 'Super_admin',
  ADMIN = 'Admin',
  HR = 'HR',
  EMPLOYEE = 'Employee',
}

export function normalizeSystemRole(roleInput?: string): SystemRole {
  if (!roleInput) return SystemRole.EMPLOYEE;

  const normalized = roleInput.trim().toLowerCase().replace(/[-_]/g, '');

  if (normalized.includes('super')) return SystemRole.SUPER_ADMIN;
  if (normalized === 'admin') return SystemRole.ADMIN;
  if (normalized === 'hr' || normalized.includes('hr')) return SystemRole.HR;

  return SystemRole.EMPLOYEE;
}
