import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuditLogService } from './audit-log.service';

@Injectable()
export class AuditLogInterceptor implements NestInterceptor {
  constructor(private readonly auditLogService: AuditLogService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, user, body } = request;

    return next.handle().pipe(
      tap((data) => {
        if (method !== 'GET' && user) {
          // Log mutating actions
          const entity = url.split('/')[2] || 'unknown'; // naive parsing
          this.auditLogService.log(
            user.userId,
            method,
            entity,
            data?.id || 'unknown',
            { body }
          ).catch(e => console.error('Audit log failed', e));
        }
      }),
    );
  }
}
