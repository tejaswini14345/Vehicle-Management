import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-user-registration',
  templateUrl: './user-registration.component.html',
  styleUrls: ['./user-registration.component.scss'],
})
export class UserRegistrationComponent {
  // Define a FormGroup to manage your form controls
  registrationForm: FormGroup;
  Roles: any = ["Admin", "User"];

  constructor(
    private userService: UserService,
    private router: Router,
    private formBuilder: FormBuilder, // Inject the form builder
  ) {
    // Initialize the form with default values and validators
    this.registrationForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      role: ['', Validators.required],
    });
  }

  registerUser() {
    // Check if the form is valid
    if (this.registrationForm.valid) {
      const registrationData = this.registrationForm.value;

      this.userService.registerUser(registrationData).subscribe(
        (response) => {
          console.log('User registered successfully', registrationData);
          // Redirect to login page on successful registration
          this.router.navigate(['/login']);
        },
        (error) => {
          console.error('Error registering user:', error);
          // Handle error, e.g., show an error message to the user
        }
      );
    }
  }
}
