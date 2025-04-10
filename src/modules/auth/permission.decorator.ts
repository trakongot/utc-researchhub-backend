import { SetMetadata } from '@nestjs/common';
import { PermissionT } from '../../common/constant/permissions';

/**
 * Decorator to declare the necessary permissions to access a route
 * Used in conjunction with PermissionGuard to protect routes
 * @param permissions List of required permissions
 * @returns Metadata for the route
 *
 * @example
 * ```typescript
 * @RequirePermissions(PermissionT.VIEW_FACULTY, PermissionT.MANAGE_FACULTY)
 * @Get()
 * findAll() {
 *   // Only users with both permissions can access this
 * }
 * ```
 */
export const RequirePermissions = (...permissions: PermissionT[]) =>
  SetMetadata('permissions', permissions);
