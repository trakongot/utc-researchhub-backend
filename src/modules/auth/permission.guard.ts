import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {
  PermissionT,
  getPermissionsForRoles,
} from '../../common/constant/permissions';

/**
 * PermissionGuard - Protects route based on user permissions
 * Used in conjunction with the @RequirePermissions decorator to check permissions
 *
 * @example
 * ```typescript
 * @UseGuards(JwtAuthGuard, PermissionGuard)
 * @RequirePermissions(PermissionT.VIEW_FACULTY)
 * @Get()
 * findAll() {
 *   // Only users with the VIEW_FACULTY permission can access this
 * }
 * ```
 */
@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.get<PermissionT[]>(
      'permissions',
      context.getHandler(),
    );

    // If the route does not require any permissions, allow access
    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    // If no user information or no roles, deny access
    if (!user || !user.roles || user.roles.length === 0) {
      throw new ForbiddenException('Tài khoản không có quyền truy cập');
    }

    // Check permissions from user.permissions (if available in the JWT payload)
    if (user.permissions && Array.isArray(user.permissions)) {
      const hasPermission = requiredPermissions.every((permission) =>
        user.permissions.includes(permission),
      );

      if (!hasPermission) {
        throw new ForbiddenException('Tài khoản không có quyền truy cập');
      }

      return true;
    }

    // If no permissions in the JWT, calculate from roles
    const userPermissions = getPermissionsForRoles(user.roles);

    // Check if the user has all the required permissions
    const hasPermission = requiredPermissions.every((permission) =>
      userPermissions.includes(permission),
    );

    if (!hasPermission) {
      throw new ForbiddenException('Tài khoản không có quyền truy cập');
    }

    return true;
  }
}
