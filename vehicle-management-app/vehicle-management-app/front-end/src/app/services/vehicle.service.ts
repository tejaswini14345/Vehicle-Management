import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Vehicle } from '../models/vehicle.model';

@Injectable({
  providedIn: 'root',
})
export class VehicleService {
  userProfile: any;
  private apiUrl = 'https://zgfiqz1qq9.execute-api.us-east-2.amazonaws.com/dev';

  constructor(private http: HttpClient) {}

  getVehicleCatalog(): Observable<Vehicle[]> {
    const catalogUrl = `${this.apiUrl}/vehicle-catalog`;
    return this.http.get<Vehicle[]>(catalogUrl);
  }

  getVehicleById(vehicleId: string): Observable<Vehicle> {
    const vehicleUrl = `${this.apiUrl}/vehicle-catalog/${vehicleId}`;
    return this.http.get<Vehicle>(vehicleUrl);
  }

  addVehicle(vehicle: Vehicle): Observable<Vehicle> {
    const addVehicleUrl = `${this.apiUrl}/vehicle-catalog`;
    // Adjust the request body based on your Lambda function requirements
    const requestBody = {
      vehicle_id: vehicle.vehicle_id,
      color: vehicle.color,
      make: vehicle.make,
      model: vehicle.model,
      price: vehicle.price,
      year: vehicle.year,
    };
    return this.http.post<Vehicle>(addVehicleUrl, requestBody);
  }

  updateVehicle(vehicle: Vehicle): Observable<Vehicle> {
    const updateVehicleUrl = `${this.apiUrl}/vehicle-catalog`; // Update the URL to match your API
    const requestBody = {
      vehicle_id: vehicle.vehicle_id,
      color: vehicle.color,
      make: vehicle.make,
      model: vehicle.model,
      price: vehicle.price,
      year: vehicle.year,
    };

    return this.http.put<Vehicle>(updateVehicleUrl, requestBody);
  }

  deleteVehicle(vehicleId: string): Observable<any> {
    const deleteVehicleUrl = `${this.apiUrl}/vehicle-catalog`; // Update the URL to match your API
    const requestBody = {
      vehicle_id: vehicleId,
    };

    return this.http.request('delete', deleteVehicleUrl, { body: requestBody });
  }

  purchaseVehicle(data: any): Observable<any> {
    console.log('data', data);
    this.userProfile = JSON.parse(localStorage.getItem('user_data') || '{}');
    const transactionUrl = `${this.apiUrl}/vehicle-transaction`;
    // Adjust the request body based on your Lambda function requirements
    const requestBody = {
      vehicle_id: data.vehicle_id,
      transaction_id: data.transaction_id,
      transaction_date: data.transaction_date,
      transaction_type: data.transaction_type,
      status: data.status,
      user_id: this.userProfile.user_id,
    };

    console.log('requestBody', requestBody);
    return this.http.post(transactionUrl, requestBody);
  }
}
