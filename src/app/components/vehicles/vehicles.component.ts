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
  fields: string[] = ['index','dni','name', 'surname', 'type']

  // Variables del formulario de editar
  isVisible: boolean = true;
  constructor(
    private cameraService: CameraService
  ) {

  }
  ngOnInit(): void {
  }

  receiveData(event: any) {
    this.isVisible = true
    console.log("hola", event);
  }

}
