import { Component, OnInit } from '@angular/core';
import { CAMERA_PATH } from 'src/app/config/constants';
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
      color: "green",
    },
    danger: {
      class:"fa-circle-exclamation",
      color: "red"
    }
  }

  wasDetected = false;
  iconSelected = this.icons.danger
  formVisible = false;
  lifeUrl: string = CAMERA_PATH

  constructor(
    private socket: SocketService,
    private cameraService: CameraService,
    private storageService: StorageService
  ) {}

  ngOnInit(): void {
    // Leemos los datos del storage
    this.readStorageData()
    this.detectPlate()
  }

  readStorageData() {
    const formData = this.storageService.getFormData()
    if(formData) {
      const {vehicle, exists } = formData
      if(!exists) {
        this.iconSelected = this.icons.danger
        this.cameraService.setFound(false)
      } else {
        this.iconSelected = this.icons.done
        this.cameraService.setFound(true)
      }

      this.cameraService.setVehicle(vehicle)
      this.wasDetected = true
    }
  }

  detectPlate() {
    this.socket.getMessage().subscribe((data: any) => {

      let vehicle = this.cameraService.getVehicle()
      // Si en número de la placa está vacio guardamos
      if(vehicle.plate_number === "") {
        if(data.exists) {
          this.cameraService.setVehicle(data.vehicle)
          this.cameraService.setFound(true)
          this.iconSelected = this.icons.done
          this.wasDetected = true
          this.storageService.saveFormData(data.vehicle, data.exists)
        } else{
          let vehicle = this.cameraService.getInitialData()
          vehicle.plate_number = data.vehicle.plate_number
          this.cameraService.setVehicle(vehicle)
          this.cameraService.setFound(false)
          this.iconSelected = this.icons.danger
          this.wasDetected = true
          this.storageService.saveFormData(vehicle, data.exists)
        }
        return
      }

      if(!this.cameraService.wasFound) {
        if(data.exists) {
          this.cameraService.setVehicle(data.vehicle)
          this.cameraService.setFound(true)
          this.iconSelected = this.icons.done
          this.wasDetected = true
          this.storageService.saveFormData(data.vehicle, data.exists)
        }
      }
    })
  }

  hideForm() {
    this.formVisible = false
  }
  showForm() {
    this.formVisible = true
  }

  deleteData() {
    this.cameraService.restartData()
    this.storageService.clearDetectedData()
    this.wasDetected = false
  }
}
