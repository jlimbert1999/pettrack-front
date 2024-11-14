import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class PetService {
  private readonly url = `${environment.apiUrl}/pets`;

  constructor(private http: HttpClient) {}

  create(form: Object) {
    return this.http.post(`${this.url}`, form);
  }
}
