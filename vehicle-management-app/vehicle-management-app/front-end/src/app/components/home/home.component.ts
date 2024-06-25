// home.component.ts

import { Component, OnInit } from '@angular/core';
import { VehicleService } from '../../services/vehicle.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  totalVehicles: number = 0;
  totalUsers: number = 0;
  userProfile: any;

  constructor(
    private vehicleService: VehicleService,
  ) {}

  ngOnInit(): void {
    this.getTotalVehicles();
    this.userProfile = JSON.parse(localStorage.getItem('user_data') || '{}');
  }

  getTotalVehicles(): void {
    this.vehicleService.getVehicleCatalog().subscribe(
      (vehicles) => {
        this.totalVehicles = vehicles.length;
      },
      (error) => {
        console.error('Error fetching total vehicles:', error);
      }
    );
  }
}
