import { CommonModule, Location } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  OnInit,
  signal,
} from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialog } from '@angular/material/dialog';
import { forkJoin } from 'rxjs';

import { ImageLoaderComponent } from '../../../../shared';
import { Pet } from '../../../domain';
import { treatment } from '../../../infrastructure';
import { PetHistoryComponent } from '../../components';
import { PetsService, TreatmentService } from '../../services';
import { PetTreatmentDialogComponent } from '../pets-manage/pet-treatment-dialog/pet-treatment-dialog.component';

@Component({
  selector: 'app-pet-detail',
  imports: [
    CommonModule,
    MatIconModule,
    MatTabsModule,
    MatChipsModule,
    MatButtonModule,
    MatToolbarModule,
    MatProgressBarModule,
    ImageLoaderComponent,
    PetHistoryComponent,
  ],
  templateUrl: './pet-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class PetDetailComponent implements OnInit {
  private location = inject(Location);
  private dialogRef = inject(MatDialog);

  private petService = inject(PetsService);
  private treatmentService = inject(TreatmentService);

  @Input('id') petId: string;

  pet = signal<Pet | null>(null);
  history = signal<treatment[]>([]);
  categories = signal<string[]>([]);
  isLoading = signal(false);

  ngOnInit(): void {
    this._getPetDetails();
  }

  back() {
    this.location.back();
  }

  addTreatment() {
    const dialogRef = this.dialogRef.open(PetTreatmentDialogComponent, {
      width: '600px',
      maxWidth: '600px',
      data: this.pet(),
    });
    dialogRef.afterClosed().subscribe((result?: treatment) => {
      if (!result) return;
      this.history.update((values) => [result, ...values]);
    });
  }

  filterTreatments(category: string) {
    return this.treatmentService
      .getPetTreatments(this.petId, category)
      .subscribe((resp) => {
        this.history.set(resp);
      });
  }

  private _getPetDetails() {
    this.isLoading.set(false);
    forkJoin([
      this.petService.getDetail(this.petId),
      this.treatmentService.getPetTreatments(this.petId),
      this.treatmentService.getCategoires(),
    ]).subscribe({
      next: ([detail, history, categories]) => {
        this.pet.set(detail);
        this.history.set(history);
        this.categories.set(categories);
      },
      complete: () => this.isLoading.set(false),
    });
  }
}
