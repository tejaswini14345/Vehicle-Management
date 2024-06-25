import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Vehicle } from '../../models/vehicle.model';
import { VehicleService } from '../../services/vehicle.service';

@Component({
  selector: 'app-edit-vehicle-dialog',
  templateUrl: './edit-vehicle-dialog.component.html',
  styleUrls: ['./edit-vehicle-dialog.component.scss'],
})
export class EditVehicleDialogComponent implements OnInit {
  vehicle: Vehicle;

  constructor(
    public dialogRef: MatDialogRef<EditVehicleDialogComponent>,
    public dialog: MatDialog,
    private vehicleService: VehicleService,
    @Inject(MAT_DIALOG_DATA) public data: { vehicle: Vehicle }
  ) {
    this.vehicle = { ...data.vehicle };
  }

  ngOnInit(): void {
    // No need to call getVehicleCatalog here
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  onSaveClick(): void {
    // Implement the logic to save the edited vehicle
    this.vehicleService.updateVehicle(this.vehicle).subscribe(
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
