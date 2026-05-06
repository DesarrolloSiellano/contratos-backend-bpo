import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  message: string;
  statusCode: number;
  status: string;
  data: T;
  meta: any;
  url?: string;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    const isRpc = context.getType() === 'rpc';
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();
    const statusCode = response?.statusCode || HttpStatus.OK;

    return next.handle().pipe(
      map((result) => {
        // Si el resultado ya tiene el formato esperado
        if (result && result.status && result.statusCode) {
          if (isRpc) {
            const { statusCode: _, ...rest } = result;
            return rest as Response<T>;
          }
          return result;
        }

        // Determinamos mensaje, meta y data
        const message = result?.message || 'Operation successful';

        // Si el resultado trae 'meta', lo usamos; si no, generamos uno básico
        const meta =
          result?.meta !== undefined
            ? result.meta
            : { totalData: Array.isArray(result) ? result.length : 1 };

        // Lógica de extracción de data
        let data = undefined;
        if (result?.data !== undefined) {
          data = result.data;
        } else if (result?.meta === undefined) {
          data = result;
        }

        return {
          message,
          ...(!isRpc && { statusCode }),
          status: 'Success',
          ...(result?.url && { url: result.url }),
          ...(data !== undefined && { data }),
          meta,
        } as Response<T>;
      }),
    );
  }
}
