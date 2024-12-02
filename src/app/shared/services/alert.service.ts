import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { LoadingIndicatorComponent } from '..';

interface snacbarProps {
  message: string;
  duration?: number;
}
@Injectable({
  providedIn: 'root',
})
export class AlertService {
  private dialogRef = inject(MatDialog);
  private snackBarRef = inject(MatSnackBar);

  private loadingDialogRef?: MatDialogRef<LoadingIndicatorComponent, void>;

  constructor() {}

  showSnackbar({ message, duration = 3000 }: snacbarProps): void {
    this.snackBarRef.open(message, undefined, { duration });
  }

  showSaveLoader() {
    this.loadingDialogRef = this.dialogRef.open(LoadingIndicatorComponent, {
      disableClose: true,
    });
  }

  closeSaveLoader() {
    this.loadingDialogRef?.close();
  }
}
