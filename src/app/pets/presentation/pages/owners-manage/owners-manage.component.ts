import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog } from '@angular/material/dialog';

import { OwnerDialogComponent } from './owner-dialog/owner-dialog.component';
import { OwnersService } from '../../services/owners.service';
import { PdfService, SearchInputComponent } from '../../../../shared';
import { Owner, Pet } from '../../../domain';

interface datasource {
  owner: Owner;
  pets: Pet[];
}
@Component({
  selector: 'app-owners-manage',
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatPaginatorModule,
    SearchInputComponent,
  ],
  templateUrl: './owners-manage.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class OwnersManageComponent implements OnInit {
  private readonly dialog = inject(MatDialog);
  private onwerService = inject(OwnersService);
  private pdfService = inject(PdfService);

  datasource = signal<datasource[]>([]);
  datasize = signal<number>(0);

  limit = signal<number>(10);
  index = signal<number>(0);
  offset = computed<number>(() => this.limit() * this.index());
  term = signal<string>('');

  readonly displayedColumns = [
    'name',
    'dni',
    'address',
    'phone',
    'pets',
    'options',
  ];

  ngOnInit(): void {
    this.getData();
  }

  create(): void {
    const dialogRef = this.dialog.open(OwnerDialogComponent, {
      width: '1100px',
      maxWidth: '1100px',
    });
    dialogRef.afterClosed().subscribe((result?: datasource) => {
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

  update(element: datasource) {
    const dialogRef = this.dialog.open(OwnerDialogComponent, {
      width: '1100px',
      maxWidth: '1100px',
      data: element,
    });
    dialogRef.afterClosed().subscribe((result: datasource) => {
      if (!result) return;
      this.datasource.update((values) => {
        const index = values.findIndex((el) => el.owner.id === result.owner.id);
        values[index] = result;
        return [...values];
      });
    });
  }

  getData(): void {
    this.onwerService
      .findAll(this.limit(), this.offset(), this.term())
      .subscribe(({ data, length }) => {
        this.datasource.set(data);
        this.datasize.set(length);
      });
  }

  search(term: string) {
    this.term.set(term);
    this.index.set(0);
    this.getData();
  }

  onPageChange({ pageIndex, pageSize }: PageEvent) {
    this.limit.set(pageSize);
    this.index.set(pageIndex);
    this.getData();
  }

  async generatePetSheet(owner: datasource) {
    await this.pdfService.generatePetSheet(owner.owner, owner.pets);
  }
}
