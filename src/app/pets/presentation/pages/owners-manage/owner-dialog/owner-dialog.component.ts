import { CommonModule } from '@angular/common';
import {
  FormArray,
  FormGroup,
  Validators,
  FormBuilder,
  ReactiveFormsModule,
  AbstractControl,
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
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { finalize } from 'rxjs';

import {
  AlertService,
  FormErrorMessagesPipe,
  ImageUploaderComponent,
  SimpleSelectSearchComponent,
} from '../../../../../shared';

import { CustomFormValidators, FormUtils } from '../../../../../../helpers';
import { OwnersService, PetsService } from '../../../services/';
import { Owner, Pet } from '../../../../domain';
import { FormError } from '../../../../../shared/components/form-error/form-error';

interface PetProps {
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
    FormErrorMessagesPipe,
    FormError
  ],
  templateUrl: './owner-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
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
  private ownerService = inject(OwnersService);
  private petService = inject(PetsService);
  private dialogRef = inject(MatDialogRef);
  private alert = inject(AlertService);

  readonly animalSex = ['macho', 'hembra'];
  readonly breeds = this.petService.breeds;
  readonly districts = this.ownerService.districts;

  data?: { owner: Owner; pets: Pet[] } = inject(MAT_DIALOG_DATA);

  form = this.formBuilder.nonNullable.group({
    person: this.formBuilder.group({
      first_name: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.pattern(/^[a-zA-ZÁÉÍÓÚÑáéíóúñ\s]+$/),
        ],
      ],
      middle_name: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.pattern(/^[a-zA-ZÁÉÍÓÚÑáéíóúñ\s]*$/),
        ],
      ],
      last_name: [
        '',
        [
          Validators.minLength(3),
          Validators.pattern(/^[a-zA-ZÁÉÍÓÚÑáéíóúñ\s]*$/),
        ],
      ],
      phone: [
        '',
        [
          Validators.minLength(7),
          Validators.maxLength(10),
          Validators.pattern(/^[0-9]+$/),
        ],
      ],
      dni: [
        '',
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(10),
          Validators.pattern(/^[A-Za-z0-9-]+$/),
        ],
      ],
      districtId: ['', Validators.required],
      birthDate: ['', Validators.required],
      address: ['', Validators.maxLength(200)],
    }),
    pets: this.formBuilder.array([], CustomFormValidators.minLengthArray(1)),
  });

  petsList = signal<PetProps[]>([]);

  isLoading = signal(false);

  formUtils = FormUtils;

  readonly ERROR_MESSAGES = {
    first_name: {
      pattern: 'Solo se permiten letras',
    },
    middle_name: {
      pattern: 'Solo se permiten letras',
    },
    last_name: {
      pattern: 'Solo se permiten letras',
    },
    confirmPassword: {
      not_match: 'Las contraseñas no coinciden',
    },
    phone: {
      pattern: 'Número de teléfono inválido',
    },
    dni: {
      pattern: 'No se permite caracteres especiales',
    },
  };

  ngOnInit(): void {
    this.loadForm();
  }

  save(): void {
    if (this.form.invalid) return;

    const pets = this.pets.value.map((petForm: FormGroup, index: number) => ({
      ...this.petsList()[index],
      form: petForm,
    }));

    this.isLoading.set(true);
    this.alert.showActionLoader();

    const request$ = this.data
      ? this.ownerService.update(
          this.data.owner.id,
          this.ownerControl.value,
          pets
        )
      : this.ownerService.create(this.ownerControl.value, pets);

    request$
      .pipe(
        finalize(() => {
          this.alert.closeActionLoader();
          this.isLoading.set(false);
        })
      )
      .subscribe((resp) => {
        this.dialogRef.close(resp);
      });
  }

  addPet(): void {
    this.pets.push(
      this.formBuilder.group({
        name: [
          '',
          [
            Validators.required,
            Validators.minLength(3),
            Validators.pattern(/^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s]+$/),
          ],
        ],
        breedId: ['', Validators.required],
        color: [
          '',
          [
            Validators.required,
            Validators.minLength(3),
            Validators.pattern(/^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s]+$/),
          ],
        ],
        sex: ['', Validators.required],
        is_neutered: [false],
        birthDate: [null],
        neuter_date: [null],
        description: [null, Validators.maxLength(300)],
      })
    );
    this.petsList.update((values) => [...values, { image: null }]);
  }

  removePet(index: number): void {
    this.pets.removeAt(index);
    this.petsList.update((values) => {
      values.splice(index, 1);
      return [...values];
    });
  }

  selectImage(file: File | undefined, index: number) {
    this.petsList.update((values) => {
      values[index].file = file;
      return [...values];
    });
  }

  removeImage(index: number): void {
    this.petsList.update((values) => {
      values[index].file = undefined;
      values[index].image = null;
      return [...values];
    });
  }

  get ownerControl() {
    return this.form.get('person') as FormGroup;
  }

  get petsControl(): AbstractControl {
    return this.form.get('pets')!;
  }

  get pets() {
    return this.form.get('pets') as FormArray;
  }

  private loadForm(): void {
    if (!this.data) return;

    const { pets, owner } = this.data;

    pets.forEach((pet, index) => {
      this.addPet();
      this.petsList.update((values) => {
        values[index].id = pet.id;
        values[index].image = pet.image;
        return [...values];
      });
    });

    this.ownerControl.patchValue({ ...owner, districtId: owner.district.id });

    this.pets.patchValue(
      pets.map(({ breed, ...props }) => ({
        ...props,
        breedId: breed.id,
      }))
    );
  }
}
