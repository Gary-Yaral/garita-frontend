import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DriverLoaded, FilterType, Vehicle, VehicleType } from 'src/app/interfaces/allTypes';
import { CameraService } from 'src/app/services/camera.service';
import { StorageService } from 'src/app/services/storage.service';
import { INITIAL_DRIVER_DATA, INITIAL_VEHICLE_DATA } from 'src/app/utilities/constants';

@Component({
  selector: 'app-new-register',
  templateUrl: './new-register.component.html',
  styleUrls: ['./new-register.component.css']
})
export class NewRegisterComponent implements OnInit{
  @Output() showForm: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() vehicle_types: VehicleType[] = [] // Lista de typos de choferes
  @Input() access_types: VehicleType[] = [] // Lista de typos de choferes
  @Input() status_types: VehicleType[] = [] // Lista de typos de choferes

  errors:any = {
    plate_number: '',
    access_type_id: '',
    status_type_id: '',
    vehicle_type_id: '',
    name: '',
    surname: '',
    dni: '',
    driver_type_id: ''
  }

  initialVehicle: Vehicle = { ...INITIAL_VEHICLE_DATA }
  driver: DriverLoaded[] = []
  vehicle: Vehicle[] = []
  plateNumberLocked: boolean = true
  errorMsgDriverLoad: string = 'Escriba un número de cédula válido'
  driverLoadError = {
    error: false,
    msg: this.errorMsgDriverLoad
  }

  formData: FormGroup = new FormGroup({
    id: new FormControl('', Validators.required),
    plate_number: new FormControl('', Validators.required),
    status_type_id: new FormControl('', Validators.required)
  })

  constructor(
    private cameraService: CameraService
  ) {}

  ngOnInit() {
    this.cameraService.vehicle$.subscribe((data: any) => {
      if(data.id !== 0) {
        this.initialVehicle = {...data}
        // Rellenamos el formulario para enviar
        this.formData.get('id')?.setValue(this.initialVehicle.id)
        this.formData.get('plate_number')?.setValue(this.initialVehicle.plate_number)
        this.formData.get('status_type_id')?.setValue(this.initialVehicle.status_type_id)
        // filtramos para conseguir el nombre del tipo de vehicuo
        if(this.initialVehicle.access_type_id) {
          let gotType = this.vehicle_types.filter((type: VehicleType) => {
            return type.id === this.initialVehicle.vehicle_type_id
          })
          if(gotType.length > 0) {
            this.initialVehicle.vehicle_type_name =  gotType[0].name
          }
        }
        // filtramos para conseguir el nombre del tipo de acceso
        if(this.initialVehicle.vehicle_type_id) {
          let gotType = this.access_types.filter((type: FilterType) => {
            return type.id === this.initialVehicle.access_type_id
          })
          if(gotType.length > 0) {
            this.initialVehicle.access_type_name =  gotType[0].name
          }
        }
        // filtramos para conseguir el nombre del tipo de estado en que está
        if(this.initialVehicle.status_type_id) {
          let gotType = this.status_types.filter((type: FilterType) => {
            return type.id === this.initialVehicle.status_type_id
          })
          if(gotType.length > 0) {
            this.initialVehicle.status_type_name =  gotType[0].name
          }
        }
        // Añadimos en el arreglo de vehiculo
        this.vehicle.push(this.initialVehicle)
      } else {
        this.vehicle = []
        this.formData.reset()
        this.formData.get('plate_number')?.setValue(data.plate_number)
        this.errors.plate_number = 'Placa no existe en el sistema. Por favor registrela antes de guardar la información'
      }

      this.formData.get('plate_number')?.disabled
    })

  }

  enableInputPlate(event: any) {
    try {
      this.plateNumberLocked = !event.target.checked;
    } catch (error) {
      console.log(error);
    }
  }

  readPlate(event: any) {
    let value = event.target.value
    // Si intentan escribir espacios en blanco
    value = value.replaceAll(' ', '')
    this.formData.get('plate_number')?.setValue(value)
    // Si intentan escribir más de 10 caracteres
    if(value.length > 10) {
      value = value.slice(0, 10)
      this.formData.get('plate_number')?.setValue(value)
      this.errors.plate_number = 'Solo se permiten hasta 10 caracteres. No se admiten espacios en blanco'
    }

    if(/^[A-Z]{3}-\d{3,4}$/.exec(value)) {
      this.formData.get('plate_number')?.setValue(value)
      this.errors.plate_number = ''
    } else {
      this.errors.plate_number = 'Debes ingresar una placa válida'
    }
  }

  hideForm() {
    this.showForm.emit(false);
  }
}
