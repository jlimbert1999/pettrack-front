import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, tap } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { owner, OwnerMapper } from '../../infrastructure';

@Injectable({
  providedIn: 'root',
})
export class OwnersService {
  private readonly url = `${environment.apiUrl}/owners`;

  constructor(private http: HttpClient) {}

  create(form: Object) {
    return this.http
      .post<owner>(this.url, form)
      .pipe(map((resp) => OwnerMapper.fromResponse(resp)));
  }

  update(id: string, form: Object) {
    return this.http
      .patch<owner>(`${this.url}/${id}`, form)
      .pipe(map((resp) => OwnerMapper.fromResponse(resp)));
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

  getDistricts() {
    return this.http.get<{ id: number; name: string }[]>(
      `${this.url}/districts`
    );
  }
}
