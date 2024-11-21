import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { breed } from '../../infrastructure';

@Injectable({
  providedIn: 'root',
})
export class BreedService {
  private readonly url = `${environment.apiUrl}/breeds`;
  constructor(private http: HttpClient) {}

  add(form: Object) {
    return this.http.post<any>(`${this.url}`, form);
  }

  get(limit: number, offset: number) {
    const params = new HttpParams({ fromObject: { limit, offset } });
    return this.http.get<{
      breeds: breed[];
      length: number;
    }>(`${this.url}`, { params });
  }

  edit(id: number, form: Object) {
    return this.http.patch<breed>(`${this.url}/${id}`, form);
  }
}
