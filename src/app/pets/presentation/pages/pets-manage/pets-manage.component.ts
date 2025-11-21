import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
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
import { MatDialog } from '@angular/material/dialog';
import { CaptureLogComponent } from './capture-log/capture-log.component';
import PetDetailComponent from './pet-detail/pet-detail.component';

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
  private dialogRef = inject(MatDialog);

  datasource = signal<Pet[]>([]);
  datasize = signal<number>(10);

  limit = signal<number>(10);
  index = signal<number>(0);
  offset = computed<number>(() => this.limit() * this.index());
  term = signal<string>('');
  isFilterOpen = false;
  districts = this.ownerService.districts

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
    this.getData();
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
        this.datasource.set(pets);
        this.datasize.set(length);
      });
  }

  captureLog(item: Pet): void {
    this.dialogRef.open(CaptureLogComponent, {
      width: '800px',
      maxWidth: '800px',
      data: item,
    });
  }

  showDetail(item: Pet) {
    this.dialogRef.open(PetDetailComponent, {
      width: '700px',
      maxWidth: '700px',
      data: item,
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

}
