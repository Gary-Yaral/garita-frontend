import { Component, OnInit } from '@angular/core';
import { CameraService } from 'src/app/services/camera.service';

@Component({
  selector: 'app-vehicles',
  templateUrl: './vehicles.component.html',
  styleUrls: ['./vehicles.component.css']
})
export class VehiclesComponent implements OnInit {
  constructor(
    private cameraService: CameraService
  ) {

  }
  ngOnInit(): void {
  }

}
