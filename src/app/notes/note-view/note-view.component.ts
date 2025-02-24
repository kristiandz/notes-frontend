import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import { Component, computed, inject, Input, signal } from '@angular/core';
import { CategoryService } from '../../categories/category.service';
import { Category, Note } from '../note/note.model';
import { DatePipe } from '@angular/common';
import { NotesService } from '../notes.service';
import { Router } from '@angular/router';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-note-view',
  imports: [DatePipe, FormsModule, ReactiveFormsModule],
  templateUrl: './note-view.component.html',
  styleUrl: './note-view.component.scss',
})
export class NoteViewComponent {
  @Input() note!: Note;
  private router = inject(Router);
  private notesService = inject(NotesService);
  private formBuilder = inject(FormBuilder);
  private categoryService = inject(CategoryService);

  editForm = signal<FormGroup>(this.formBuilder.group({}));
  isEditing = signal<boolean>(false);
  availableCategories = signal<Category[]>([]);
  selectedCategoryId = signal<number | null>(null);
  titleControl = computed(() => this.editForm().get('title') as FormControl);

  contentControl = computed(
    () => this.editForm().get('content') as FormControl
  );

  attachmentsArray = computed(
    () => this.editForm().get('attachments') as FormArray
  );

  get categoriesArray(): FormArray {
    return this.editForm()?.get('categories') as FormArray;
  }

  categoryControl(index: number): FormControl {
    return this.categoriesArray.at(index) as FormControl;
  }

  get categoryIndices(): number[] {
    return this.categoriesArray.controls.map((_, i) => i);
  }

  ngOnInit() {
    this.fetchCategories();
    this.editForm.set(
      this.formBuilder.group({
        title: [this.note.title],
        content: [this.note.content],
        categories: this.formBuilder.array(
          this.note.categories.map((category) =>
            this.formBuilder.control(category.name)
          )
        ),
        attachments: this.formBuilder.array(
          this.note.attachments.map((att) =>
            this.formBuilder.control(att.fileName)
          )
        ),
      })
    );
  }

  fetchCategories() {
    this.categoryService.getAllCategories().subscribe((categories) => {
      this.availableCategories.set(categories);
    });
  }

  enableEdit() {
    this.isEditing.set(true);
  }

  cancelEdit() {
    this.isEditing.set(false);
    this.editForm.set(
      this.formBuilder.group({
        title: [this.note.title],
        content: [this.note.content],
        categories: this.formBuilder.array(
          this.note.categories.map((cat) => this.formBuilder.control(cat.name))
        ),
        attachments: this.formBuilder.array(
          this.note.attachments.map((att) =>
            this.formBuilder.control(att.fileName)
          )
        ),
      })
    );
  }

  addSelectedCategory() {
    if (this.selectedCategoryId()) {
      const selectedCategory = this.availableCategories().find(
        (cat) => cat.id === this.selectedCategoryId()
      );
      if (selectedCategory && !this.note.categories.some(cat => cat.id === selectedCategory.id)) {
        this.note.categories.push(selectedCategory);
        this.categoriesArray.push(this.formBuilder.control(selectedCategory.name));
      }
    }
  }

  addCategory(categoryName: string) {
    if (categoryName && categoryName.trim()) {
      const newCategory: Category = { name: categoryName.trim() };
      this.categoryService.createCategory(newCategory).subscribe(
        (createdCategory) => {
          this.note.categories.push(createdCategory);
          this.categoriesArray.push(
            this.formBuilder.control(createdCategory.name)
          );
        },
        (error) => {
          console.error('Failed to create category', error);
        }
      );
    }
  }

  removeCategory(index: number) {
    this.categoriesArray.removeAt(index);
  }

  onFileSelected(event: any) {
    const files: FileList = event.target.files;
    for (let i = 0; i < files.length; i++) {
      this.attachmentsArray().push(this.formBuilder.control(files[i]));
    }
  }

  removeAttachment(index: number) {
    const attachmentId = this.note.attachments[index]?.id;
    if (attachmentId) {
      this.notesService.deleteAttachment(attachmentId).subscribe({
        next: () => {
          this.note.attachments = this.note.attachments.filter(
            (_, i) => i !== index
          );
          this.attachmentsArray().removeAt(index);
        },
        error: (err: any) => {
          console.error('Failed to delete attachment', err);
        },
      });
    }
  }

  saveEdit() {
    const formGroup = this.editForm();
    if (formGroup) {
      const formValue = formGroup.value;
      const formData = new FormData();
      if (formValue.title) {
        formData.append('title', formValue.title);
      }
      if (formValue.content) {
        formData.append('content', formValue.content);
      }
      if (formValue.categories && formValue.categories.length > 0) {
        formValue.categories.forEach((categoryName: string) => {
          const category = this.note.categories.find(
            (cat) => cat.name === categoryName
          );
          if (category && category.id) {
            formData.append('categories[]', category.id.toString());
          }
        });
      } else {
        console.log('No categories found to send.');
      }
      if (formValue.attachments && formValue.attachments.length > 0) {
        const newFiles: File[] = [];
        const existingAttachmentIds: number[] = [];
        formValue.attachments.forEach((attachment: any) => {
          if (attachment instanceof File) {
            newFiles.push(attachment);
          } else if (attachment.id) {
            existingAttachmentIds.push(attachment.id);
          }
        });
        newFiles.forEach((file: File) => {formData.append('attachments[]', file);
        });
        if (existingAttachmentIds.length > 0) {
          formData.append('attachmentIds[]', existingAttachmentIds.join(','));
        }
      }
      this.notesService.updateNote(this.note.id, formData).subscribe({
        next: (updatedNote) => {
          this.note = updatedNote;
          this.isEditing.set(false);
        },
        error: (err) => {
          console.error('Failed to update note', err);
        },
      });
    }
  }

  deleteNote(noteId: number) {
    this.notesService.deleteNote(noteId).subscribe(() => {
      this.router.navigate(['../']);
      this.notesService.updateFilteredNotes();
    });
  }

  downloadAttachment(attachmentId: number) {
    console.log("AttachmentId: " + attachmentId);
    this.notesService.downloadAttachment(attachmentId).subscribe(
      (response: Blob) => {
        const fileURL = window.URL.createObjectURL(response);
        saveAs(fileURL, `attachment-${attachmentId}.pdf`);
      },
      (error) => {
        console.error('Error downloading attachment:', error);
      }
    );
  }
}
