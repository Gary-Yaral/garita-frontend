import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Vehicle } from '../interfaces/allTypes';

@Injectable({
  providedIn: 'root'
})
export class CameraService {
  constructor(private http: HttpClient) {}
  initialVehicle:Vehicle = {
    id: 0,
    plate_number: '',
    access_type_id: 0,
    status_type_id: 0,
    vehicle_type_id: 0
  }

  wasFound: boolean = false;
  detected: boolean = false;

  private vehicle = new BehaviorSubject<Vehicle>(this.getInitialData());
  vehicle$ = this.vehicle.asObservable();

  setVehicle(vehicle: Vehicle) {
    this.vehicle.next(vehicle);
  }
  setDetected(detected: boolean) {
    this.detected = detected
  }

  setFound(found: boolean) {
    this.wasFound = found
  }

  getVehicle() {
    return this.vehicle.value
  }

  getInitialData() {
    return structuredClone(this.initialVehicle)
  }

  restartData() {
    this.setVehicle(this.getInitialData())
  }
}

