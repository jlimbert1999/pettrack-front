import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../../environments/environment';
import { owner } from '../../infrastructure';

@Injectable({
  providedIn: 'root',
})
export class PetService {
  private readonly url = `${environment.apiUrl}/pets`;

  constructor(private http: HttpClient) {}

  create(form: Object) {
    return this.http.post<owner>(`${this.url}/owner`, form);
  }

  update(id: string, form: Object) {
    return this.http.patch<owner>(`${this.url}/owner/${id}`, form);
  }

  findAll() {
    return this.http.get<{ owners: owner[]; length: number }>(
      `${this.url}/owner`
    );
  }
}
