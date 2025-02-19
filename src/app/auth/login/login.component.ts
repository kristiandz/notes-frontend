import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../auth.service';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  username = signal('');
  password = signal('');
  private router = inject(Router);
  private activatedRouter = inject(ActivatedRoute);
  private authService = inject(AuthService);

  login() {
    this.authService
      .login(this.username(), this.password())
      .subscribe((response) => {
        this.authService.setToken(response);
        this.router.navigate(['/notes']);
      });
  }

  register() {
    console.log('Test');
  }
}
