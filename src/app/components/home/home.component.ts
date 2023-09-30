import { Component, OnInit } from '@angular/core';
import { CAMERA_PATH } from 'src/app/config/constants';
import { Vehicle } from 'src/app/interfaces/allTypes';
import { CameraService } from 'src/app/services/camera.service';
import { SocketService } from 'src/app/services/socket.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  lifeUrl: string = CAMERA_PATH

  constructor(
    private socket: SocketService,
    private cameraService: CameraService
  ) {}

  ngOnInit(): void {

    this.socket.getMessage().subscribe((data: any) => {

      let vehicle = this.cameraService.getVehicle()
      // Si en número de la placa está vacio guardamos
      if(vehicle.plate_number === "") {
        if(data.exists) {
          this.cameraService.setVehicle(data.vehicle)
          this.cameraService.setFound(true)
        } else{
          let vehicle = this.cameraService.getInitialData()
          vehicle.plate_number = data.vehicle.plate_number
          this.cameraService.setVehicle(vehicle)
          this.cameraService.setFound(false)
        }
        return
      }

      if(!this.cameraService.wasFound) {
        if(data.exists) {
          this.cameraService.setVehicle(data.vehicle)
          this.cameraService.setFound(true)
        }
      }

      // Si la placa no la habiamos detectado antes o es diferente
    })

    this.cameraService.vehicle$.subscribe((vehicle: Vehicle) => {
      console.log("Actualizado el detected")
      console.log(vehicle)
    })
  }

  showVideo() {
    this.lifeUrl = CAMERA_PATH
  }

  hideVideo() {
    this.lifeUrl = '../../../assets/img/security_camera.jpg'
  }
}
