import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandlerFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError, finalize, throwError } from 'rxjs';

import { AlertService } from '../../shared';

export function loggingInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {
  const alertService = inject(AlertService);
  const router = inject(Router);

  const reqWithHeader = req.clone({
    headers: req.headers.append(
      'Authorization',
      `Bearer ${localStorage.getItem('token') || ''}`
    ),
  });
  const isWrite = ['POST', 'PATCH', 'PUT'].includes(reqWithHeader.method);
  const isRead = reqWithHeader.method === 'GET';

  if (isWrite) {
    alertService.showSaveLoader();
  } else if (isRead) {
    alertService.showLoader();
  }

  return next(reqWithHeader).pipe(
    catchError((error) => {
      if (error instanceof HttpErrorResponse) {
        handleHttpErrors(error, alertService);
      }
      return throwError(() => error);
    }),
    finalize(() => {
      if (isWrite) {
        alertService.closeSaveLoader();
      } else if (isRead) {
        alertService.closeLoader();
      }
    })
  );
}

function handleHttpErrors(error: HttpErrorResponse, service: AlertService) {
  const message: string = error.error['message'] ?? 'Ha ocurrido un error';
  switch (error.status) {
    case 500:
      service.showSnackbar({ message: 'Ha ocurrido un error en el servidor' });
      break;
    default:
      service.showSnackbar({ message: message });
      break;
  }
}
