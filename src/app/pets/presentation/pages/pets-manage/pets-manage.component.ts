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
import { pet } from '../../../infrastructure';
import { PetsService } from '../../services/pets.service';

@Component({
  selector: 'app-pets-manage',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatPaginatorModule],
  templateUrl: './pets-manage.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class PetsManageComponent implements OnInit {
  private petService = inject(PetsService);

  datasource = signal<pet[]>([]);
  datasize = signal<number>(10);

  limit = signal<number>(10);
  index = signal<number>(0);
  offset = computed<number>(() => this.limit() * this.index());
  term = signal<string>('');

  readonly displayedColumns = ['code', 'name', 'date', 'options'];

  ngOnInit(): void {
    this.getData();
  }

  getData(): void {
    this.petService.findAll().subscribe(({ pets, length }) => {
      this.datasource.set(pets);
      this.datasize.set(length);
    });
  }

  onPageChange({ pageIndex, pageSize }: PageEvent) {
    this.limit.set(pageSize);
    this.index.set(pageIndex);
    this.getData();
  }
}
