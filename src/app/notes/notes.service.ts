import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Category, Note } from './note/note.model';

@Injectable({ providedIn: 'root' })
export class NotesService {
  private http = inject(HttpClient);
  private notesUrl = 'http://localhost:8080/';
  notes = signal<Note[]>([]);
  categories = signal<Category[]>([]);

  fetchNotes() {
    this.http
      .get<any[]>(this.notesUrl  + 'notes/user/1')
      .subscribe((data) => {
        this.notes.set(data);
        this.extractCategories(data);
      });
  }

  extractCategories(notes: Note[]) {
    const categoriesMap = new Map<number, Category>(); 
    notes.forEach(note => {
      note.categories?.forEach(category => {
        categoriesMap.set(category.id, category);
      });
    });
    const uniqueCategories = Array.from(categoriesMap.values());
    this.categories.set(uniqueCategories); 
  }
}
