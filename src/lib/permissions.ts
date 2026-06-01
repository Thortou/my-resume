import type { Role } from '@prisma/client';

// Permission types
export type Permission =
  | 'dashboard:view'
  | 'users:view'
  | 'users:create'
  | 'users:edit'
  | 'users:delete'
  | 'products:view'
  | 'products:create'
  | 'products:edit'
  | 'products:delete'
  | 'settings:view'
  | 'settings:edit';

// Role-based permissions mapping
const rolePermissions: Record<Role, Permission[]> = {
  ADMIN: [
    'dashboard:view',
    'users:view',
    'users:create',
    'users:edit',
    'users:delete',
    'products:view',
    'products:create',
    'products:edit',
    'products:delete',
    'settings:view',
    'settings:edit',
  ],
  USER: ['dashboard:view', 'products:view'],
};

// Check if role has specific permission
export function hasPermission(role: Role, permission: Permission): boolean {
  const permissions = rolePermissions[role] || [];
  return permissions.includes(permission);
}

// Check if role has any of the specified permissions
export function hasAnyPermission(
  role: Role,
  permissions: Permission[]
): boolean {
  return permissions.some((permission) => hasPermission(role, permission));
}

// Check if role has all of the specified permissions
export function hasAllPermissions(
  role: Role,
  permissions: Permission[]
): boolean {
  return permissions.every((permission) => hasPermission(role, permission));
}

// Get all permissions for a role
export function getRolePermissions(role: Role): Permission[] {
  return rolePermissions[role] || [];
}

// Check if role is admin
export function isAdmin(role: Role): boolean {
  return role === 'ADMIN';
}

// Routes that require specific roles
export const protectedRoutes: Record<string, Role[]> = {
  '/admin': ['ADMIN'],
  '/admin/dashboard': ['ADMIN'],
  '/admin/users': ['ADMIN'],
  '/admin/settings': ['ADMIN'],
};

// Check if route requires authentication
export function requiresAuth(pathname: string): boolean {
  return pathname.startsWith('/admin');
}

// Check if role can access route
export function canAccessRoute(role: Role, pathname: string): boolean {
  // Find matching route pattern
  const matchingRoute = Object.keys(protectedRoutes).find(
    (route) => pathname === route || pathname.startsWith(route + '/')
  );

  if (!matchingRoute) return true;

  const allowedRoles = protectedRoutes[matchingRoute];
  return allowedRoles.includes(role);
}
