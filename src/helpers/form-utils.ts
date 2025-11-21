import {
  AbstractControl,
  FormArray,
  FormGroup,
  ValidationErrors,
} from '@angular/forms';

export class FormUtils {
  static getControl(
    form: FormGroup | FormArray,
    path: string
  ): AbstractControl | null {
    return form.get(path);
  }

  static isValidField(form: FormGroup | FormArray, path: string): boolean {
    const control = this.getControl(form, path);
    return !!(control && control.invalid && (control.touched || control.dirty));
  }

  static getErrorMessage(
    form: FormGroup | FormArray,
    path: string,
    customMessages?: Record<string, string>
  ): string | null {
    const control = this.getControl(form, path);
    if (!control || !control.errors) return null;

    const errors = control.errors;

    for (const key of Object.keys(errors)) {
      // Mensaje personalizado (si existe)
      if (customMessages && customMessages[key]) {
        return customMessages[key];
      }

      // Mensajes genéricos
      switch (key) {
        case 'required':
          return 'Este campo es requerido';

        case 'minlength':
          return `Mínimo de ${errors['minlength'].requiredLength} caracteres.`;

        case 'maxlength':
          return `Máximo de ${errors['maxlength'].requiredLength} caracteres`;

        case 'pattern':
          return 'Formato inválido';

        default:
          return 'Campo inválido';
      }
    }
    return null;
  }
}
