import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CustomSnackbarComponent } from '..';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  private snackBar = inject(MatSnackBar);
  constructor() {}

  showSnackbar() {
    const snackBarRef = this.snackBar.openFromComponent(
      CustomSnackbarComponent,
      {
        duration: 2000,
        
      }
    );
  }
}
