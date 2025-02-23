import { Routes } from '@angular/router';
import { provideRouter } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { NotesComponent } from './notes/notes.component';
import { NoteNewComponent } from './notes/note-new/note-new.component';
import { CategoriesComponent } from './categories/categories.component';

export const routes: Routes = [
    { path: '', redirectTo: '/notes', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'notes', component: NotesComponent },
    { path: 'notes/category/:id', component: NotesComponent },
    { path: 'notes/new', component: NoteNewComponent },
    { path: 'notes/:id', component: NotesComponent },
    { path: 'categories', component: CategoriesComponent }
  ];

  export const appRouter = provideRouter(routes);