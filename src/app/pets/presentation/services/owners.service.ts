import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { environment } from '../../../../environments/environment';
import { owner, OwnerMapper } from '../../infrastructure';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OwnersService {
  private readonly url = `${environment.apiUrl}/owners`;

  constructor(private http: HttpClient) {}

  create(form: Object) {
    return this.http.post<owner>(this.url, form);
  }

  update(id: string, form: Object) {
    return this.http.patch<owner>(`${this.url}/${id}`, form);
  }

  findAll(limit: number, offset: number, term?: string) {
    const params = new HttpParams({
      fromObject: { limit, offset, ...(term && { term }) },
    });
    return this.http
      .get<{ owners: owner[]; length: number }>(this.url, { params })
      .pipe(
        map(({ owners, length }) => ({
          owners: owners.map((el) => OwnerMapper.fromResponse(el)),
          length,
        }))
      );
  }
}
