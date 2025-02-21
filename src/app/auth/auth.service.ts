import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private backendUrl = 'http://localhost:8080/auth/login';
  private http = inject(HttpClient);
  private authorized = signal<boolean>(false);
  private token: string | null;
  private username: string | null;

  constructor(){
    this.token = localStorage.getItem('jwt');
    this.username = localStorage.getItem('username');
    this.authorized.set(!!this.token);
  }

  login(username: string, password: string): Observable<any> {
    localStorage.setItem('username', username);
    return this.http.post(
      this.backendUrl,
      { username, password },
      { responseType: 'text' }
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
