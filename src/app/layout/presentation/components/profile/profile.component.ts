import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  model,
} from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { AuthService } from '../../../../auth/presentation/services/auth.service';

@Component({
  selector: 'profile',
  imports: [CommonModule, RouterModule, MatListModule, MatIconModule],
  templateUrl: './profile.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  isOpen = model.required<boolean>();

  logout() {
    this.authService.logout();
    this.isOpen.set(false);
    this.router.navigateByUrl('/login');
  }

  settings() {
    this.router.navigateByUrl('/home/settings');
    this.isOpen.set(false);
  }

  get user() {
    return this.authService.user();
  }
}
