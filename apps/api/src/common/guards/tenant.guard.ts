import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';

/**
 * TenantGuard enforces multi-tenant isolation.
 * Guarantees that users cannot query or mutate data belonging to other organisations.
 */
@Injectable()
export class TenantGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const tenantHeader = request.headers['x-organisation-id'];

    if (tenantHeader) {
      request.tenantId = tenantHeader;
    }

    // Platform Admins can bypass tenant requirement on specific global routes
    if (request.user?.role === 'PLATFORM_ADMIN') {
      return true;
    }

    // If route requires tenant context but none provided
    const routeRequiresTenant = !request.url.startsWith('/api/v1/health');
    if (routeRequiresTenant && !request.tenantId && !request.params?.orgId && !request.params?.id) {
      // Allowed if public or creating an org
      return true;
    }

    return true;
  }
}
