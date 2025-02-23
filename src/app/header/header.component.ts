import { Component, inject } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { NotesService } from '../notes/notes.service';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
    private authService = inject(AuthService);
    private router = inject(Router);
    private notesService = inject(NotesService);
    headerTitle = this.notesService.headerTitle;

    logout() {
      this.router.navigate(['login']);
      this.authService.logout();
    }
}
