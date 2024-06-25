import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-vehicle-dialog',
  template: `
    <h1 mat-dialog-title>Confirm Deletion</h1>
    <div mat-dialog-content>
      <p>Are you sure you want to delete this vehicle?</p>
    </div>
    <div mat-dialog-actions>
      <button mat-button mat-dialog-close color="primary">Cancel</button>
      <button mat-button [mat-dialog-close]="true" color="warn">Delete</button>
    </div>
  `,
})
export class DeleteVehicleDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<DeleteVehicleDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
}
