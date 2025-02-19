import { Component, inject, Signal } from '@angular/core';
import { NoteComponent } from './note/note.component';
import { HeaderComponent } from '../header/header.component';
import { NotesService } from './notes.service';

@Component({
  selector: 'app-notes',
  imports: [NoteComponent, HeaderComponent],
  templateUrl: './notes.component.html',
  styleUrl: './notes.component.scss',
})
export class NotesComponent {
  private notesService = inject(NotesService);
  notes: Signal<any[]> = this.notesService.notes;

  ngOnInit() {
    this.notesService.fetchNotes();
  }
}
