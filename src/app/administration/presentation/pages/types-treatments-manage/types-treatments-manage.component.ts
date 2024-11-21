import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatButtonModule, MatIconButton } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';

import { TypeTreatmentDialogComponent } from './type-treatment-dialog/type-treatment-dialog.component';
import { medicalCenter, typeTreatment } from '../../../infrastructure';
import { TypeTreatmentService } from '../../services';

@Component({
  selector: 'app-types-treatments-manage',
  standalone: true,
  imports: [
    MatTableModule,
    MatIconButton,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
  ],
  templateUrl: './types-treatments-manage.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class TypesTreatmentsManageComponent {
  dialog = inject(MatDialog);
  medicalCenterService = inject(TypeTreatmentService);

  public displayedColumns: string[] = ['category', 'name', 'buttons'];

  datasource = signal<typeTreatment[]>([]);
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
      .subscribe(({ treatments, length }) => {
        this.datasource.set(treatments);
        this.datasize.set(length);
      });
  }

  create() {
    const dialogRef = this.dialog.open(TypeTreatmentDialogComponent, {
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

  update(data: typeTreatment) {
    const dialogRef = this.dialog.open(TypeTreatmentDialogComponent, {
      width: '600px',
      maxWidth: '600px',
      data,
    });
    dialogRef.afterClosed().subscribe((result: medicalCenter) => {
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
