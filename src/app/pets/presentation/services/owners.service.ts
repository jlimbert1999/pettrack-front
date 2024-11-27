import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { owner, OwnerMapper, PetMapper } from '../../infrastructure';

@Injectable({
  providedIn: 'root',
})
export class OwnersService {
  private readonly url = `${environment.apiUrl}/owners`;

  constructor(private http: HttpClient) {}

  create(form: Object) {
    return this.http.post<owner>(this.url, form).pipe(
      map((resp) => ({
        owner: OwnerMapper.fromResponse(resp),
        pets: resp.pets.map((pet) => PetMapper.fromResponse(pet)),
      }))
    );
  }

  update(ownerId: string, form: Object) {
    return this.http.patch<owner>(`${this.url}/${ownerId}`, form).pipe(
      map((resp) => ({
        owner: OwnerMapper.fromResponse(resp),
        pets: resp.pets.map((pet) => PetMapper.fromResponse(pet)),
      }))
    );
  }

  findAll(limit: number, offset: number, term?: string) {
    const params = new HttpParams({
      fromObject: { limit, offset, ...(term && { term }) },
    });
    return this.http
      .get<{ owners: owner[]; length: number }>(this.url, { params })
      .pipe(
        map(({ owners, length }) => ({
          data: owners.map((resp) => ({
            owner: OwnerMapper.fromResponse(resp),
            pets: resp.pets.map((pet) => PetMapper.fromResponse(pet)),
          })),
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
