import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Vehicle, VehicleType } from 'src/app/interfaces/allTypes';
import { CameraService } from 'src/app/services/camera.service';
import { StorageService } from 'src/app/services/storage.service';

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

  vehicle: Vehicle = {
    id: 0,
    plate_number: '',
    access_type_id: '',
    status_type_id: '',
    vehicle_type_id: ''
  }

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

  formData: FormGroup = new FormGroup({
    id: new FormControl('', Validators.required),
    plate_number: new FormControl('', Validators.required),
    access_type_id: new FormControl('', Validators.required),
    status_type_id: new FormControl('', Validators.required),
    vehicle_type_id: new FormControl('', Validators.required),
  })

  constructor(
    private cameraService: CameraService
  ) {}

  ngOnInit() {
    this.cameraService.vehicle$.subscribe((data: any) => {
      console.log(data);

      if(data) {
        this.vehicle = {...data}
        if(!this.vehicle.access_type_id) {
          this.vehicle.access_type_id = ""
        }
        if(!this.vehicle.vehicle_type_id) {
          this.vehicle.vehicle_type_id = ""
        }
        if(!this.vehicle.status_type_id) {
          this.vehicle.status_type_id = ""
        }
      } else {
        this.vehicle.plate_number = data.plate_number
      }
      this.prepareVehicleFormData()
    })

  }

  prepareVehicleFormData() {
    this.formData.get('id')?.setValue(this.vehicle.id)
    this.formData.get('plate_number')?.setValue(this.vehicle.plate_number)
    this.formData.get('access_type_id')?.setValue(this.vehicle.access_type_id)
    this.formData.get('status_type_id')?.setValue(this.vehicle.status_type_id)
    this.formData.get('vehicle_type_id')?.setValue(this.vehicle.vehicle_type_id)
  }

  hideForm() {
    this.showForm.emit(false);
  }
}
