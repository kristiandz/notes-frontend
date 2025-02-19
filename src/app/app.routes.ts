import { Routes } from '@angular/router';
import { provideRouter } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { NotesComponent } from './notes/notes.component';
import { NoteComponent } from './notes/note/note.component';

export const routes: Routes = [
    { path: '', redirectTo: '/notes', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'notes', component: NotesComponent },
    { path: 'notes/:id', component: NoteComponent },
  ];

  export const appRouter = provideRouter(routes);