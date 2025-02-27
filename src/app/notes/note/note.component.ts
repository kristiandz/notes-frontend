import { Component, input } from '@angular/core';
import { DatePipe, SlicePipe } from '@angular/common';
import { Note } from './note.model';

@Component({
  selector: 'app-note',
  imports: [SlicePipe, DatePipe],
  templateUrl: './note.component.html',
  styleUrl: './note.component.scss',
})
export class NoteComponent {
  note = input.required<Note>();

}
