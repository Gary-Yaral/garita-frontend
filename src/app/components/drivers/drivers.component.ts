import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ROUTES_API } from 'src/app/config/constants';
import { Driver, DriverType, ModalProps } from 'src/app/interfaces/allTypes';
import { ReloadService } from 'src/app/services/reload.service';
import { RestApiService } from 'src/app/services/rest-api.service';
import { CHANGES_TYPE, DEFAULT_DATA_MODAL } from 'src/app/utilities/constants';
import { cedulaEcuatorianaValidator } from 'src/app/utilities/functions';
import { nameRegex } from 'src/app/utilities/regExp';

@Component({
  selector: 'app-drivers',
  templateUrl: './drivers.component.html',
  styleUrls: ['./drivers.component.css']
})
export class DriversComponent implements OnInit{
  /** PROPIEDADES DE LA TABLA */
  sectionName:string = 'Choferes'
  path: string = ROUTES_API.driver // Ruta a donde se harán las peticiones
  theads: string[] = ['N°', 'Cédula', 'Nombres', 'Apellidos', 'Tipo', ' Opciones']
  fields: string[] = ['index','dni','name', 'surname', 'type']

  /** PROPIEDADES DEL COMPONENTE */
  isVisible:boolean = false // Propiedad para ocultar o mostrar formulario
  types: DriverType[] = [] // Lista de typos de choferes
  formTitle: string = '' // Titulo que tendrá el formulario
  areErrors: boolean = false // Si hay errores con los campos al enviar
  newRegister: boolean = false; // Si el formulario es o no para agregar nuevo

  // Datos para poder usar la ventana de alerta
  modalAlert: ModalProps = { ...DEFAULT_DATA_MODAL }
  // Datos para los mensajes de error del formulario modal
  errors: any = {
    dni: '',
    name: '',
    surname: '',
    type: ''
  }
  // Data inicial del formulario modal
  initialData: Driver = {
    dni: '',
    id: 0,
    name: '',
    surname: '',
    type_id: '',
    type: 'none'
  }

  // Validadores de todos los campos del formulario modal
  errorMessagesValidator: any = {
    dni: (name:string) => this.validateCC(name),
    name: (name:string) => this.validateName(name),
    surname: (name:string) => this.validateName(name),
    type_id: (name:string) => this.validateType(name)
  }
  // Inicializo el formulario con la data inicial
  selected: Driver = this.initialData

  // Datos del formulario
  formData: FormGroup = new FormGroup({
    id: new FormControl('', Validators.required),
    dni: new FormControl('', [Validators.required, cedulaEcuatorianaValidator()]),
    name: new FormControl('', [Validators.required, Validators.pattern(nameRegex)]),
    surname: new FormControl('', [Validators.required, Validators.pattern(nameRegex)]),
    type_id: new FormControl('', Validators.required),
    type: new FormControl('', Validators.required)
  })

  constructor(
    private restApi: RestApiService,
    private cdr: ChangeDetectorRef,
    private reload: ReloadService) {}

  ngOnInit(): void {
    if(this.types.length === 0) {
      this.loadTypes()
    }
  }

  loadTypes() {
    this.restApi.doGet(`${this.path}/types`).subscribe((data:any) => {
      if(data.result[0]) {
        this.types = data.result[1]
      } else {
        this.enableAlertModal(
          "Error",
          data.result[1].error,
          'error',
          () => this.modalAlert.isVisible = false,
          () => this.modalAlert.isVisible = false
        )
        console.log(data.result[1].error);
      }
    })
  }

  /* Funcion para preparar las ventanas modal */
  enableAlertModal(title: string, message: string, icon:string, accept: Function, cancel: Function) {
    this.modalAlert.title = title
    this.modalAlert.message = message
    this.modalAlert.icon = icon
    this.modalAlert.actions.accept = accept
    this.modalAlert.actions.cancel = cancel
    this.modalAlert.isVisible = true
    this.cdr.markForCheck()
  }

  /* Prepara los datos que serán actualizados y muestra el formulario editar */
  prepareFormToUpdate(data: any) {
    this.formTitle = 'Editar'
    if(this.types.length === 0) this.loadTypes()
    this.isVisible = true
    this.selected = data
    this.formData.setValue(data)
  }

  /* Limpia el formulario para ingresar nuevos datos y lo muestra */
  prepareFormToAdd() {
    this.formTitle = 'Agregar'
    this.isVisible = true
    this.selected = this.initialData
    this.loadTypes()
    this.formData.setValue(this.initialData)
    this.newRegister = true
  }

  /* Validaciones individuales de los campos */
  validateCC(name: string) {
    const input = this.formData.get(name)
    if (input?.value === "") {
      this.errors[name] = "Debes ingresar un número de cédula de identidad"
      return
    }
    if (input?.hasError('cedulaEcuatoriana')) {
      this.errors[name] = "Cedula invalida, asegurese de ingresar cédula valida con 10 dígitos"
      return
    }
    this.errors[name] = ""
  }

  validateName(name: string) {
    const input = this.formData.get(name)
    const txt = name === 'name' ? 'Nombre': 'Apellido'
    // Si esta vacio
    if (input?.value === "") {
      this.errors[name] = `Debes ingresar un ${txt.toLowerCase()}`
      return
    }
    // Si tiene espacios dobles, tambien al pricipio o al final
    if (input?.hasError('pattern')) {
      this.errors[name] = `${txt} invalido. No se aceptan espacios dobles, tampoco espacios al inicio o al final. Solo letras mayusculas y minúsculas, con o sin tilde`
      // Si aun teniendo el error intenta escribir más de 64 caracteres
      if(input?.value.length > 64) {
        input?.setValue(input?.value.slice(0,64));
        this.errors[name] = 'Solo se permiten hasta 64 caracteres'
        return
      }
      return
    }
    // Si intenta escribir más de 64 caracteres
    if(input?.value.length === 65) {
      input?.setValue(input?.value.slice(0,64));
      this.errors[name] = 'Solo se permiten hasta 64 caracteres'
      return
    }

    // Si intenta escribir más de dos nonbres
    const words = input?.value.split(' ')
    if(words.length > 2) {
      this.errors[name] = `Solo se permiten dos ${txt.toLowerCase()}s`
      return
    }
    // Si intenta escribir algunos de los datos muy largo
    if(words.length === 2) {
      if(words[0].length > 25 || words[1].length > 25) {
        this.errors[name] = `Los ${txt.toLowerCase()}s o alguno de ellos tiene más de 25 caracteres`
        return
      }
    }

    // Si intenta escribir un dato muy largo
    if(words.length === 1) {
      if(words[0].length > 25) {
        this.errors[name] = `El ${txt.toLowerCase()} tiene más de 25 caracteres`
        return
      }
    }
    // Si intenta escribir un nombre
    this.errors[name] = ""
  }

  validateType(name: string) {
    const input = this.formData.get(name)
    if (input?.value === "") {
      this.errors[name] = "Debes seleccionar el tipo de chofer"
      return
    }
    this.errors[name] = ""
  }

  /* Detecta cuando estamos escribriendo en los campos del formulario */
  detectChange(event: any) {
    const name = event.target.name
    this.errorMessagesValidator[name](name)
    this.cdr.markForCheck() // Actualiza la interfaz para mostrar los errores
  }

  /* Carga los datos del formulario de agregar nuevo */
  prepareToAdd() {
    this.enableAlertModal(
      "Atención",
      '¿Desea guardar este registro?',
      'info',
      () => this.addData(),
      () => this.modalAlert.isVisible = false
    )
  }

  /* Carga los datos del formulario de editar registro */
  prepareToUpdate() {
    this.enableAlertModal(
      "Atención",
      '¿Desea actualizar este registro?',
      'info',
      () => this.updateData(),
      () => this.modalAlert.isVisible = false
    )
  }

  /* Carga el id del registro que se desea eliminar */
  prepareToDelete(id:string | number) {
    this.enableAlertModal(
      "Atención",
      '¿Desea eliminar este registro?',
      'danger',
      () =>this.deleteData(id),
      () => this.modalAlert.isVisible = false
    )
  }

  /* Actualiza los datos de un registro de las base de datos*/
  updateData() {
    this.modalAlert.isVisible = false
    if(this.formData.valid) {
      this.restApi.doPost(`${this.path}/update`, this.formData.value).subscribe((data:any) => {
        if(data.result[0]) {
          this.enableAlertModal(
            "Hecho",
            'Datos actualizados correctamente',
            'done',
            () => this.resetFormAndClose(),
            () => this.resetFormAndClose()
          )
          this.reload.addChanges({changes: true, type: CHANGES_TYPE.UPDATE})
        } else {
          this.enableAlertModal(
            "Error",
            data.result[1].error,
            'error',
            () => {this.modalAlert.isVisible = false},
            () => {this.modalAlert.isVisible = false},
          )
        }
      })
    } else {
      this.areErrors = true
    }
  }

  /* Añade nuevo registro en la base de datos */
  addData() {
    this.modalAlert.isVisible = false
    if(this.formData.valid) {
      this.restApi.doPost(`${this.path}/new`, this.formData.value).subscribe((data:any) => {
        if(data.result[0]) {
          this.enableAlertModal(
            "Hecho",
            'Registro agregado correctamente',
            'done',
            () => this.resetFormAndClose(),
            () => this.resetFormAndClose()
          )
          this.reload.addChanges({changes: true, type: CHANGES_TYPE.ADD})
          this.areErrors = false
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
    } else {
      this.areErrors = true
    }
  }

  /* Elimina registro en la base de datos */
  deleteData(id:string | number) {
    this.modalAlert.isVisible = false
    this.areErrors = true
    this.restApi.doPost(`${this.path}/delete`, {id}).subscribe((data:any) => {
      if(data.result[0]) {
        this.enableAlertModal(
          "Hecho",
          'Registro eliminado correctamente',
          'done',
          () => this.resetFormAndClose(),
          () => this.resetFormAndClose()
        )
        this.reload.addChanges({changes: true, type: CHANGES_TYPE.DELETE})
        this.areErrors = false
      } else {
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

  /* Limpiar el formulario luego de realizar acción */
  resetFormAndClose() {
    this.formData.reset()
    this.formData.get('type_id')?.setValue('')
    this.isVisible = false
    this.modalAlert.isVisible = false
    this.newRegister = false
    this.selected = this.initialData
    this.areErrors = false
    Object.keys(this.errors).forEach((key:string) => {
      this.errors[key] = ''
    })
  }
}
