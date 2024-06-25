import { Component } from '@angular/core';
import { UserService } from './services/user.service';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'VMS';
  isLoading!: boolean;

  constructor(private authService: AuthService) {}

  ngOnInit() {
  }

  // Logout function
  logout(): void {
    this.authService.logout();
  }

  // Check if the user is authenticated
  isAuthenticated(): boolean {
    return this.authService.isLoggedIn(); // Update with your actual method
  }
}
