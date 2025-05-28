import { Component, inject, input, model, output } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';

import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { treatment } from '../../../infrastructure';
import { TreatmentService } from '../../services';

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
        @for (item of history(); track $index) {
        <mat-card appearance="outlined">
          <mat-card-header class="mb-2">
            <div
              class="flex justify-between w-full flex-col gap-y-2 sm:gap-y-0 sm:flex-row"
            >
              <div>
                <p class="font-semibold text-xl">
                  {{ item.typeTreatment.name }}
                </p>
                <p class="text-md font-medium">
                  {{ item.typeTreatment.category }}
                </p>
              </div>
              <div>
                <button mat-icon-button (click)="remove(item)">
                  <mat-icon>delete</mat-icon>
                </button>
              </div>
            </div>
          </mat-card-header>
          <mat-card-content>
            <p>Centro de salud: {{ item.medicalCenter.name }}</p>
            <p>Fecha: {{ item.date | date : 'short' }}</p>
          </mat-card-content>
        </mat-card>
        } @empty {
        <p class="font-medium">SIN REGISTROS</p>
        }
      </div>
    </div>
  `,
})
export class PetHistoryComponent {
  private treatmentService = inject(TreatmentService);
  history = model.required<treatment[]>();
  containerRef = input.required<HTMLDivElement>();

  onScroll = output<void>();

  scrolled(): void {
    this.onScroll.emit();
  }

  remove(item: treatment) {
    this.treatmentService.remove(item.id).subscribe(() => {
      this.history.update((values) =>
        values.filter((value) => value.id !== item.id)
      );
    });
  }
}
