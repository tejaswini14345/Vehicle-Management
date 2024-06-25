import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Vehicle } from '../../models/vehicle.model';
import { VehicleService } from '../../services/vehicle.service';

@Component({
  selector: 'app-add-vehicle-dialog',
  templateUrl: './add-vehicle-dialog.component.html',
  styleUrls: ['./add-vehicle-dialog.component.scss'],
})
export class AddVehicleDialogComponent {
  vehicle: Vehicle = {
    model: '',
    make: '',
    color: '',
    year: '',
    price: '',
    vehicle_id: ''
  };

  constructor(public dialogRef: MatDialogRef<AddVehicleDialogComponent>,
    public dialog: MatDialog,
    private vehicleService: VehicleService,) {}

  onCancelClick(): void {
    this.dialogRef.close();
  }

  onSaveClick(): void {
    // Implement the logic to save the edited vehicle
    this.vehicleService.addVehicle(this.vehicle).subscribe(
      (updatedVehicle) => {
        console.log('Vehicle updated successfully', updatedVehicle);
        this.dialogRef.close('edited');
      },
      (error) => {
        console.error('Error updating vehicle', error);
        // Handle error as needed
      }
    );
  }
}
