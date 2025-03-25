import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';

import {
  FormBuilder,
  FormsModule,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

import { InfiniteScrollDirective } from 'ngx-infinite-scroll';

import { captureLog } from '../../../../infrastructure';
import { PetsService } from '../../../services';
import { Pet } from '../../../../domain';

@Component({
  selector: 'app-capture-log',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatDialogModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    InfiniteScrollDirective,
  ],
  template: `
    <h2 mat-dialog-title>Historial de capturas</h2>
    <mat-dialog-content>
      <form [formGroup]="form" (ngSubmit)="save()">
        <div class="flex flex-col sm:flex-row gap-3 items-center p-2">
          <div class="flex-1 h-12 flex flex-col sm:flex-row gap-2 w-full">
            <mat-form-field>
              <mat-label>Tipo</mat-label>
              <mat-select formControlName="description">
                @for (item of descriptionOption; track $index) {
                <mat-option [value]="item">{{ item }}</mat-option>
                }
              </mat-select>
            </mat-form-field>
            <mat-form-field>
              <mat-label>Ubicacion</mat-label>
              <input matInput formControlName="location" />
            </mat-form-field>
          </div>

          <div class="w-full sm:w-12 flex justify-end">
            <button mat-mini-fab [disabled]="form.invalid" type="submit">
              <mat-icon>add</mat-icon>
            </button>
          </div>
        </div>
      </form>
      <div
        class="search-results border-2 rounded-xl p-2 mt-4"
        infiniteScroll
        [infiniteScrollDistance]="2"
        [infiniteScrollThrottle]="50"
        (scrolled)="onScroll()"
        [scrollWindow]="false"
      >
        <ul class="overflow-hidden">
          @for (log of logs(); track $index) {
          <li>
            <div class="p-2 sm:p-3">
              <div class="flex items-center justify-between">
                <h3 class="text-lg leading-6 font-medium ">
                  {{ log.description }}
                </h3>
                <p class="mt-1 max-w-2xl text-sm">
                  {{ log.date | date : 'short' }}
                </p>
              </div>
              <div class="mt-2 flex items-center justify-between">
                <p class="text-sm font-medium">
                  {{ log.user.fullname | titlecase }} -
                  {{ log.location ? log.location : 'Sin ubicación' }}
                </p>
              </div>
            </div>
          </li>
          } @empty {
          <p class="p-2">Sin registros.</p>
          }
        </ul>
      </div>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cerrar</button>
    </mat-dialog-actions>
  `,
  styles: `
   .search-results {
      height: 20rem;
      overflow-y: auto;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CaptureLogComponent implements OnInit {
  private petService = inject(PetsService);
  private _formBuilder = inject(FormBuilder);

  data: Pet = inject(MAT_DIALOG_DATA);
  logs = signal<captureLog[]>([]);
  descriptionOption = ['Situacion de calle', 'Vigilancia epidemiologica'];
  offset = signal(0);

  form = this._formBuilder.group({
    location: [''],
    description: ['', Validators.required],
  });

  ngOnInit(): void {
    this.getLogs();
  }

  save() {
    this.petService
      .createCaptureLog(this.data.id, this.form.value)
      .subscribe((resp) => {
        this.logs.update((values) => [resp, ...values]);
        this.form.reset({});
      });
  }

  onScroll() {
    this.offset.update((value) => (value += 10));
    this.getLogs();
  }

  private getLogs() {
    this.petService
      .getCaptureLogs(this.data.id, this.offset())
      .subscribe((data) => {
        this.logs.update((values) => [...data, ...values]);
      });
  }
}
