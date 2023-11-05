import { Component, OnInit } from '@angular/core';
import { driverKey } from 'src/app/interfaces/allTypes';
import { CameraService } from 'src/app/services/camera.service';

@Component({
  selector: 'app-vehicles',
  templateUrl: './vehicles.component.html',
  styleUrls: ['./vehicles.component.css']
})
export class VehiclesComponent implements OnInit {
  sectionName:string = 'Vehículos'
  path: string = 'http://localhost:4000/driver'
  theads: string[] = ['N°', 'Cédula', 'Apellidos', 'Nombres', 'Tipo', ' Opciones']
  fields: string[] = ['dni','name', 'surname', 'type']
  constructor(
    private cameraService: CameraService
  ) {

  }
  ngOnInit(): void {
  }

}
