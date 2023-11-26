import { AfterContentInit, Component, OnInit } from '@angular/core';
import { API_PATH, CAMERA_PATH } from 'src/app/config/constants';
import { VehicleType } from 'src/app/interfaces/allTypes';
import { CameraService } from 'src/app/services/camera.service';
import { RestApiService } from 'src/app/services/rest-api.service';
import { SocketService } from 'src/app/services/socket.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements AfterContentInit{
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

  vehicle_types: VehicleType[] = [] // Lista de typos de choferes
  access_types: VehicleType[] = [] // Lista de typos de choferes
  status_types: VehicleType[] = [] // Lista de typos de choferes
  wasDetected = false;
  iconSelected = this.icons.danger
  formVisible = false;
  lifeUrl: string = CAMERA_PATH
  pathService: string = `${API_PATH}/vehicle`

  constructor(
    private socket: SocketService,
    private cameraService: CameraService,
    private storageService: StorageService,
    private restApi: RestApiService
  ) {}

  ngOnInit(): void {
    // Leemos los datos del storage
    this.readStorageData()
    this.detectPlate()
  }

  ngAfterContentInit(): void {
    this.loadDataForm()
  }

  loadDataForm() {
    this.restApi.doGet(`${this.pathService}/data-form`).subscribe((data:any) => {
      if(data.result[0]) {
        this.storageService.setFormDataVehicle(data.result[1])
        this.access_types = data.result[1].access_types
        this.status_types = data.result[1].status_types
        this.vehicle_types = data.result[1].vehicles_types
      } else {
        console.error("No se ha podido cargar los datos para formulario de nuevo registro de vehículo")
      }
    })
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
