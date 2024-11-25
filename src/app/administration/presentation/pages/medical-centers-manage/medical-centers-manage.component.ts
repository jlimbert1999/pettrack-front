import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';

import { MedicalCenterService } from '../../services';
import { medicalCenter } from '../../../infrastructure';
import MedicalCenterDialogComponent from './medical-center-dialog/medical-center-dialog.component';

@Component({
    selector: 'app-medical-centers-manage',
    imports: [
        CommonModule,
        FormsModule,
        MatIconModule,
        MatButtonModule,
        MatPaginatorModule,
        MatTableModule,
        MatToolbarModule,
    ],
    templateUrl: './medical-centers-manage.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export default class MedicalCentersManageComponent {
  dialog = inject(MatDialog);
  medicalCenterService = inject(MedicalCenterService);

  public displayedColumns: string[] = ['name', 'buttons'];

  datasource = signal<medicalCenter[]>([]);
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
      .subscribe((data) => {
        this.datasource.set(data.medicalCenters);
        this.datasize.set(data.length);
      });
  }

  create() {
    const dialogRef = this.dialog.open(MedicalCenterDialogComponent, {
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

  update(data: medicalCenter) {
    const dialogRef = this.dialog.open(MedicalCenterDialogComponent, {
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
