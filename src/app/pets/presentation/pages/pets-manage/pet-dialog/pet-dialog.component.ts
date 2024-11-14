import { CommonModule } from '@angular/common';
import {
  FormArray,
  Validators,
  FormBuilder,
  ReactiveFormsModule,
} from '@angular/forms';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { ImageUploaderComponent } from '../../../../../shared';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'pet-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatCheckboxModule,
    MatStepperModule,
    MatTooltipModule,
    MatSelectModule,
    MatButtonModule,
    MatDialogModule,
    MatInputModule,
    MatIconModule,
    ImageUploaderComponent,
  ],
  templateUrl: './pet-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideNativeDateAdapter()],
})
export class PetDialogComponent {
  private formBuilder = inject(FormBuilder);

  readonly species = ['felino', 'canino'];
  readonly animalSex = ['macho', 'hembra'];
  formOwner = this.formBuilder.group({
    first_name: ['', Validators.required],
    middle_name: ['', Validators.required],
    last_name: [''],
    phone: [''],
    dni: ['', Validators.required],
    address: [''],
    pets: this.formBuilder.array([]),
  });

  files: (File | null)[] = [];

  save() {
    console.log(this.formOwner.value);
  }

  add(): void {
    this.pets.push(
      this.formBuilder.group({
        name: ['', Validators.required],
        age: ['', Validators.required],
        species: ['', Validators.required],
        breed: ['', Validators.required],
        color: ['', Validators.required],
        sex: ['', Validators.required],
        is_neutered: [false],
        neuter_date: [''],
        description: [''],
      })
    );
    this.files.push(null);
  }

  remove(index: number) {
    this.pets.removeAt(index);
    this.files.splice(index, 1);
  }

  get pets() {
    return this.formOwner.get('pets') as FormArray;
  }

  selectImage(event: File | undefined, index: number) {
    this.files[index] = event ?? null;
  }

  private _createFileUploadTask() {
    // return forkJoin([
    //   this.files.map((file) => this.postService.uploadFile(file)),
    // ]);
  }
}
