import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { PetService } from '../../services/pet.service';
import { PetDialogComponent } from './pet-dialog/pet-dialog.component';

@Component({
  selector: 'app-pets-manage',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './pets-manage.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class PetsManageComponent {
  private petService = inject(PetService);
  private readonly dialog = inject(MatDialog);

  datasource = signal<any[]>([]);
  datasize = signal<number>(10);

  limit = signal<number>(10);
  index = signal<number>(0);
  offset = computed<number>(() => this.limit() * this.index());
  term = signal<string>('');

  readonly displayedColumns = ['name', 'dni', 'pets', 'options'];

  create(): void {
    const dialogRef = this.dialog.open(PetDialogComponent, {
      width: '1100px',
      maxWidth: '1100px',
      data: {},
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }
}
