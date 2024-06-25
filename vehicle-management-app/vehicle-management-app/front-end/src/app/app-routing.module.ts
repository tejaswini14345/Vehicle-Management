// app-routing.module.ts

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from '../app/components/home/home.component';
import { UserLoginComponent } from '../app/components/user-login/user-login.component';
import { UserRegistrationComponent } from '../app/components/user-registration/user-registration.component';
import { VehicleCatalogComponent } from './components/vehicle-catalog/vehicle-catalog.component';
import { UserTransactionsComponent } from './components/user-transactions/user-transactions.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { VehicleManagementComponent } from './components/vehicle-management/vehicle-management.component';
import { AddVehicleDialogComponent } from './components/add-vehicle-dialog/add-vehicle-dialog.component';
import { EditVehicleDialogComponent } from './components/edit-vehicle-dialog/edit-vehicle-dialog.component';
import { DeleteVehicleDialogComponent } from './components/delete-vehicle-dialog/delete-vehicle-dialog.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'login', component: UserLoginComponent },
  { path: 'registration', component: UserRegistrationComponent },
  { path: 'vehicles', component: VehicleCatalogComponent },
  { path: 'transactions', component: UserTransactionsComponent },
  { path: 'profile', component: UserProfileComponent },
  { path: 'vehicle-management', component: VehicleManagementComponent },
  { path: 'add', component: AddVehicleDialogComponent },
  { path: 'edit', component: EditVehicleDialogComponent },
  { path: 'delete', component: DeleteVehicleDialogComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' }, // Default route
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
