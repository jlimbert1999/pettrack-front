import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class CustomFormValidators {
  static minLengthArray(minLength: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      return control.value.length < minLength
        ? { arrayMinLength: { requiredLength: minLength } }
        : null;
    };
  }
}
