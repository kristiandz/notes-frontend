import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class NotesService {
  private http = inject(HttpClient);
  private notesUrl = 'http://localhost:8080/notes/user/2';
  notes = signal<any[]>([]);

  fetchNotes() {
    this.http
      .get<any[]>(this.notesUrl)
      .subscribe((data) => this.notes.set(data));
  }
}
