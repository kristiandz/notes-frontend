import { Component, input } from '@angular/core';
import { SlicePipe } from '@angular/common';
import { Note } from './note.model';

@Component({
  selector: 'app-note',
  imports: [SlicePipe],
  templateUrl: './note.component.html',
  styleUrl: './note.component.scss'
})
export class NoteComponent {
  note = input.required<Note>();
}
