import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CAMERA_PATH } from '../config/constants';

@Injectable({
  providedIn: 'root'
})
export class CameraService {

  constructor(private http: HttpClient) {}

  getVideo(): Observable<Blob> {
    return this.http.get(CAMERA_PATH, { responseType: 'blob' });
  }
}
