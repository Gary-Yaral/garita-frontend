import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Driver, DriverType } from 'src/app/interfaces/allTypes';
import { RestApiService } from 'src/app/services/rest-api.service';
import { cedulaEcuatorianaValidator } from 'src/app/utilities/functions';
import { nameRegex } from 'src/app/utilities/regExp';

@Component({
  selector: 'app-drivers',
  templateUrl: './drivers.component.html',
  styleUrls: ['./drivers.component.css']
})
export class DriversComponent implements OnInit {
  /** PROPIEDADES DE LA TABLA */
  sectionName:string = 'Choferes'
  path: string = 'http://localhost:4000/driver'
  theads: string[] = ['N°', 'Cédula', 'Apellidos', 'Nombres', 'Tipo', ' Opciones']
  fields: string[] = ['index','dni','name', 'surname', 'type']

  /** PROPIEDADES DEL COMPONENTE */
  hasChanged = false // Propiedad para refresh tabla
  isVisible:boolean = false // Propiedad para ocultar o mostrar formulario
  types: DriverType[] = [] // Lista de typos de choferes
  formTitle: string = ''

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
    type: ''
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
    private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.restApi.doGet(`${this.path}/types`).subscribe((data:any) => {
      try {
        if(data.result[0]) {
          this.types = data.result[1]
        }
      } catch (error) {
        console.log(error);
      }
    })
  }

  receiveData(data: any) {
    this.formTitle = 'Editar'
    this.isVisible = true
    this.selected = data
    this.formData.setValue(data)
  }

  showFormAddRegister() {
    this.formTitle = 'Agregar'
    this.isVisible = true
    this.selected = this.initialData
    this.formData.setValue(this.initialData)
  }

  closeModal() {
    this.isVisible = false
    this.selected = this.initialData

  }

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

  detectChange(event: any) {
    const name = event.target.name
    this.errorMessagesValidator[name](name)
    this.cdr.markForCheck()
  }

  prepareToSend() {
    this.enableAlertModal(
      "Atención",
      '¿Desea actualizar este registro?',
      'info',
      () => this.sendData(),
      () => this.modalAlert.isVisible = false
    )
    this.modalAlert.isVisible = true
  }

  enableAlertModal(title: string, message: string, icon:string, accept: Function, cancel: Function) {
    this.modalAlert.title = title
    this.modalAlert.message = message
    this.modalAlert.icon = icon
    this.modalAlert.actions.accept = accept
    this.modalAlert.actions.cancel = cancel
    this.modalAlert.isVisible = true
    this.cdr.markForCheck()
  }

  sendData() {
    this.modalAlert.isVisible = false
    if(this.formData.valid) {
      this.restApi.doPost(`${this.path}/update`, this.formData.value).subscribe((data:any) => {
        if(data.result[0]) {
          this.enableAlertModal(
            "Hecho",
            'Datos actualizados correctamente',
            'done',
            () => this.resetForm(),
            () => this.resetForm()
          )
          this.hasChanged = true
        }
        console.log(data);
      })
    }
  }

  resetForm() {
    this.formData.reset()
    this.formData.get('type_id')?.setValue('')
    this.isVisible = false
    this.modalAlert.isVisible = false
    this.hasChanged = false
    Object.keys(this.errors).forEach((key:string) => {
      this.errors[key] = ''
    })
  }
}
