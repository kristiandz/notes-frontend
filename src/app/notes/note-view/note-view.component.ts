import { Component, inject, input } from '@angular/core';
import { Note } from '../note/note.model';
import { DatePipe } from '@angular/common';
import { NotesService } from '../notes.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-note-view',
  imports: [DatePipe],
  templateUrl: './note-view.component.html',
  styleUrl: './note-view.component.scss'
})
export class NoteViewComponent {
  note = input.required<Note>();
  private router = inject(Router);
  private notesService = inject(NotesService);
  
  deleteNote(noteId: number){
    this.notesService.deleteNote(noteId).subscribe(() => {
      this.router.navigate(['../']);
      this.notesService.updateFilteredNotes();
    });
  }

}
