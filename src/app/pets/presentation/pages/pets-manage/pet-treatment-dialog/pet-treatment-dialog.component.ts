import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { map, Observable } from 'rxjs';
import { Pet } from '../../../../domain';
import {
  SimpleSelectOption,
  SimpleSelectSearchComponent,
} from '../../../../../shared';
import { TreatmentService } from '../../../services';

@Component({
  selector: 'app-pet-treatment-dialog',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatSelectModule,
    SimpleSelectSearchComponent,
  ],
  templateUrl: './pet-treatment-dialog.component.html',
})
export class PetTreatmentDialogComponent {
  private formBuilder = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<PetTreatmentDialogComponent>);
  private treatmentService = inject(TreatmentService);
  data = inject<Pet>(MAT_DIALOG_DATA);

  centers = toSignal(this._getCenters(), { initialValue: [] });
  categories = toSignal(this._getCategories(), { initialValue: [] });

  types = signal<SimpleSelectOption<number>[]>([]);

  formTreatment = this.formBuilder.group({
    typeTreamentId: [null, Validators.required],
    medicalCenterId: [null, Validators.required],
  });

  save() {
    this.treatmentService
      .create(this.formTreatment.value, this.data.id)
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
