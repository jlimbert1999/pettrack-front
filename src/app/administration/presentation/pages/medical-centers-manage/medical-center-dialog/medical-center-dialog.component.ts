import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
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
import { MatInputModule } from '@angular/material/input';

import { MedicalCenterService } from '../../../services';
import { medicalCenter } from '../../../../infrastructure';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-medical-center-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './medical-center-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class MedicalCenterDialogComponent implements OnInit {
  private fb = inject(FormBuilder);
  private medicalCenterService = inject(MedicalCenterService);
  private dialogRef = inject(MatDialogRef<MedicalCenterDialogComponent>);

  data = inject<medicalCenter | undefined>(MAT_DIALOG_DATA);
  formCenter: FormGroup = this.fb.group({
    name  : ['', Validators.required],
  });

  ngOnInit(): void {
    this.formCenter.patchValue(this.data ?? {});
  }

  save() {
    const subscription = this.data
      ? this.medicalCenterService.edit(this.data.id, this.formCenter.value)
      : this.medicalCenterService.add(this.formCenter.value);
    subscription.subscribe((resp) => {
      this.dialogRef.close(resp);
    });
  }
}
