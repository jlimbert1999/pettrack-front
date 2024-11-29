import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CustomSnackbarComponent } from '..';

interface snacbarProps {
  message: string;
  duration?: number;
}
@Injectable({
  providedIn: 'root',
})
export class AlertService {
  private snackBarRef = inject(MatSnackBar);
  constructor() {}

  showSnackbar({ message, duration = 3000 }: snacbarProps): void {
    this.snackBarRef.open(message, undefined, { duration });
  }
}
