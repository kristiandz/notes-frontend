import { Component, input } from '@angular/core';
import { Note } from '../note/note.model';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-note-view',
  imports: [DatePipe],
  templateUrl: './note-view.component.html',
  styleUrl: './note-view.component.scss'
})
export class NoteViewComponent {
  note = input.required<Note>();
  
}
