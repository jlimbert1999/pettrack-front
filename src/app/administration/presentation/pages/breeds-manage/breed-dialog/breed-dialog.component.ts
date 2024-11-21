import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';

import { medicalCenter } from '../../../../infrastructure';
import { BreedService, MedicalCenterService } from '../../../services';

@Component({
  selector: 'app-breed-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
  ],
  template: `
    <h2 mat-dialog-title>{{ data ? 'Edicion' : 'Creacion' }} Raza</h2>
    <mat-dialog-content>
      <form [formGroup]="formCenter" class="py-2">
        <mat-form-field appearance="outline">
          <mat-label>Especie</mat-label>
          <mat-select formControlName="species">
            @for (specie of species; track $index) {
            <mat-option [value]="specie.value">{{ specie.label }}</mat-option>
            }
          </mat-select>
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Nombre</mat-label>
          <input formControlName="name" matInput />
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button color="warn" mat-dialog-close>Cancelar</button>
      <button
        mat-button
        color="primary"
        [disabled]="formCenter.invalid"
        (click)="save()"
      >
        Guardar
      </button>
    </mat-dialog-actions>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BreedDialogComponent {
  private fb = inject(FormBuilder);
  private breedService = inject(BreedService);
  private dialogRef = inject(MatDialogRef);

  data = inject<medicalCenter | undefined>(MAT_DIALOG_DATA);
  formCenter: FormGroup = this.fb.group({
    name: ['', Validators.required],
    species: ['', Validators.required],
  });

  species = [
    { value: 'CANINO', label: 'Canino' },
    { value: 'FELINO', label: 'Felino' },
  ];

  ngOnInit(): void {
    this.formCenter.patchValue(this.data ?? {});
  }

  save() {
    const subscription = this.data
      ? this.breedService.edit(this.data.id, this.formCenter.value)
      : this.breedService.add(this.formCenter.value);
    subscription.subscribe((resp) => {
      this.dialogRef.close(resp);
    });
  }
}
