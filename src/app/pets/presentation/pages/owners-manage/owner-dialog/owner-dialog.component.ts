import { CommonModule } from '@angular/common';
import {
  FormArray,
  FormGroup,
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
import { toSignal } from '@angular/core/rxjs-interop';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

import { forkJoin, map, Observable, of, switchMap } from 'rxjs';

import {
  FileService,
  SimpleSelectOption,
  ImageUploaderComponent,
  SimpleSelectSearchComponent,
} from '../../../../../shared';
import { CustomFormValidators } from '../../../../../../helpers';
import { OwnersService, PetsService } from '../../../services/';
import { Owner } from '../../../../domain';

interface petProps {
  id?: string;
  file?: File;
  image: string | null;
}
@Component({
  selector: 'owner-dialog',
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
    SimpleSelectSearchComponent,
  ],
  templateUrl: './owner-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    provideNativeDateAdapter(),
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { showError: true },
    },
  ],
})
export class OwnerDialogComponent implements OnInit {
  private formBuilder = inject(FormBuilder);
  private fileService = inject(FileService);
  private ownerService = inject(OwnersService);
  private petService = inject(PetsService);
  private dialogRef = inject(MatDialogRef<OwnerDialogComponent>);

  readonly animalSex = ['macho', 'hembra'];
  breeds = toSignal(this._getBreeds(), { initialValue: [] });
  districts = toSignal(this._getDistricts(), { initialValue: [] });

  data?: Owner = inject(MAT_DIALOG_DATA);

  form = this.formBuilder.group({
    steps: this.formBuilder.array([
      this.formBuilder.group({
        first_name: ['', Validators.required],
        middle_name: ['', Validators.required],
        last_name: [''],
        phone: [''],
        dni: ['', Validators.required],
        districtId: ['', Validators.required],
        birthDate: ['', Validators.required],
        address: [''],
      }),
      this.formBuilder.array<FormGroup<any>[]>(
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
          ? this.ownerService.update(this.data.id, newForm)
          : this.ownerService.create(newForm);
      })
    );
    subscription.subscribe((resp) => {
      this.dialogRef.close(resp);
    });
  }

  addPet(): void {
    this.petsFormArray.push(
      this.formBuilder.group({
        name: ['', Validators.required],
        breedId: ['', Validators.required],
        color: ['', Validators.required],
        sex: ['', Validators.required],
        is_neutered: [false],
        birthDate: [null],
        neuter_date: [null],
        description: [null],
      })
    );
    this.petsList.update((values) => [...values, { image: null }]);
  }

  removePet(index: number): void {
    this.petsFormArray.removeAt(index);
    this.petsList.update((values) => {
      values.splice(index, 1);
      return [...values];
    });
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
    return this.steps.at(1) as FormArray<FormGroup<any>>;
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

  private _loadForm(): void {
    if (!this.data) return;
    const { pets, district, ...props } = this.data;
    pets.forEach(({ id, image }, index) => {
      this.addPet();
      this.petsList()[index] = { id, image };
    });
    this.ownerFormGroup.patchValue({ ...props, districtId: district.id });
    this.petsFormArray.patchValue(
      pets.map(({ breed, ...props }) => ({
        ...props,
        breedId: breed.id,
      }))
    );
  }

  private _getDistricts(): Observable<SimpleSelectOption<number>[]> {
    return this.ownerService
      .getDistricts()
      .pipe(
        map((resp) => resp.map(({ id, name }) => ({ value: id, text: name })))
      );
  }

  private _getBreeds(): Observable<SimpleSelectOption<number>[]> {
    return this.petService.getBreeds().pipe(
      map((resp) =>
        resp.map((breed) => ({
          value: breed.id,
          text: `${breed.species} - ${breed.name}`,
        }))
      )
    );
  }
}
