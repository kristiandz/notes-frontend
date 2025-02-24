import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Category } from '../notes/note/note.model';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private apiUrl = 'http://localhost:8080';
  categories = signal<Category[]>([]);

  headers = new HttpHeaders({
    'Content-Type': 'application/json',
  });

  constructor(private http: HttpClient) {}

  createCategory(category: Category): Observable<Category> {
    return this.http.post<Category>(this.apiUrl + '/categories', category, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    });
  }

  getAllCategories(): Observable<Category[]> {
    return this.http
      .get<Category[]>(`${this.apiUrl}/categories`)
      .pipe(tap((categories) => this.categories.set(categories)));
  }

  removeCategory(categoryId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/categories/${categoryId}`);
  }

  fetchCategories(): void {
    this.getAllCategories().subscribe();
  }
}
