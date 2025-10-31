import { Component, inject, OnDestroy, signal } from '@angular/core';
import { OverlayModule } from '@angular/cdk/overlay';
import { MediaMatcher } from '@angular/cdk/layout';
import { RouterModule } from '@angular/router';

import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';

import { ProfileComponent } from '../../components/profile/profile.component';
import { AuthService } from '../../../../auth/presentation/services/auth.service';
import { AlertService } from '../../../../shared';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  imports: [
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    RouterModule,
    OverlayModule,
    ProfileComponent,
    MatProgressBarModule,
  ],
})
export default class HomeComponent implements OnDestroy {
  menu = inject(AuthService).menu();
   isLoading = inject(AlertService).isLoading;

  protected readonly isMobile = signal(true);

  private readonly _mobileQuery: MediaQueryList;
  private readonly _mobileQueryListener: () => void;
  isProfileOpen = false;

  constructor() {
    const media = inject(MediaMatcher);
    this._mobileQuery = media.matchMedia('(max-width: 600px)');
    this.isMobile.set(this._mobileQuery.matches);
    this._mobileQueryListener = () =>
      this.isMobile.set(this._mobileQuery.matches);
    this._mobileQuery.addEventListener('change', this._mobileQueryListener);
  }

  ngOnDestroy(): void {
    this._mobileQuery.removeEventListener('change', this._mobileQueryListener);
  }
}
