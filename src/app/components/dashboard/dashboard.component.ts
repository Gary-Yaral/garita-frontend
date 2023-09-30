import { Component, OnInit } from '@angular/core';
import { Vehicle } from 'src/app/interfaces/allTypes';
import { CameraService } from 'src/app/services/camera.service';
import { SocketService } from 'src/app/services/socket.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit{
  icons = {
    done: {
      class:"fa-circle-check",
      color: "green-card",
    },
    danger: {
      class:"fa-circle-exclamation",
      color: "red-card"
    }
  }
  wasDetected = false;
  iconSelected = this.icons.danger
  formVisible = false;

  constructor(
    private socket: SocketService,
    private cameraService: CameraService,
    private storageService: StorageService
  ) {}

  ngOnInit(): void {
    const formData = this.storageService.getFormData()
    if(formData) {
      if(formData.id === 0) {
        this.iconSelected = this.icons.danger
        this.cameraService.setFound(false)
      } else {
        this.iconSelected = this.icons.done
        this.cameraService.setFound(true)
      }

      this.cameraService.setVehicle(formData)
      this.wasDetected = true

    }
    this.socket.getMessage().subscribe((data: any) => {

      let vehicle = this.cameraService.getVehicle()
      // Si en número de la placa está vacio guardamos
      if(vehicle.plate_number === "") {
        if(data.exists) {
          this.cameraService.setVehicle(data.vehicle)
          this.cameraService.setFound(true)
          this.iconSelected = this.icons.done
          this.wasDetected = true
          this.storageService.saveFormData(data.vehicle)
        } else{
          let vehicle = this.cameraService.getInitialData()
          vehicle.plate_number = data.vehicle.plate_number
          this.cameraService.setVehicle(vehicle)
          this.cameraService.setFound(false)
          this.iconSelected = this.icons.danger
          this.wasDetected = true
          this.storageService.saveFormData(data.vehicle)
        }
        return
      }

      if(!this.cameraService.wasFound) {
        if(data.exists) {
          this.cameraService.setVehicle(data.vehicle)
          this.cameraService.setFound(true)
          this.iconSelected = this.icons.done
          this.wasDetected = true
          this.storageService.saveFormData(data.vehicle)
        }
      }
    })

    this.cameraService.vehicle$.subscribe((vehicle: Vehicle) => {
      console.log("Actualizado el detected")
      console.log(vehicle)
    })
  }

  hideForm() {
    this.formVisible = false
  }
  showForm() {
    this.formVisible = true
  }
}
