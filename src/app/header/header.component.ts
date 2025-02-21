import { Component, inject } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
    private authService = inject(AuthService);
    private router = inject(Router);
    
    logout() {
      this.router.navigate(['login']);
      this.authService.logout();
    }
}
