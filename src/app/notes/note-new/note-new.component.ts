import { Component, inject, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NotesService } from '../notes.service';
import { HeaderComponent } from "../../header/header.component";
import { Attachment, Category } from '../note/note.model';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-note-new',
  imports: [FormsModule, ReactiveFormsModule, HeaderComponent],
  templateUrl: './note-new.component.html',
  styleUrl: './note-new.component.scss'
})
export class NoteNewComponent {
  private notesService = inject(NotesService);
  private authService = inject(AuthService);
  private router = inject(Router);

  title = signal('');
  content = signal('');
  userId: number | null = this.authService.getUserId();
  categories = signal<Category[]>([]);
  attachments = signal<Attachment[]>([]);

  addCategory(categoryName: string) {
    if (categoryName.trim()) {
      const newCategory: Category = { name: categoryName.trim() };
      this.categories.update(cats => [...cats, newCategory]);
    }
  }

  removeCategory(category: Category) {
    this.categories.update(cats => cats.filter(c => c !== category));
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      const filesArray = Array.from(input.files);
      filesArray.forEach(file => {
        const newAttachment: Attachment = {
          fileName: file.name,
          fileType: file.type
        };
        this.attachments.update(existing => [...existing, newAttachment]);
      });
    }
  }

  removeAttachment(file: Attachment) {
    this.attachments.update(files => files.filter(f => f !== file));
  }

  saveNote() {
    const newNote = { 
      title: this.title(), 
      content: this.content(), 
      userId: this.userId,
      categories: this.categories(),
      attachments: this.attachments()
    };
    const formData = new FormData();
    formData.append('note', JSON.stringify(newNote));
    console.log(newNote);
    this.attachments().forEach((attachment, index) => {
      const file = new File([], attachment.fileName, { type: attachment.fileType });
      formData.append('attachments', file, attachment.fileName);
    });
    this.notesService.addNoteWithAttachments(formData).subscribe(() => {
      this.router.navigate(['/notes']);
    });
  }

  cancel() {
    this.router.navigate(['/notes']);
  }
  
}
