import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandlerFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError, finalize, throwError } from 'rxjs';

import { AuthService } from '../../auth/presentation/services/auth.service';
import { AlertService } from '../../shared';

export function loggingInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {
  const authService = inject(AuthService);
  const alertService = inject(AlertService);
  const router = inject(Router);

  const reqWithHeader = req.clone({
    headers: req.headers.append(
      'Authorization',
      `Bearer ${localStorage.getItem('token') || ''}`
    ),
  });
  if (['POST', 'PATCH', 'PUT'].includes(reqWithHeader.method)) {
    alertService.showSaveLoader();
  }
  alertService.showSnackbar({ message: 'mensaje DE texto' });


  return next(reqWithHeader).pipe(
    catchError((error) => {
      if (error instanceof HttpErrorResponse) {
        handleHttpErrors(error, alertService);
      }
      return throwError(() => Error);
    }),
    finalize(() => {
      alertService.closeSaveLoader();
    })
  );
}

function handleHttpErrors(error: HttpErrorResponse, service: AlertService) {
  const message: string = error.error['message'] ?? 'Ha ocurrido un error';
  switch (error.status) {
    case 500:
      // Alert.Alert({
      //   icon: 'error',
      //   title: 'Error en el servidor',
      //   text: 'Se ha producido un error en el servidor',
      // });
      break;
    case 400:
      service.showSnackbar({ message: message });
      break;
    case 403:
      // Alert.Alert({
      //   icon: 'info',
      //   title: 'Accesso denegado',
      //   text: 'Esta cuenta no tiene los permisos requeridos',
      // });
      break;
    case 404:
      // Alert.Alert({
      //   icon: 'warning',
      //   title: 'Recurso no econtrado',
      //   text: error.error.message,
      // });
      break;
    default:
      break;
  }
}
