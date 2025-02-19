import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private backendUrl = 'http://localhost:8080/auth/login';
  private token: String | undefined;
  private authorized: Boolean = false;

  login(username: string, password: string): Observable<any> {
    return this.http.post(
      this.backendUrl,
      { username, password },
      { responseType: 'text' }
    );
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('jwt', token);
    console.log(token);
  }

  getToken() {
    return this.token;
  }

  setAuthorized() {
    !this.authorized;
  }

  isAuthorized() {}
}
