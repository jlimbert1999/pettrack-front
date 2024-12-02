import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map } from 'rxjs';

import { environment } from '../../../../environments/environment';
import {
  medicalCenter,
  typeTreatment,
} from '../../../administration/infrastructure';
import { treatment } from '../../infrastructure';

@Injectable({
  providedIn: 'root',
})
export class TreatmentService {
  private http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/treatments`;

  getMedicalCenters() {
    return this.http.get<medicalCenter[]>(`${this.url}/centers`);
  }

  getCategoires() {
    return this.http
      .get<{ category: string }[]>(`${this.url}/categories`)
      .pipe(map((resp) => resp.map((el) => el.category)));
  }

  getPetTreatments(petId: string, category?: string) {
    const params = new HttpParams({
      fromObject: { ...(category && { category }) },
    });
    return this.http.get<treatment[]>(`${this.url}/pet/${petId}`, { params });
  }

  getTypeTreatments(category?: string) {
    const params = new HttpParams({
      fromObject: { ...(category && { category }) },
    });
    return this.http.get<typeTreatment[]>(`${this.url}/types`, { params });
  }

  create(form: Object) {
    return this.http.post<treatment>(this.url, { ...form });
  }
}
