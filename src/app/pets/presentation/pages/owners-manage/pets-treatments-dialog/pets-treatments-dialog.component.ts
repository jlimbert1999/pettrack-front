import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';

import { finalize, map, Observable } from 'rxjs';

import { Pet } from '../../../../domain';
import { TreatmentService } from '../../../services';
import {
  AlertService,
  SimpleSelectOption,
  SimpleSelectSearchComponent,
} from '../../../../../shared';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-pets-treatments-dialog',
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatListModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
    SimpleSelectSearchComponent,
  ],
  templateUrl: './pets-treatments-dialog.component.html',
  providers: [provideNativeDateAdapter()],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PetsTreatmentsDialogComponent {
  private dialogRef = inject(MatDialogRef);
  private formBuilder = inject(FormBuilder);
  private treatmentService = inject(TreatmentService);
  private alertService = inject(AlertService);
  data = inject<Pet[]>(MAT_DIALOG_DATA);

  centers = toSignal(this._getCenters(), { initialValue: [] });
  categories = toSignal(this._getCategories(), { initialValue: [] });
  types = signal<SimpleSelectOption<number>[]>([]);

  formTreatment = this.formBuilder.group({
    typeTreamentId: [null, Validators.required],
    medicalCenterId: [null, Validators.required],
    petIds: [null, Validators.required],
    date: [null, Validators.required],
  });

  isSaving = signal(false);

  save() {
    if (this.formTreatment.invalid) return;
    this.isSaving.set(true);
    this.alertService.showActionLoader();
    this.treatmentService
      .create(this.formTreatment.value)
      .pipe(
        finalize(() => {
          this.isSaving.set(false);
          this.alertService.closeActionLoader();
        })
      )
      .subscribe((resp) => this.dialogRef.close(resp));
  }

  close() {
    this.dialogRef.close();
  }

  getTypes(category: string) {
    return this.treatmentService
      .getTypeTreatments(category)
      .pipe(
        map((resp) => resp.map(({ id, name }) => ({ value: id, text: name })))
      )
      .subscribe((data) => this.types.set(data));
  }

  private _getCategories(): Observable<SimpleSelectOption<string>[]> {
    return this.treatmentService
      .getCategoires()
      .pipe(map((resp) => resp.map((el) => ({ value: el, text: el }))));
  }

  private _getCenters(): Observable<SimpleSelectOption<number>[]> {
    return this.treatmentService
      .getMedicalCenters()
      .pipe(
        map((resp) => resp.map(({ id, name }) => ({ value: id, text: name })))
      );
  }
}
