import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { environment } from '../../../../environments/environment';
import { typeTreatment } from '../../infrastructure';

@Injectable({
  providedIn: 'root',
})
export class TypeTreatmentService {
  private readonly url = `${environment.apiUrl}/types-treatments`;
  constructor(private http: HttpClient) {}

  add(form: Object) {
    return this.http.post<any>(`${this.url}`, form);
  }

  get(limit: number, offset: number) {
    const params = new HttpParams({ fromObject: { limit, offset } });
    return this.http.get<{
      treatments: typeTreatment[];
      length: number;
    }>(`${this.url}`, { params });
  }

  edit(id: number, form: Object) {
    return this.http.patch<typeTreatment>(`${this.url}/${id}`, form);
  }
}
