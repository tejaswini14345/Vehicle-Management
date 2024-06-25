import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'https://zgfiqz1qq9.execute-api.us-east-2.amazonaws.com/dev';

  constructor(private http: HttpClient, private router: Router) {}

  registerUser(user: any): Observable<any> {
    // Ensure that user_id is included in the request payload
    if (!user.user_id) {
      user.user_id = this.generateUUID();
    }

    // Define custom headers
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    });

    // Include headers in the request options
    const options = { headers };

    // Use http.post with options for registration
    return this.http.post(`${this.apiUrl}/user-registration`, user, options);
  }

  // Function to generate UUID
  private generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
      /[xy]/g,
      function (c) {
        var r = (Math.random() * 16) | 0,
          v = c == 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }
    );
  }
}
