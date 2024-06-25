import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'https://zgfiqz1qq9.execute-api.us-east-2.amazonaws.com/dev';

  constructor(private http: HttpClient, private router: Router) {}

  authenticateUser(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/user/auth`, user).pipe(
      // Handle the authentication response and store user data in the session
      tap((response: any) => {
        console.log('User Data', response);
        this.storeUserData(response);
        if (response && response.status === 200) {
          this.storeUserData(response.body);
        }
      }),
    );
  }

  // Function to check if the user is authenticated
  isLoggedIn(): boolean {
    // Retrieve the object from localStorage
    const storedUserData = localStorage.getItem('user_data');

    // Check if the object exists and is not empty
    return !!storedUserData;
  }

  // Store user data in the session
  private storeUserData(userData: any): void {
    console.log('Store UserData', userData);

    // Create an object with user data
    const userObject = {
      user_id: userData.user_id,
      name: userData.name,
      email: userData.email,
    };

    // Store the object in localStorage
    localStorage.setItem('user_data', JSON.stringify(userObject));
  }

  // Get user data from the session
  getUserData(): any {
    // Retrieve the object from localStorage
    const storedUserData = localStorage.getItem('user_data');

    // Parse the JSON string into an object
    const userObject = JSON.parse(storedUserData || '{}');

    return userObject;
  }

  // Clear user data from the session on logout and redirect to login page
  logout(): void {
    // Remove the entire user data object from localStorage
    localStorage.removeItem('user_data');

    // Redirect to the login page
    this.router.navigate(['/login']);
  }
}
