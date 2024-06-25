import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit {
  userProfile: any; // Replace 'any' with your user profile interface or type

  ngOnInit(): void {
    // Load user profile from local storage
    this.userProfile = JSON.parse(localStorage.getItem('user_data') || '{}');
  }
}
