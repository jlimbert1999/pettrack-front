import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';

import { SearchInputComponent } from '../../../../shared';
import { UserService } from '../../services/user.service';
import { user } from '../../../infrastructure';
import { UserDialogComponent } from './user-dialog/user-dialog.component';

@Component({
  selector: 'app-users-manage',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatPaginatorModule,
    MatToolbarModule,
    MatIconModule,
    SearchInputComponent,
  ],
  templateUrl: './users-manage.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class UsersManageComponent implements OnInit {
  private userService = inject(UserService);
  readonly dialogRef = inject(MatDialog);

  datasource = signal<user[]>([]);
  datasize = signal(0);

  limit = signal(10);
  index = signal(0);
  offset = computed(() => this.limit() * this.index());
  term = signal<string>('');

  displayedColumns: string[] = ['login', 'fullname', 'status', 'options'];

  ngOnInit(): void {
    this.getData();
  }

  getData() {
    this.userService
      .findAll(this.limit(), this.offset(), this.term())
      .subscribe(({ users, length }) => {
        this.datasource.set(users);
        this.datasize.set(length);
      });
  }

  create() {
    const dialogRef = this.dialogRef.open(UserDialogComponent, {
      width: '600px',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (!result) return;
      this.datasource.update((values) => [result, ...values]);
      this.datasize.update((value) => (value += 1));
    });
  }

  update(user: user) {
    const dialogRef = this.dialogRef.open(UserDialogComponent, {
      width: '600px',
      data: user,
    });
    dialogRef.afterClosed().subscribe((result?: user) => {
      if (!result) return;
      this.datasource.update((values) => {
        const index = values.findIndex((value) => value.id === result.id);
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

  search(term: string) {
    this.index.set(0);
    this.term.set(term);
    this.getData();
  }
}
