// vehicle-catalog.component.ts

import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { VehicleService } from '../../services/vehicle.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { CartDialogComponent } from '../cart-dialog/cart-dialog.component';
import { Router } from '@angular/router';
import { Vehicle } from '../../models/vehicle.model';
import { LoadingService } from '../../services/loading.service';

@Component({
  selector: 'app-vehicle-catalog',
  templateUrl: './vehicle-catalog.component.html',
  styleUrls: ['./vehicle-catalog.component.scss'],
})
export class VehicleCatalogComponent implements OnInit {
  displayedColumns: string[] = ['model', 'make', 'color', 'year', 'price', 'actions'];
  dataSource = new MatTableDataSource<Vehicle>();
  userProfile: any;
  isLoading: boolean = true; // Add loading state variable

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private vehicleService: VehicleService,
    private dialog: MatDialog,
    private router: Router,
    private loadingService: LoadingService,
    private changeDetectorRef: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.getVehicleCatalog();
  }

  getVehicleCatalog() {
    this.loadingService.show(); // Show the loading spinner
    this.vehicleService.getVehicleCatalog().subscribe(
      (data: Vehicle[]) => {
        this.dataSource.data = data;
        this.dataSource.paginator = this.paginator;

        // Manually trigger change detection
        this.changeDetectorRef.detectChanges();
        this.loadingService.hide(); // Hide the loading spinner after data is loaded
      },
      (error) => {
        console.error('Error fetching vehicle catalog:', error);
      }
    );
  }

  addToCart(vehicle: Vehicle) {
    const dialogRef = this.dialog.open(CartDialogComponent, {
      data: { vehicle },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'confirm') {
        // Handle the confirmed action (e.g., call a service to add the vehicle to the cart)
        console.log('after closed', vehicle);
        this.purchaseVehicle(vehicle);
      }
    });
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

  purchaseVehicle(vehicle: Vehicle) {
    this.userProfile = JSON.parse(localStorage.getItem('user_data') || '{}');

    const transactionData = {
      transaction_id: this.generateUUID(),
      user_id: this.userProfile.user_id,
      vehicle_id: vehicle.vehicle_id,
      transaction_date: new Date().toISOString(),
      transaction_type: 'Purchased',
      status: 'Completed',
    };

    this.vehicleService.purchaseVehicle(transactionData).subscribe(
      (response) => {
        console.log('Vehicle purchased successfully:', response);

        // Redirect to transactions page upon successful purchase
        this.router.navigate(['/transactions']);
      },
      (error) => {
        console.error('Error purchasing vehicle:', error);
      }
    );
  }
}
