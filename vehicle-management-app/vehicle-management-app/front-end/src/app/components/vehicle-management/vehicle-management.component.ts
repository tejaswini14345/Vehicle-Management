import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { VehicleService } from '../../services/vehicle.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { AddVehicleDialogComponent } from '../add-vehicle-dialog/add-vehicle-dialog.component';
import { EditVehicleDialogComponent } from '../edit-vehicle-dialog/edit-vehicle-dialog.component';
import { Vehicle } from '../../models/vehicle.model';
import { DeleteVehicleDialogComponent } from '../delete-vehicle-dialog/delete-vehicle-dialog.component';

@Component({
  selector: 'app-vehicle-management',
  templateUrl: './vehicle-management.component.html',
  styleUrls: ['./vehicle-management.component.scss'],
})
export class VehicleManagementComponent implements OnInit {
  displayedColumns: string[] = ['model', 'make', 'color', 'year', 'price', 'actions'];
  dataSource = new MatTableDataSource<Vehicle>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private vehicleService: VehicleService,
    private dialog: MatDialog,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.getVehicleCatalog();
  }

  getVehicleCatalog() {
    this.vehicleService.getVehicleCatalog().subscribe(
      (data: Vehicle[]) => {
        this.dataSource.data = data;
        this.dataSource.paginator = this.paginator;
        this.changeDetectorRef.detectChanges();
      },
      (error) => {
        console.error('Error fetching vehicle catalog:', error);
      }
    );
  }

  openAddDialog() {
    const dialogRef = this.dialog.open(AddVehicleDialogComponent, {
      width: '400px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'added') {
        this.getVehicleCatalog(); // Refresh the table after adding a vehicle
      }
    });
  }

  openEditDialog(vehicle: Vehicle) {
    const dialogRef = this.dialog.open(EditVehicleDialogComponent, {
      width: '400px',
      data: { vehicle },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'edited') {
        this.getVehicleCatalog(); // Refresh the table after editing a vehicle
      }
    });
  }

  deleteVehicle(vehicle: Vehicle): void {
    const dialogRef = this.dialog.open(DeleteVehicleDialogComponent);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.vehicleService.deleteVehicle(vehicle.vehicle_id).subscribe(() => {
          // Refresh the vehicle catalog after deletion
          this.getVehicleCatalog();
        });
      }
    });
  }
}
