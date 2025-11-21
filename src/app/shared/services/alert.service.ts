import { computed, inject, Injectable, signal } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { LoadingIndicatorComponent } from '../components/loaders/loading-indicator/loading-indicator.component';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  private dialogRef = inject(MatDialog);

  private loadingDialogRef?: MatDialogRef<LoadingIndicatorComponent, void>;

  private _isLoading = signal(false);
  private activeRequests = 0;
  isLoading = computed(() => this._isLoading());

  constructor() {}

  showActionLoader(): void {
    if (this.loadingDialogRef) return;
    this.loadingDialogRef = this.dialogRef.open(LoadingIndicatorComponent, {
      disableClose: true,
    });
  }

  closeActionLoader(): void {
    if (this.loadingDialogRef) {
      this.loadingDialogRef.close();
      this.loadingDialogRef = undefined;
    }
  }

  showLoader() {
    this.activeRequests++;
    if (this.activeRequests === 1) {
      this._isLoading.set(true);
    }
  }

  closeLoader() {
    if (this.activeRequests > 0) {
      this.activeRequests--;
    }
    if (this.activeRequests === 0) {
      this._isLoading.set(false);
    }
  }
}
