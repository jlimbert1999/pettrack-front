import { Injectable } from '@angular/core';
import { toast } from 'ngx-sonner';

interface ToastOptions {
  description?: string;
  title: string;
  type?: 'warning' | 'success' | 'info' | 'error';
  duration?: number;
}
@Injectable({
  providedIn: 'root',
})
export class Toast {
  protected readonly toast = toast;

  constructor() {}

  show({ title, description, type = 'info', duration }: ToastOptions) {
    toast[type](title, { description, duration });
  }
}
