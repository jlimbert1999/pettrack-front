import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MedicalCenterService {
  private readonly url = `${environment.apiUrl}/centers`;
  constructor(private http: HttpClient) {}

  add(form: Object) {
    return this.http.post<any>(`${this.url}`, form);
  }

  get(limit: number, offset: number) {
    const params = new HttpParams({ fromObject: { limit, offset } });
    return this.http.get<{
      medicalCenters: any[];
      length: number;
    }>(`${this.url}`, { params });
  }

  edit(id: number, form: Object) {
    return this.http.patch<any>(`${this.url}/${id}`, form);
  }
}
