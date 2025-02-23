import { ClickOutsideDirective } from '../shared/click-outside.directive';
import { NoteViewComponent } from './note-view/note-view.component';
import { HeaderComponent } from '../header/header.component';
import { Component, inject, Signal } from '@angular/core';
import { NoteComponent } from './note/note.component';
import { NotesService } from './notes.service';
import { CommonModule } from '@angular/common';
import { Note } from './note/note.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-notes',
  imports: [CommonModule,NoteComponent, HeaderComponent, NoteViewComponent, ClickOutsideDirective],
  templateUrl: './notes.component.html',
  styleUrl: './notes.component.scss',
})
export class NotesComponent {
  private notesService = inject(NotesService);
  private route = inject(ActivatedRoute);
  notes: Signal<Note[]> = this.notesService.filteredNotes;
  selectedNote = this.notesService.selectedNote;

  ngOnInit() {
    this.notesService.fetchNotes();
    this.route.params.subscribe((params) => {
      const categoryId = params['id'] ? +params['id'] : undefined;
      this.notesService.setCategory(categoryId);
    });
  }

  selectNote(id: number) {
    this.notesService.selectedNote.set((this.notes()[id]));
  }

  closeSelectedNote() {
    this.notesService.selectedNote.set((undefined));
  }
}
