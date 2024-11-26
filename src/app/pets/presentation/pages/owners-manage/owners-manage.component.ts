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
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog } from '@angular/material/dialog';

import { OwnerDialogComponent } from './owner-dialog/owner-dialog.component';
import { OwnersService } from '../../services/owners.service';
import { PdfService, SearchInputComponent } from '../../../../shared';
import { Owner } from '../../../domain';

@Component({
  selector: 'app-owners-manage',
  imports: [
    CommonModule,
    MatToolbarModule,
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
  private petService = inject(OwnersService);
  private readonly dialog = inject(MatDialog);
  private pdfService = inject(PdfService);

  datasource = signal<Owner[]>([]);
  datasize = signal<number>(10);

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
      width: '1200px',
      maxWidth: '1200px',
    });
    dialogRef.afterClosed().subscribe((result?: Owner) => {
      if (!result) return;
      this.datasource.update((values) => {
        if (values.length === this.limit()) {
          values.pop();
        }
        return [result, ...values];
      });
      this.datasize.update((value) => (value += 1));
      // this.generatePetSheet(result);
    });
  }

  update(owner: Owner) {
    const dialogRef = this.dialog.open(OwnerDialogComponent, {
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
    this.petService
      .findAll(this.limit(), this.offset(), this.term())
      .subscribe(({ owners, length }) => {
        this.datasource.set(owners);
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

  async generatePetSheet(owner: Owner) {
    await this.pdfService.generatePetSheet(owner);
  }
}
