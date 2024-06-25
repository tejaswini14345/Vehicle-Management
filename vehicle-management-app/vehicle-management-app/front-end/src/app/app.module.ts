import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UserRegistrationComponent } from './components/user-registration/user-registration.component';
import { UserLoginComponent } from './components/user-login/user-login.component';
import { HomeComponent } from './components/home/home.component';
import { VehicleCatalogComponent } from './components/vehicle-catalog/vehicle-catalog.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { UserTransactionsComponent } from './components/user-transactions/user-transactions.component';
import { CartDialogComponent } from './components/cart-dialog/cart-dialog.component';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDialogModule } from '@angular/material/dialog';
import { MatOptionModule } from '@angular/material/core';
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';
import { AddVehicleDialogComponent } from './components/add-vehicle-dialog/add-vehicle-dialog.component';
import { EditVehicleDialogComponent } from './components/edit-vehicle-dialog/edit-vehicle-dialog.component';
import { VehicleManagementComponent } from './components/vehicle-management/vehicle-management.component';
import { DeleteVehicleDialogComponent } from './components/delete-vehicle-dialog/delete-vehicle-dialog.component';
import { MatSelectModule } from '@angular/material/select';

@NgModule({
  declarations: [
    AppComponent,
    UserRegistrationComponent,
    UserLoginComponent,
    HomeComponent,
    VehicleCatalogComponent,
    UserProfileComponent,
    UserTransactionsComponent,
    CartDialogComponent,
    LoadingSpinnerComponent,
    VehicleManagementComponent,
    AddVehicleDialogComponent,
    EditVehicleDialogComponent,
    DeleteVehicleDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatMenuModule,
    MatTableModule,
    MatPaginatorModule,
    MatDialogModule,
    MatOptionModule,
    ReactiveFormsModule,
    MatSelectModule
  ],
  exports: [],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
