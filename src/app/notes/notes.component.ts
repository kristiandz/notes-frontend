import { ClickOutsideDirective } from '../shared/click-outside.directive';
import { NoteViewComponent } from './note-view/note-view.component';
import { HeaderComponent } from '../header/header.component';
import { Component, inject, Signal } from '@angular/core';
import { NoteComponent } from './note/note.component';
import { NotesService } from './notes.service';
import { Note } from './note/note.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-notes',
  imports: [NoteComponent, HeaderComponent, NoteViewComponent, ClickOutsideDirective],
  templateUrl: './notes.component.html',
  styleUrl: './notes.component.scss',
})
export class NotesComponent {
  private notesService = inject(NotesService);
  private router = inject(Router);
  notes: Signal<any[]> = this.notesService.notes;
  selectedNote: Note | undefined = undefined;

  ngOnInit() {
    this.notesService.fetchNotes();
  }

  selectNote(id: number) {
    this.selectedNote = this.notes()[id];
  }

  closeSelectedNote() {
    this.selectedNote = undefined;
  }
}
