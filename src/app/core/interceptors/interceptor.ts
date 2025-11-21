import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandlerFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, catchError, finalize, throwError } from 'rxjs';

import { AlertService, Toast } from '../../shared';

export function loggingInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {
  const alertService = inject(AlertService);
  const toast = inject(Toast);

  const reqWithHeader = req.clone({
    headers: req.headers.append(
      'Authorization',
      `Bearer ${localStorage.getItem('token') || ''}`
    ),
  });
  const isRead = reqWithHeader.method === 'GET';

  if (isRead) {
    alertService.showLoader();
  }
  console.log("REQUEST", req.url);

  return next(reqWithHeader).pipe(
    catchError((error) => {
      if (error instanceof HttpErrorResponse) {
        const message =
          typeof error.error['message'] === 'string'
            ? error.error['message']
            : 'Se ha producido un error';
        switch (error.status) {
          case 500:
            toast.show({
              type: 'error',
              title: 'Error',
              description: 'Ha ocurrido un error en el servidor',
            });
            break;
          case 400:
            toast.show({
              type: 'warning',
              title: 'Solicitud incorrecta',
              description: message,
            });
            break;
          default:
            toast.show({ title: message });
            break;
        }
      }
      return throwError(() => error);
    }),
    finalize(() => {
      if (isRead) {
        alertService.closeLoader();
      }
    })
  );
}
