import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { pet, PetMapper } from '../../infrastructure';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PetsService {
  private readonly url = `${environment.apiUrl}/pets`;

  constructor(private http: HttpClient) {}

  findAll(limit: number, offset: number, term?: string) {
    const params = new HttpParams({
      fromObject: { limit, offset, ...(term && { term }) },
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
}
