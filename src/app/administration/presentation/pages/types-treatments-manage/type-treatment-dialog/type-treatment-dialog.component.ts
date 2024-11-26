import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';

import { medicalCenter } from '../../../../infrastructure';
import { TypeTreatmentService } from '../../../services';

@Component({
  selector: 'app-type-treatment-dialog',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
  ],
  templateUrl: './type-treatment-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TypeTreatmentDialogComponent {
  private fb = inject(FormBuilder);
  private typeTreatmentService = inject(TypeTreatmentService);
  private dialogRef = inject(MatDialogRef<this>);

  data = inject<medicalCenter | undefined>(MAT_DIALOG_DATA);
  categories = [
    { value: 'VACUNACION', label: 'Vacunacion' },
    { value: 'DESPARASITACION', label: 'Desparasitacion' },
  ];

  formCenter: FormGroup = this.fb.group({
    name: ['', Validators.required],
    category: ['', Validators.required],
  });

  ngOnInit(): void {
    this.formCenter.patchValue(this.data ?? {});
  }

  save() {
    const subscription = this.data
      ? this.typeTreatmentService.edit(this.data.id, this.formCenter.value)
      : this.typeTreatmentService.add(this.formCenter.value);
    subscription.subscribe((resp) => {
      this.dialogRef.close(resp);
    });
  }
}
