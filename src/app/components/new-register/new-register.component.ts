import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { concat } from 'rxjs';
import { ROUTES_API } from 'src/app/config/constants';
import { DriverLoaded, Vehicle } from 'src/app/interfaces/allTypes';
import { CameraService } from 'src/app/services/camera.service';
import { ReloadService } from 'src/app/services/reload.service';
import { RestApiService } from 'src/app/services/rest-api.service';
import { CHANGES_TYPE, INITIAL_VEHICLE_DATA, MANDATORY_IF_HAVE_IDS, REGISTER_FORM_TYPES } from 'src/app/utilities/constants';
import { cedulaEcuatorianaFn } from 'src/app/utilities/functions';
import { textarea } from 'src/app/utilities/regExp';

@Component({
  selector: 'app-new-register',
  templateUrl: './new-register.component.html',
  styleUrls: ['./new-register.component.css']
})
export class NewRegisterComponent implements OnInit{
  @Output() showForm: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() formType: number = REGISTER_FORM_TYPES.NULL;


  // Datos para poder usar la ventana de alerta
  modalAlert: any = {
    title: '',
    isVisible: false,
    message: '',
    actions: {
      accept: () => {},
      cancel: () => {}
    }
  }

  errors:any = {
    plate_number: '',
    dni: '',
    kms: '',
    destiny: '',
    observation: '',
    general: ''
  }

  initialVehicle: Vehicle = { ...INITIAL_VEHICLE_DATA }
  driver: DriverLoaded[] = []
  vehicle: Vehicle[] = []
  kmRegex: RegExp = /^\d+(\.\d+)?(,\d+)?$/

  types = REGISTER_FORM_TYPES
  plateNumberLocked: boolean = true
  isMandatory = false
  dniLength = 10
  plateNumberLength = 10
  idLoaded: number = 0
  titleForm: string = 'Nuevo registro'
  errorMsgDriverLoad: string = 'Escriba un número de cédula válido'
  driverLoadError = {
    error: false,
    msg: this.errorMsgDriverLoad
  }


  formData: FormGroup = new FormGroup({
    vehicle_id: new FormControl('', Validators.required),
    dni: new FormControl('', Validators.required),
    driver_id: new FormControl('', Validators.required),
    plate_number: new FormControl('', Validators.required),
    status_type_id: new FormControl('', Validators.required),
    kms: new FormControl('', Validators.required),
    destiny: new FormControl('', Validators.required),
    observation: new FormControl('', Validators.required),
  })

  constructor(
    private cameraService: CameraService,
    private restApi: RestApiService,
    private reload: ReloadService

  ) {}

  ngOnInit() {
    this.formRegisterSubscription()
    this.cameraSubscription()
  }

  cameraSubscription() {
    if(this.formType === REGISTER_FORM_TYPES.DETECTED) {
      this.cameraService.vehicle$.subscribe((data: any) => {
        if(data.plate_number) {
          this.suscribeVehicle(data.plate_number)
        }
      })
    }
  }

  formRegisterSubscription() {
    if(this.formType !== REGISTER_FORM_TYPES.ADD) {
      this.reload.formActions$.subscribe((data:any)=> {
        this.formType = data.type
        if(data.type === REGISTER_FORM_TYPES.ADD) {
          this.titleForm = 'Nuevo registro'
          this.vehicle = []
          this.driver = []
          this.plateNumberLocked = false
        }
        if(data.type === REGISTER_FORM_TYPES.UPDATE) {
          this.titleForm = 'Editar registro'
          this.loadRegisterToUpdate(data.id)
          this.idLoaded = data.id
        }
      })
    }
  }

  enableInputPlate(event: any) {
    try {
      this.plateNumberLocked = !event.target.checked;
    } catch (error) {
      console.log(error);
    }
  }

  loadRegisterToUpdate(id: number) {
    this.restApi.doPost(`${ROUTES_API.register}/find-one`, {id}).subscribe((data:any) => {
      if(data.result[0]) {
        // Extramos los datos como variables
        let {
          id,
          plate_number,
          dni,
          observation,
          kms,
          destiny
        } = data.result[1]
        // Seteamos los datos en el formulario
        this.formData.get('id')?.setValue(id)
        this.formData.get('plate_number')?.setValue(plate_number)
        this.formData.get('kms')?.setValue(kms)
        this.formData.get('destiny')?.setValue(destiny)
        this.formData.get('dni')?.setValue(dni)
        this.formData.get('observation')?.setValue(observation)
        // Consultamos placa y dni
        this.doRequest(plate_number, dni)
      }
    })
  }

  doRequest(plate_number: string, dni: string) {
    let vehicleData: any ;
    let driverData: any;
    concat(this.getVehicle(plate_number), this.getDriver(dni)).subscribe((data: any) => {
      if(!vehicleData) {
        vehicleData = data;
      }
      if(vehicleData) {
        driverData = data;
      }
      if(vehicleData && driverData) {
        this.processVehicleData(vehicleData);
        this.processDriverData(driverData);
      }

    });
  }

  readPlate(event: any) {
    let value = event.target.value
    // Si intentan escribir espacios en blanco
    value = value.replaceAll(' ', '')
    this.formData.get('plate_number')?.setValue(value)
    // Si intentan escribir más de 10 caracteres
    if(value.length > this.plateNumberLength) {
      value = value.slice(0, this.plateNumberLength)
      this.formData.get('plate_number')?.setValue(value)
      this.errors.plate_number = 'Solo se permiten hasta 10 caracteres. No se admiten espacios en blanco'
    }

    if(/^[A-Z]{3}-\d{3,4}$/.exec(value)) {
      this.formData.get('plate_number')?.setValue(value)
      this.errors.plate_number = ''
      this.suscribeVehicle(value)
    } else {
      this.vehicle = []
      this.isMandatory = false
      this.errors.plate_number = 'Debes ingresar una placa válida'
    }
  }

  suscribeVehicle(plate_number:string) {
    this.formData.get('plate_number')?.setValue(plate_number)
    this.getVehicle(plate_number).subscribe((data: any) =>{
      this.processVehicleData(data)
    })
  }

  getVehicle(plate_number: string) {
    return this.restApi.doPost(`${ROUTES_API.vehicle}/find`, {plate_number})
  }

  processVehicleData(data:any) {
    if(data.result[0]) {
      this.vehicle = [data.result[1]]
      this.errors.plate_number = ''
      let vehicleTypeId = this.vehicle[0].vehicle_type_id
      this.formData.get('vehicle_id')?.setValue(this.vehicle[0].id)
      this.formData.get('status_type_id')?.setValue(this.vehicle[0].status_type_id)
      this.isMandatory = MANDATORY_IF_HAVE_IDS.includes(parseInt(`${vehicleTypeId}`))
    } else {
      this.vehicle = []
      this.formData.get('vehicle_id')?.reset()
      this.formData.get('status_type_id')?.reset()
      /* this.formData.get('plate_number')?.setValue(plate_number) */
      this.errors.plate_number = 'Placa no se encuentra registrada. Si desea agregar un registro con ella, primero vaya a la sección vehículos y desde ahí agregue el vehículo al que pertenece esa placa.'
    }
  }

  readDriver(event: any) {
    let value = event.target.value
    if(!cedulaEcuatorianaFn(value)) {
      // Verificamos que no sobrepase los 10 caracteres
      if(value.length > this.dniLength) {
        value = value.slice(0,this.dniLength)
        value = value.slice(0, this.plateNumberLength)
        event.target.value = value
      } else {
        this.driver = []
      }
      this.errors.dni = 'Escriba un número de cédula válido'
      return
    }
   this.suscribeDriver(value)
  }

  suscribeDriver(dni: string) {
    this.formData.get('driver_id')?.setValue(dni)
    this.getDriver(dni).subscribe((data:any) => this.processDriverData(data))
  }

  processDriverData(data:any) {
    if(data.result[0]) {
      this.errors.dni = ''
      this.driver = [data.result[1]]
      this.formData.get('driver_id')?.setValue(this.driver[0].id)
    } else {
      // Si no se encuentra la cedula limpiamos campos
      this.driver = []
      this.formData.get('driver_id')?.reset()
      this.errors.dni = 'Número de cédula no está registrado. Si desea agregar un registro usando esta cédula, debe agregar al chofer al que le pertenece esa cédula en la sección chofér'
    }
  }


  getDriver(dni: string) {
    return this.restApi.doPost(`${ROUTES_API.driver}/find`, {dni})
  }

  hideForm() {
    this.showForm.emit(false);
  }

  validateKm(event:any) {
    let value = event.target.value;
    // Quitamos los espacios en blanco
    value = value.replaceAll(' ', '')
    // Validamos no supere el numero de carcateres maximo 20
    if(value.length === 0) {
      event.target.value = value
      this.errors.kms = ''
      return
    }

    if(value.length > 20) {
      value = value.slice(0, 20)
      event.target.value = value
      if(!!this.kmRegex.exec(value)) {
        this.errors.kms = ''
      } else {
        this.errors.kms = 'Solo se admiten números enteros o decimales'
      }
      return
    }
    // Validamos que sean enteros o decimales
    if(!!this.kmRegex.exec(value)) {
      this.errors.kms = ''
      return
    }
    this.errors.kms = 'Solo se admiten números enteros o decimales'
  }

  validateObservation(event:any) {
    let value = event.target.value
    value = value.replaceAll('  ', ' ')
    event.target.value = value
    if(value === '') {
      this.errors.observation = ''
      return
    }
    if(value.length > 250) {
      value = value.slice(0, 250)
      event.target.value = value
    }

    if(!!textarea.exec(value)) {
      this.errors.observation = ''
      return
    }

    this.errors.observation = 'No se admiten espacios al principio ni al final. Asegurese de borrarlos antes de enviar.'

  }

  validateDestiny(event:any) {
    let value = event.target.value
    value = value.replaceAll('  ', ' ')
    event.target.value = value
    if(value === '') {
      this.errors.destiny = ''
      return
    }
    if(value.length > 100) {
      value = value.slice(0, 100)
      event.target.value = value
    }

    if(!!textarea.exec(value)) {
      this.errors.destiny = ''
      return
    }

    this.errors.destiny = 'No se admiten espacios al principio ni al final. Asegurese de borrarlos antes de enviar.'

  }

  /* Funcion para preparar las ventanas modal */
  enableAlertModal(title: string, message: string, icon:string, accept: Function, cancel: Function) {
  this.modalAlert.title = title
  this.modalAlert.message = message
  this.modalAlert.icon = icon
  this.modalAlert.actions.accept = accept
  this.modalAlert.actions.cancel = cancel
  this.modalAlert.isVisible = true
}

  /* Pregunta si desea agregar el registro */
  prepareToAdd() {
    this.enableAlertModal(
      "Atención",
      '¿Desea guardar este registro?',
      'info',
      () => this.addData(),
      () => this.modalAlert.isVisible = false
    )
  }

  /* Pregunta si deseamos editar los datos */
  prepareToUpdate() {
    this.enableAlertModal(
      "Atención",
      '¿Desea guardar los cambios?',
      'info',
      () => this.updateData(),
      () => this.modalAlert.isVisible = false
    )
  }

  addData() {
    if(this.validateDataToSend()) {
      this.restApi.doPost(`${ROUTES_API.register}/new`, this.formData.value).subscribe((data:any) => {
        if(data.result[0]) {
          this.enableAlertModal(
            "Hecho",
            'Registro agregado correctamente',
            'done',
            () => this.resetFormAndClose(),
            () => this.resetFormAndClose()
          )
          this.reload.addChanges({changes: true, type: CHANGES_TYPE.ADD})
          this.reload.wasSaved(true)
        } else{
          this.enableAlertModal(
            "Error",
            data.result[1].error,
            'error',
            () => {this.modalAlert.isVisible = false},
            () => {this.modalAlert.isVisible = false},
          )
        }
      })
    }
  }

  updateData() {
    if(this.validateDataToSend()) {
      let dataToSend = {...this.formData.value, id: this.idLoaded}
      this.restApi.doPost(`${ROUTES_API.register}/update`,dataToSend).subscribe((data:any) => {
        if(data.result[0]) {
          this.enableAlertModal(
            "Hecho",
            'Registro actualizado correctamente',
            'done',
            () => this.resetFormAndClose(),
            () => this.resetFormAndClose()
          )
          this.reload.addChanges({changes: true, type: CHANGES_TYPE.ADD})
          this.reload.wasSaved(true)
        } else{
          this.enableAlertModal(
            "Error",
            data.result[1].error,
            'error',
            () => {this.modalAlert.isVisible = false},
            () => {this.modalAlert.isVisible = false},
          )
        }
      })
    }
  }

  resetFormAndClose() {
    this.resetForm()
    this.hideForm()
  }

  resetForm() {
    this.formData.reset()
    this.modalAlert.isVisible = false
    this.vehicle = []
    this.driver = []
  }

  validateDataToSend() {
    if(this.isMandatory) {
      if(this.formData.valid) {
        this.errors.general = ''
        return true
      } else {
        this.errors.general = 'Debe llenar todos los campos'
        this.modalAlert.isVisible = false
        return false
      }
    } else {
      if(
        this.formData.get('plate_number')?.hasError('required') ||
        this.formData.get('dni')?.hasError('required') ||
        this.formData.get('vehicle_id')?.hasError('required') ||
        this.formData.get('status_type_id')?.hasError('required') ||
        this.formData.get('driver_id')?.hasError('required')
        ){
          this.errors.general = 'Debe llenar todos los campos'
          this.modalAlert.isVisible = false
          return false
        } else {
        this.errors.general = ''
        return true
      }
    }
  }

}
