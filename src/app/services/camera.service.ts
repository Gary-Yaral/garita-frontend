import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CAMERA_PATH } from '../config/constants';
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
    access_type_name: '',
    status_type_id: 0,
    status_type_name: '',
    vehicle_type_id: 0,
    vehicle_type_name: '',
  }

  wasFound: boolean = false;
  detected: boolean = false;

  getVideo(): Observable<Blob> {
    return this.http.get(CAMERA_PATH, { responseType: 'blob' });
  }

  private vehicle = new BehaviorSubject<Vehicle>(this.initialVehicle);
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
}
