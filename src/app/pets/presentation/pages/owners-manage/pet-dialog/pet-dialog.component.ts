import { CommonModule } from '@angular/common';
import {
  FormArray,
  Validators,
  FormBuilder,
  ReactiveFormsModule,
  AbstractControl,
  FormGroup,
  FormControl,
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
import { OwnersService } from '../../../services/owners.service';
import { owner } from '../../../../infrastructure';

interface petFormProps {
  name: FormControl<string >;
  age: FormControl<number >;
  species: FormControl<string >;
  breed: FormControl<string >;
  color: FormControl<string >;
  sex: FormControl<string >;
  is_neutered: FormControl<boolean >;
  neuter_date: FormControl<string >;
  description: FormControl<string >;
}

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
    MatStepperModule,
    ImageUploaderComponent,
  ],
  templateUrl: './pet-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideNativeDateAdapter()],
})
export class PetDialogComponent implements OnInit {
  private formBuilder = inject(FormBuilder);
  private fileService = inject(FileService);
  private petService = inject(OwnersService);
  private dialogRef = inject(MatDialogRef<PetDialogComponent>);

  readonly species = ['felino', 'canino'];
  readonly animalSex = ['macho', 'hembra'];

  data?: owner = inject(MAT_DIALOG_DATA);

  form = this.formBuilder.group({
    steps: this.formBuilder.array([
      this.formBuilder.group({
        first_name: ['', Validators.required],
        middle_name: ['', Validators.required],
        last_name: [''],
        phone: [''],
        dni: ['', Validators.required],
        address: [''],
      }),
      this.formBuilder.array<petFormProps[]>(
        [],
        CustomFormValidators.minLengthArray(1)
      ),
    ]),
  });

  petsList = signal<petProps[]>([]);

  ngOnInit(): void {
    this._loadForm();
  }

  save(): void {
    if (this.form.invalid) return;
    const subscription = this._createFileUploadTask().pipe(
      switchMap((files) => {
        const newForm = {
          ...this.ownerFormGroup.value,
          pets: this.petsFormArray.value.map((pet, index: number) => ({
            id: this.petsList()[index].id,
            image: files[index],
            ...pet,
          })),
        };
        return this.data
          ? this.petService.update(this.data.id, newForm)
          : this.petService.create(newForm);
      })
    );
    subscription.subscribe((resp) => {
      this.dialogRef.close(resp);
    });
  }

  add(): void {
    // const form: FormGroup<petFormProps> = this.formBuilder.group({
    //   name: ['', Validators.required],
    //   age: [1, Validators.required],
    //   species: ['', Validators.required],
    //   breed: ['', Validators.required],
    //   color: ['', Validators.required],
    //   sex: ['', Validators.required],
    //   is_neutered: [false],
    //   neuter_date: [null],
    //   description: [''],
    // });
    // this.petsFormArray.push(form);
    // this.petsList.update((values) => [...values, { image: null }]);
  }

  remove(index: number): void {
    // this.pets.removeAt(index);
    // this.petsList.update((values) => {
    //   values.splice(index, 1);
    //   return [...values];
    // });
  }

  selectImage(event: File | undefined, index: number) {
    this.petsList()[index].file = event;
  }

  removeImage(index: number): void {
    this.petsList()[index].file = undefined;
    this.petsList()[index].image = null;
  }

  get steps() {
    return this.form.get('steps') as FormArray;
  }

  get ownerFormGroup() {
    return this.steps.at(0) as FormGroup;
  }

  get petsFormArray() {
    return this.steps.at(1) as FormArray<FormGroup<petFormProps>>;
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
    // this.formOwner.patchValue(this.data);
  }
}
