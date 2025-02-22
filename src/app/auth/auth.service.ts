import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private backendUrl = 'http://localhost:8080/auth/';
  private http = inject(HttpClient);
  private authorized = signal<boolean>(false);
  private token: string | null;
  private username: string | null;

  constructor() {
    this.token = localStorage.getItem('jwt');
    this.username = localStorage.getItem('username');
    this.authorized.set(!!this.token);
  }

  login(username: string, password: string): Observable<any> {
    localStorage.setItem('username', username);
    return this.http
      .post(
        this.backendUrl + 'login',
        { username, password },
        { responseType: 'text' }
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          let errorMessage = 'An error occurred during login';
          if (error.error && error.error.message) {
            errorMessage = error.error.message;
          }
          console.error('Login error:', errorMessage);
          return throwError(() => new Error(errorMessage));
        })
      );
  }

  register(username: string, password: string): Observable<any> {
    return this.http
      .post(
        this.backendUrl + 'register',
        { username, password },
        { responseType: 'text' }
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          let errorMessage = 'An error occurred during registration';
          if (error.error && error.error.message) {
            errorMessage = error.error.message;
          }
          console.error('Register error:', errorMessage);
          return throwError(() => new Error(errorMessage));
        })
      );
  }

  logout() {
    localStorage.removeItem('jwt');
    localStorage.removeItem('username');
    this.authorized.set(false);
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('jwt', token);
  }

  setAuthorized() {
    this.authorized.set(true);
  }

  getAuthorized() {
    return this.authorized;
  }

  getUsername() {
    return this.username;
  }
}
