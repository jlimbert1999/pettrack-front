import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { RouterModule } from '@angular/router';

import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { OverlayModule } from '@angular/cdk/overlay';

import { toSignal } from '@angular/core/rxjs-interop';
import { map, Observable, of } from 'rxjs';

import {
  SearchInputComponent,
  SimpleSelectOption,
  SimpleSelectSearchComponent,
} from '../../../../shared';
import { OwnersService, PetsService } from '../../services';
import { Pet } from '../../../domain';

@Component({
  selector: 'app-pets-manage',
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatMenuModule,
    OverlayModule,
    MatIconModule,
    MatInputModule,
    MatTableModule,
    MatButtonModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatPaginatorModule,
    SearchInputComponent,
    SimpleSelectSearchComponent,
  ],
  templateUrl: './pets-manage.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class PetsManageComponent implements OnInit {
  private petService = inject(PetsService);
  private ownerService = inject(OwnersService);
  private formBuilder = inject(FormBuilder);
  private destroyRef = inject(DestroyRef).onDestroy(() => {
    this._saveCache();
  });

  datasource = signal<Pet[]>([]);
  datasize = signal<number>(10);

  limit = signal<number>(10);
  index = signal<number>(0);
  offset = computed<number>(() => this.limit() * this.index());
  term = signal<string>('');
  isFilterOpen = false;
  districts = toSignal(this._getDistricts(), { initialValue: [] });

  formFilter: FormGroup = this.formBuilder.group({
    owner: [''],
    district: [null],
  });

  readonly displayedColumns = [
    'code',
    'name',
    'species',
    'owner',
    'date',
    'options',
  ];

  ngOnInit(): void {
    this._loadCache();
  }

  getData(): void {
    this.petService
      .findAll({
        limit: this.limit(),
        offset: this.offset(),
        term: this.term(),
        formFilter: this.formFilter.value,
      })
      .subscribe(({ pets, length }) => {
        console.log('get http data');
        this.datasource.set(pets);
        this.datasize.set(length);
      });
  }

  filter() {
    this.index.set(0);
    this.isFilterOpen = false;
    this.getData();
  }

  reset() {
    this.formFilter.reset();
    this.isFilterOpen = false;
    this.getData();
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

  private _getDistricts(): Observable<SimpleSelectOption<number>[]> {
    return this.ownerService
      .getDistricts()
      .pipe(
        map((resp) => resp.map(({ id, name }) => ({ value: id, text: name })))
      );
  }

  private _loadCache() {
    if (this.petService.cache() && this.petService.keepAlive()) {
      const { datasize, datasource, term, limit, index, formFilter } =
        this.petService.cache()!;
      this.datasize.set(datasize);
      this.datasource.set(datasource);
      this.term.set(term);
      this.limit.set(limit);
      this.index.set(index);
      this.formFilter.patchValue(formFilter);
    } else {
      this.getData();
    }
  }

  private _saveCache() {
    this.petService.keepAlive.set(false);
    this.petService.cache.set({
      datasize: this.datasize(),
      datasource: this.datasource(),
      limit: this.limit(),
      index: this.index(),
      term: this.term(),
      formFilter: this.formFilter.value,
      districts: this.districts(),
    });
  }
}
