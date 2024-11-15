import { CommonModule } from '@angular/common';
import {
  FormArray,
  Validators,
  FormBuilder,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  inject,
  OnInit,
  signal,
  Component,
  ChangeDetectionStrategy,
} from '@angular/core';
import {
  MatDialogRef,
  MatDialogModule,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { forkJoin, map, of, switchMap } from 'rxjs';

import { FileService, ImageUploaderComponent } from '../../../../../shared';
import { CustomFormValidators } from '../../../../../../helpers';
import { PetService } from '../../../services/pet.service';
import { owner } from '../../../../infrastructure';

interface petProps {
  id?: string;
  file?: File;
  image: string | null;
}
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
export class PetDialogComponent implements OnInit {
  private formBuilder = inject(FormBuilder);
  private fileService = inject(FileService);
  private petService = inject(PetService);
  private dialogRef = inject(MatDialogRef<PetDialogComponent>);

  readonly species = ['felino', 'canino'];
  readonly animalSex = ['macho', 'hembra'];

  data?: owner = inject(MAT_DIALOG_DATA);

  formOwner = this.formBuilder.group({
    first_name: ['', Validators.required],
    middle_name: ['', Validators.required],
    last_name: [''],
    phone: [''],
    dni: ['', Validators.required],
    address: [''],
    pets: this.formBuilder.array<any[]>(
      [],
      CustomFormValidators.minLengthArray(1)
    ),
  });

  petsList = signal<petProps[]>([]);

  ngOnInit(): void {
    this._loadForm();
  }

  save(): void {
    if (this.formOwner.invalid) return;
    const subscription = this._createFileUploadTask().pipe(
      switchMap((files) => {
        const { pets, ...props } = this.formOwner.value;
        const completedForm = {
          ...props,
          pets: pets?.map((pet, index) => ({
            id: this.petsList()[index].id,
            image: files[index],
            ...pet,
          })),
        };
        console.log(completedForm);
        return this.data
          ? this.petService.update(this.data.id, completedForm)
          : this.petService.create(completedForm);
      })
    );
    subscription.subscribe((resp) => {
      this.dialogRef.close(resp);
    });
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
        neuter_date: [null],
        description: [''],
      })
    );
    this.petsList.update((values) => [...values, { image: null }]);
  }

  remove(index: number) {
    this.pets.removeAt(index);
    this.petsList.update((values) => {
      values.splice(index, 1);
      return [...values];
    });
  }

  selectImage(event: File | undefined, index: number) {
    console.log(event);
    this.petsList()[index].file = event;
    // if (!event) {
    //   this.petsList[index].image = null;
    // }
  }

  get pets() {
    return this.formOwner.get('pets') as FormArray;
  }

  private _createFileUploadTask() {
    return forkJoin(
      this.petsList().map(({ file, image }) => {
        if (file) {
          return this.fileService
            .uploadFile(file)
            .pipe(map(({ filename }) => filename));
        }
        return of(image ? image.split('/').pop() : null);
      })
    );
  }

  private _loadForm() {
    if (!this.data) return;
    this.data.pets.forEach(({ id, image }, index) => {
      this.add();
      this.petsList()[index] = { id, image };
    });
    this.formOwner.patchValue(this.data);
  }
}
