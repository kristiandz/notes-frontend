import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private backendUrl = 'http://localhost:8080/auth/';
  private http = inject(HttpClient);
  private authorized = signal<boolean>(false);
  private token: string | null;
  private username: string | null;
  private userId: number | null;

  constructor() {
    this.token = localStorage.getItem('jwt');
    this.username = localStorage.getItem('username');
    this.userId = localStorage.getItem('userId') ? parseInt(localStorage.getItem('userId')!) : null;
    this.authorized.set(!!this.token);
  }

  private storeAuthData(response: any) {
    this.authorized.set(true);
    this.token = response.token;
    this.userId = response.userId;
    this.username = response.username;
    localStorage.setItem('jwt', this.token!);
    localStorage.setItem('userId', this.userId!.toString());
  }

  login(username: string, password: string): Observable<any> {
    localStorage.setItem('username', username);
    return this.http
      .post<Map<string, any>>(this.backendUrl + 'login', { username, password })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          let errorMessage = 'An error occurred during login';
          if (error.error && error.error.message) {
            errorMessage = error.error.message;
          }
          console.error('Login error:', errorMessage);
          return throwError(() => new Error(errorMessage));
        }),
        tap((response) => {
          console.log('Login response:', response);
          this.storeAuthData(response);
        })
      );
  }

  register(username: string, password: string): Observable<any> {
    return this.http
      .post<Map<string, any>>(this.backendUrl + 'register', { username, password })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          let errorMessage = 'An error occurred during registration';
          if (error.error && error.error.message) {
            errorMessage = error.error.message;
          }
          console.error('Register error:', errorMessage);
          return throwError(() => new Error(errorMessage));
        }),
        tap((response) => {
          console.log('Register response:', response);
          this.storeAuthData(response);
        })
      );
  }

  logout() {
    localStorage.removeItem('jwt');
    localStorage.removeItem('username');
    this.authorized.set(false);
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

  getUserId() {
    return this.userId;
  }
}
