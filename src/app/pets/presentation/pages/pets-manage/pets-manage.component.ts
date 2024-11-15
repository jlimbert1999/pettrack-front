import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog } from '@angular/material/dialog';
import { PetService } from '../../services/pet.service';
import { PetDialogComponent } from './pet-dialog/pet-dialog.component';
import { owner } from '../../../infrastructure';

@Component({
  selector: 'app-pets-manage',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
  ],
  templateUrl: './pets-manage.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class PetsManageComponent implements OnInit {
  private petService = inject(PetService);
  private readonly dialog = inject(MatDialog);

  datasource = signal<owner[]>([]);
  datasize = signal<number>(10);

  limit = signal<number>(10);
  index = signal<number>(0);
  offset = computed<number>(() => this.limit() * this.index());
  term = signal<string>('');

  readonly displayedColumns = ['name', 'dni', 'pets', 'options'];

  ngOnInit(): void {
    this.getData();
  }

  create(): void {
    const dialogRef = this.dialog.open(PetDialogComponent, {
      width: '1100px',
      maxWidth: '1100px',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (!result) return;
      this.datasource.update((values) => {
        if (values.length === this.limit()) {
          values.pop();
        }
        return [result, ...values];
      });
      this.datasize.update((value) => (value += 1));
    });
  }
  
  update(owner: owner) {
    const dialogRef = this.dialog.open(PetDialogComponent, {
      width: '1100px',
      maxWidth: '1100px',
      data: owner,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (!result) return;
      this.datasource.update((values) => {
        const index = values.findIndex((el) => el.id === owner.id);
        values[index] = result;
        return [...values];
      });
    });
  }

  getData(): void {
    this.petService.findAll().subscribe(({ owners, length }) => {
      this.datasource.set(owners);
      this.datasize.set(length);
      console.log(owners);
    });
  }
}
