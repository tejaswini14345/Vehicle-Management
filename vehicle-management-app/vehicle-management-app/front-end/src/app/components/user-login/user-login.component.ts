import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.scss'],
})
export class UserLoginComponent {
  email: string = '';
  password: string = '';
  role: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  loginUser() {
    const loginData = {
      email: this.email,
      password: this.password,
      role: this.role,
    };

    this.authService.authenticateUser(loginData).subscribe(
      (response) => {
        console.log('response', response);
        if (response.role === 'Admin') {
          this.router.navigate(['/vehicle-management']);
        }
        else {
          this.router.navigate(['/home']);
        }
        console.log('Authentication successful');
        // Redirect to home page on successful login
      },
      (error) => {
        console.error('Authentication failed:', error);
        // Handle authentication failure, e.g., show an error message to the user
      },
    );
  }
}
