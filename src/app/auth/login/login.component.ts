import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../auth.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  username = signal('');
  password = signal('');
  errorMessage: string = '';
  private router = inject(Router);
  private authService = inject(AuthService);

  login() {
    this.authService.login(this.username(), this.password()).subscribe({
      next: () => {
        this.router.navigate(['/notes']);
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage =
          error.error?.message || 'Login failed. Please try again.';
        console.error('Login error:', this.errorMessage);
      },
    });
  }

  register() {
    this.authService.register(this.username(), this.password()).subscribe({
      next: () => {
        this.router.navigate(['/notes']);
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage = error.error?.message || 'An error occurred';
      },
    });
  }
}
