import { Component, inject, input, output } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';

import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { petHistory } from '../../../infrastructure';
import { PdfService } from '../../../../shared';

@Component({
  selector: 'pet-history',
  imports: [
    CommonModule,
    InfiniteScrollModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
  ],
  template: `
    <div
      infiniteScroll
      [infiniteScrollDistance]="2"
      [infiniteScrollThrottle]="50"
      [infiniteScrollContainer]="containerRef()"
      (scrolled)="scrolled()"
    >
      <div class="flex flex-col gap-y-4">
        @for (pulication of history(); track $index) {
        <mat-card appearance="outlined">
          <mat-card-header class="mb-2">
            <div
              class="flex justify-between w-full flex-col gap-y-2 sm:gap-y-0 sm:flex-row"
            >
              <div>
                <p class="text-base/7 font-semibold text-xl">
                  {{ pulication.typeTreatment.name }}
                </p>
                <p class="text-md font-medium">
                  {{ pulication.typeTreatment.category }}
                </p>
              </div>
              <div class="text-md">
                <span
                  class="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-md font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10"
                >
                  {{ pulication.date | date : 'short' }}
                </span>
              </div>
            </div>
          </mat-card-header>
          <mat-card-content>
            <p>Centro de salud: {{ pulication.medicalCenter.name }}</p>
          </mat-card-content>
          <mat-card-actions align="end">
            <button mat-icon-button aria-label="Print sheet" (click)="test()">
              <mat-icon>print</mat-icon>
            </button>
          </mat-card-actions>
        </mat-card>
        } @empty {
        <p class="font-medium">SIN REGISTROS</p>
        }
      </div>
    </div>
  `,
})
export class PetHistoryComponent {
  history = input.required<petHistory[]>();
  containerRef = input.required<HTMLDivElement>();
  private pdfService = inject(PdfService);

  onScroll = output<void>();

  scrolled(): void {
    console.log('cargando');
    this.onScroll.emit();
  }

  test() {
    this.pdfService.generateTreatmentSheet();
  }
}
