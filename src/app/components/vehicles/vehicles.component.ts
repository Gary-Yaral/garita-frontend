import { Component, OnInit } from '@angular/core';
import { CameraService } from 'src/app/services/camera.service';

@Component({
  selector: 'app-vehicles',
  templateUrl: './vehicles.component.html',
  styleUrls: ['./vehicles.component.css']
})
export class VehiclesComponent implements OnInit {
  sectionName:string = 'Vehículos'
  path: string = 'http://localhost:4000/driver'
  pathLoads: string = '/load'
  constructor(
    private cameraService: CameraService
  ) {

  }
  ngOnInit(): void {
  }

}
