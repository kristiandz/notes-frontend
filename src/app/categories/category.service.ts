import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from '../notes/note/note.model';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private apiUrl = "http://localhost:8080";

  headers = new HttpHeaders({
    'Content-Type': 'application/json',
  });

  constructor(private http: HttpClient) {}

  createCategory(category: Category): Observable<Category> {
    return this.http.post<Category>(this.apiUrl+"/categories", category, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    });
  }

  removeCategory(categoryId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/categories${categoryId}`);
  }
}
