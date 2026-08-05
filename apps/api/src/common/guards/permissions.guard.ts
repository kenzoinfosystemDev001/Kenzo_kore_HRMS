import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';
import { AuthenticatedUser } from '../interfaces/authenticated-user.interface';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredPermissions) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest() as { user: AuthenticatedUser };
    if (!user || !user.permissions) {
      throw new ForbiddenException('Insufficient permissions');
    }
    
    // Check if user has ALL required permissions, or is a super admin
    const hasPermission = requiredPermissions.every((permission) =>
      user.permissions.includes(permission) || user.permissions.includes('all')
    );
    
    if (!hasPermission) {
      throw new ForbiddenException('Insufficient permissions');
    }
    return true;
  }
}
