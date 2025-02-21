import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class NotesService {
  private http = inject(HttpClient);
  private notesUrl = 'http://localhost:8080/';
  notes = signal<any[]>([]);
  categories = signal<any[]>([]);

  fetchNotes() {
    this.http
      .get<any[]>(this.notesUrl  + 'notes/user/1')
      .subscribe((data) => this.notes.set(data));
  }

  fetchCategories() {
    this.http
      .get<any[]>(this.notesUrl + 'categories')
      .subscribe((data) => this.categories.set(data));
  }
}
