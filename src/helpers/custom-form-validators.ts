import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class CustomFormValidators {
  static minLengthArray(minLength: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      return control.value.length < minLength
        ? { arrayMinLength: { requiredLength: minLength } }
        : null;
    };
  }

  static matchFields(field: string, confirmField: string): ValidatorFn | null {
    return (formGroup: AbstractControl) => {
      const control1 = formGroup.get(field);
      const control2 = formGroup.get(confirmField);

      if (!control1 || !control2) return null;

      const currentErrors = control2.errors;

      if (control1.value !== control2.value && control2.value !== '') {
        control2.setErrors({ ...currentErrors, not_match: true });
        return { not_match: true };
      } else {
        control2?.setErrors(currentErrors);
      }
      return null;
    };
  }
}
