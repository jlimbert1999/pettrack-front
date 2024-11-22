import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';

import { BreedService } from '../../services';
import { BreedDialogComponent } from './breed-dialog/breed-dialog.component';
import { breed, medicalCenter, typeTreatment } from '../../../infrastructure';

@Component({
  selector: 'app-breeds-manage',
  standalone: true,
  imports: [MatTableModule, MatIconModule, MatPaginatorModule, MatButtonModule],
  templateUrl: './breeds-manage.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class BreedsManageComponent {
  dialog = inject(MatDialog);
  medicalCenterService = inject(BreedService);

  public displayedColumns: string[] = ['species', 'name', 'buttons'];

  datasource = signal<breed[]>([]);
  datasize = signal<number>(0);

  public limit = signal<number>(10);
  public index = signal<number>(0);
  public offset = computed<number>(() => this.limit() * this.index());

  ngOnInit(): void {
    this.getData();
  }

  getData() {
    this.medicalCenterService
      .get(this.limit(), this.offset())
      .subscribe(({ breeds, length }) => {
        this.datasource.set(breeds);
        this.datasize.set(length);
      });
  }

  create() {
    const dialogRef = this.dialog.open(BreedDialogComponent, {
      width: '600px',
      maxWidth: '600px',
    });
    dialogRef.afterClosed().subscribe((result?: any) => {
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

  update(data: breed) {
    const dialogRef = this.dialog.open(BreedDialogComponent, {
      width: '600px',
      maxWidth: '600px',
      data,
    });
    dialogRef.afterClosed().subscribe((result: breed) => {
      if (!result) return;
      this.datasource.update((values) => {
        const index = values.findIndex((inst) => inst.id === result.id);
        values[index] = result;
        return [...values];
      });
    });
  }

  onPageChange(event: PageEvent) {
    this.limit.set(event.pageSize);
    this.index.set(event.pageIndex);
    this.getData();
  }
}
