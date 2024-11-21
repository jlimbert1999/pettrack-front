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
import { MatTableModule } from '@angular/material/table';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

import { PetsService } from '../../services/pets.service';
import { SearchInputComponent } from '../../../../shared';
import { Pet } from '../../../domain';

@Component({
  selector: 'app-pets-manage',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatMenuModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    SearchInputComponent,
  ],
  templateUrl: './pets-manage.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class PetsManageComponent implements OnInit {
  private petService = inject(PetsService);

  datasource = signal<Pet[]>([]);
  datasize = signal<number>(10);

  limit = signal<number>(10);
  index = signal<number>(0);
  offset = computed<number>(() => this.limit() * this.index());
  term = signal<string>('');

  readonly displayedColumns = [
    'detail',
    'owner',
    'code',
    'name',
    'species',
    'date',
    'options',
  ];

  ngOnInit(): void {
    this.getData();
  }

  getData(): void {
    this.petService
      .findAll(this.limit(), this.offset(), this.term())
      .subscribe(({ pets, length }) => {
        this.datasource.set(pets);
        this.datasize.set(length);
      });
  }

  detail() {}

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
}
