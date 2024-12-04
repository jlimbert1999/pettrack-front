import { Injectable, computed, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';
import { Observable, of } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { iwtPayload, menu } from '../../infrastructure';

interface loginProps {
  login: string;
  password: string;
  remember: boolean;
}
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly base_url: string = environment.apiUrl;
  private _user = signal<iwtPayload | null>(null);
  private _menu = signal<menu[]>([]);

  public user = computed(() => this._user());
  public menu = computed(() => this._menu());

  constructor(private http: HttpClient) {}

  login({ login, password, remember }: loginProps) {
    if (remember) {
      localStorage.setItem('login', login);
    } else {
      localStorage.removeItem('login');
    }
    return this.http
      .post<{ token: string }>(`${this.base_url}/auth`, {
        login,
        password,
      })
      .pipe(map(({ token }) => this._setAuthentication(token)));
  }

  logout() {
    localStorage.removeItem('token');
    this._user.set(null);
  }

  checkAuthStatus() {
    const token = localStorage.getItem('token');
    if (!token) {
      this.logout();
      return of(false);
    }
    return this.http
      .get<{
        token: string;
        menu: menu[];
      }>(`${this.base_url}/auth`)
      .pipe(
        tap(({ menu }) => this._menu.set(menu)),
        map(({ token }) => this._setAuthentication(token)),
        catchError(() => {
          this.logout();
          return of(false);
        })
      );
  }

  private _setAuthentication(token: string): boolean {
    this._user.set(jwtDecode(token));
    localStorage.setItem('token', token);
    return true;
  }
}
