import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatError } from "@angular/material/form-field";

@Component({
  selector: 'form-error',
  imports: [MatError],
  template: `
   <ng-container>
      <mat-error>Prueba</mat-error>
    </ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormError { }
