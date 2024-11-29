import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { pet, PetMapper } from '../../infrastructure';
import { breed } from '../../../administration/infrastructure';

interface findProps {
  limit: number;
  offset: number;
  term?: string;
  formFilter: Object;
}
@Injectable({
  providedIn: 'root',
})
export class PetsService {
  private readonly url = `${environment.apiUrl}/pets`;

  constructor(private http: HttpClient) {}

  findAll({ limit, offset, term, formFilter }: findProps) {
    const filteredProps = Object.fromEntries(
      Object.entries(formFilter).filter(([_, value]) => value)
    );
    const params = new HttpParams({
      fromObject: { limit, offset, ...(term && { term }), ...filteredProps },
    });
    return this.http
      .get<{ pets: pet[]; length: number }>(this.url, { params })
      .pipe(
        map(({ pets, length }) => ({
          pets: pets.map((el) => PetMapper.fromResponse(el)),
          length,
        }))
      );
  }

  getDetail(id: string) {
    return this.http
      .get<pet>(`${this.url}/${id}`)
      .pipe(map((resp) => PetMapper.fromResponse(resp)));
  }

  getBreeds(species?: string) {
    const params = new HttpParams({
      fromObject: { ...(species && { species }) },
    });
    return this.http.get<breed[]>(`${this.url}/types/breeds`, { params });
  }
}
