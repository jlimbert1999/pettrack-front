import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';

import { PetHistoryComponent } from '../../../components';
import { treatment } from '../../../../infrastructure';
import { TreatmentService } from '../../../services';
import { Pet } from '../../../../domain';

@Component({
  selector: 'app-pet-detail',
  imports: [
    CommonModule,
    MatIconModule,
    MatTabsModule,
    MatChipsModule,
    MatButtonModule,
    PetHistoryComponent,
    MatDialogModule,
  ],
  templateUrl: './pet-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class PetDetailComponent implements OnInit {
  private treatmentService = inject(TreatmentService);
  private offset = signal(0);

  data: Pet = inject(MAT_DIALOG_DATA);
  history = signal<treatment[]>([]);
  categories = toSignal(this.treatmentService.getCategoires());
  isLoading = signal(false);

  category = signal<string | null>(null);

  ngOnInit(): void {
    this.getPetTreatments();
  }

  getPetTreatments() {
    return this.treatmentService
      .getPetTreatments(this.data.id, this.category(), this.offset())
      .subscribe((resp) => {
        this.history.update((values) => [...resp, ...values]);
      });
  }

  filterPetTreatments(category: string) {
    this.offset.set(0);
    this.history.set([]);
    this.category.set(category);
    this.getPetTreatments();
  }

  onScroll() {
    this.offset.update((value) => (value += 10));
    this.getPetTreatments();
  }
}
