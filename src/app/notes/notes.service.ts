import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Category, Note } from './note/note.model';
import { catchError, Observable, tap, throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NotesService {
  private http = inject(HttpClient);
  private notesUrl = 'http://localhost:8080/';

  notes = signal<Note[]>([]);
  categories = signal<Category[]>([]);
  selectedNote = signal<Note | undefined>(undefined);
  selectedCategory = signal<number | null>(null);
  filteredNotes = signal<Note[]>([]);

  fetchNotes() {
    this.http.get<any[]>(this.notesUrl + 'notes/user/1').subscribe((data) => {
      this.notes.set(data);
      this.extractCategories(data);
      this.updateFilteredNotes();
    });
  }

  extractCategories(notes: Note[]) {
    const categoriesMap = new Map<number, Category>();
    notes.forEach((note) => {
      note.categories?.forEach((category) => {
        categoriesMap.set(category.id, category);
      });
    });
    const uniqueCategories = Array.from(categoriesMap.values());
    this.categories.set(uniqueCategories);
  }

  updateFilteredNotes() {
    const categoryId = this.selectedCategory();
    if (categoryId === null) {
      this.filteredNotes.set(this.notes());
    } else {
      const filtered = this.notes().filter((note) =>
        note.categories.some((category) => category.id === categoryId)
      );
      this.filteredNotes.set(filtered);
    }
  }

  setCategory(categoryId: number | null) {
    this.selectedCategory.set(categoryId);
    this.updateFilteredNotes();
  }

  deleteNote(noteId: number): Observable<void> {
    return this.http.delete<void>(`${this.notesUrl}notes/${noteId}`).pipe(
      tap(() => {
        this.notes.set(this.notes().filter((note) => note.id !== noteId));
        this.selectedNote.set(undefined);
      }),
      catchError((error) => {
        console.error('Failed to delete note:', error);
        return throwError(() => new Error('Failed to delete note'));
      })
    );
  }

  updateNote(note: Note): Observable<Note> {
    return this.http.put<Note>(`${this.notesUrl}notes/${note.id}`, note).pipe(
      tap((updatedNote: Note) => {
        const updatedNotes = this.notes().map(n => n.id === updatedNote.id ? updatedNote : n);
        this.notes.set(updatedNotes);
        this.updateFilteredNotes();
      }),
      catchError(error => {
        console.error('Update note failed:', error);
        return throwError(() => new Error('Failed to update note'));
      })
    );
  }

}
