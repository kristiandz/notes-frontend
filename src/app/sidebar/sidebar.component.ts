import { Component, Signal, createNgModuleRef, inject } from '@angular/core';
import { NotesService } from '../notes/notes.service';
import { AuthService } from '../auth/auth.service';
import { Category, Note } from '../notes/note/note.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  imports: [],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  private notesService = inject(NotesService);
  private authService = inject(AuthService);
  private router = inject(Router);
  categories: Signal<Category[]> = this.notesService.categories;
  username = this.authService.getUsername();
  isAuthorized = this.authService.getAuthorized();


  changeCategory(categoryId: number | undefined) {
    this.notesService.setCategory(categoryId);
    if (categoryId !== undefined) {
      this.router.navigate(['/notes/category', categoryId]);
    } else {
      this.router.navigate(['/notes']);
    }
  }

  clearCategoryFilter(){
    this.changeCategory(undefined);
    this.router.navigate(['/notes']);
  }

  addNewNote(){
    this.router.navigate(['/notes/new']);
  }

  manageCategories(){
    this.router.navigate(['/categories']);
  }
}
