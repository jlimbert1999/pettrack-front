import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { pet } from '../../infrastructure';

@Injectable({
  providedIn: 'root',
})
export class PetsService {
  private readonly url = `${environment.apiUrl}/pets`;

  constructor(private http: HttpClient) {}

  findAll() {
    return this.http.get<{ pets: pet[]; length: number }>(this.url).pipe();
  }
}
