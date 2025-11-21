import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule, Location } from '@angular/common';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

import { CustomFormValidators } from '../../../../../helpers';
import { AuthService } from '../../../../auth/presentation/services/auth.service';
import {
  FormErrorMessagesPipe,
  FieldValidationErrorMessages,
} from '../../../../shared/pipes/form-error-messages.pipe';
import { AlertService, Toast } from '../../../../shared';

@Component({
  selector: 'app-user-settings',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    MatToolbarModule,
    FormErrorMessagesPipe,
  ],
  templateUrl: './user-settings.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class UserSettings {
  private formBuilder = inject(FormBuilder);
  private location = inject(Location);
  private authService = inject(AuthService);
  private toast = inject(Toast);

  user = this.authService.user;

  hidePassword = signal(true);
  hideConfirmPassword = signal(true);

  formUser: FormGroup = this.formBuilder.nonNullable.group(
    {
      password: [
        '',
        [
          Validators.minLength(8),
          Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).+$'),
        ],
      ],
      confirmPassword: ['', Validators.required],
    },
    {
      validators: CustomFormValidators.matchFields(
        'password',
        'confirmPassword'
      ),
    }
  );

  readonly ERROR_MESSAGES: FieldValidationErrorMessages = {
    password: {
      pattern:
        'Ingrese al menos una letra minúscula, una mayúscula y un número',
    },
    confirmPassword: {
      not_match: 'Las contraseñas no coinciden',
    },
  };

  save() {
    const { password } = this.formUser.value;
    this.authService.updateCredentials(password).subscribe(() => {
      this.hidePassword.set(true);
      this.hideConfirmPassword.set(true);
      this.formUser.reset({});
      this.toast.show({
        type: 'success',
        title: 'Cambios guardados',
        description: 'Contraseña actualizada correctamente',
      });
    });
  }

  togglePasswordVisibility() {
    this.hidePassword.update((value) => !value);
  }

  togflecConfirmPasswordVisibility() {
    this.hideConfirmPassword.update((value) => !value);
  }

  goBack() {
    this.location.back();
  }
}
